'use strict';
const crypto = require('node:crypto');
const webpush = require('web-push');
const DEVICES = 'vera:push:devices';
const ENV_KEYS = ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN',
  'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT', 'PUSH_ACCESS_KEY', 'CRON_SECRET'];

function authorized(request, secret) {
  const supplied = Buffer.from(request.headers.authorization || '');
  const expected = Buffer.from('Bearer ' + secret);
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

async function redis(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.UPSTASH_REDIS_REST_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error('Storage unavailable');
  const value = await response.json();
  if (value.error) throw new Error('Storage command failed');
  return value.result;
}

function validateSubscription(subscription) {
  try {
    const url = new URL(subscription.endpoint);
    // Only known push services can receive requests from this endpoint.
    const allowed = url.hostname === 'web.push.apple.com' ||
      url.hostname.endsWith('.push.apple.com') || url.hostname === 'fcm.googleapis.com' ||
      url.hostname === 'updates.push.services.mozilla.com' ||
      url.hostname.endsWith('.notify.windows.com');
    const { p256dh, auth } = subscription.keys;
    return allowed && url.protocol === 'https:' && !url.port && !url.username && !url.password &&
      subscription.endpoint.length < 2048 && /^[A-Za-z0-9_-]{87}$/.test(p256dh) &&
      /^[A-Za-z0-9_-]{22}$/.test(auth);
  } catch { return false; }
}

async function send(subscription, tag, test = false) {
  return webpush.sendNotification(subscription, JSON.stringify({
    title: 'Vera Beauty Room',
    body: test ? 'Powiadomienia działają. Dotknij, aby otworzyć CRM.' :
      'Czas przypomnieć klientkom o jutrzejszych wizytach. Otwórz gotowe SMS-y.',
    tag
  }), {
    vapidDetails: { subject: process.env.VAPID_SUBJECT, publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY },
    TTL: 43200, urgency: 'normal', timeout: 10000
  });
}

async function dailyReminders() {
  const tomorrow = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date(Date.now() + 86400000));
  const records = await redis(['HGETALL', DEVICES]);
  let failed = 0;
  let sent = 0;
  for (let i = 0; i < records.length; i += 2) {
    const deviceId = records[i];
    const device = JSON.parse(records[i + 1]);
    if (Date.now() - device.updatedAt > 90 * 86400000) {
      await redis(['HDEL', DEVICES, deviceId]);
      continue;
    }
    if (!device.dates.includes(tomorrow)) continue;
    const deliveryKey = 'vera:push:sent:' + deviceId + ':' + tomorrow;
    if (!await redis(['SET', deliveryKey, '1', 'EX', 172800, 'NX'])) continue;
    try {
      await send(device.subscription, 'vera-reminders-' + tomorrow);
      sent++;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await redis(['HDEL', DEVICES, deviceId]);
      } else {
        failed++;
      }
      await redis(['DEL', deliveryKey]);
    }
  }
  return { sent, failed };
}

module.exports = async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  const configured = ENV_KEYS.every(key => process.env[key]);
  if (request.method === 'GET' && request.query?.cron !== '1') {
    return response.status(200).json({ configured, publicKey: configured ? process.env.VAPID_PUBLIC_KEY : null });
  }
  if (!configured) return response.status(503).json({ error: 'Powiadomienia wymagają konfiguracji serwera.' });
  try {
    if (request.method === 'GET' && request.query?.cron === '1') {
      if (!authorized(request, process.env.CRON_SECRET)) return response.status(401).end();
      const result = await dailyReminders();
      return response.status(result.failed ? 503 : 200).json(result);
    }
    if (request.method !== 'POST') return response.status(405).end();
    if (!authorized(request, process.env.PUSH_ACCESS_KEY)) return response.status(401).json({ error: 'Nieprawidłowy kod połączenia.' });
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    if (!body || JSON.stringify(body).length > 30000 || !validateSubscription(body.subscription)) {
      return response.status(400).json({ error: 'Nieprawidłowa subskrypcja powiadomień.' });
    }
    const deviceId = crypto.createHash('sha256').update(body.subscription.endpoint).digest('hex');
    if (body.action === 'disable') {
      await redis(['HDEL', DEVICES, deviceId]);
    } else if (body.action === 'test') {
      if (!await redis(['SET', 'vera:push:test:' + deviceId, '1', 'EX', 60, 'NX'])) {
        return response.status(429).json({ error: 'Odczekaj minutę przed kolejnym testem.' });
      }
      await send(body.subscription, 'vera-push-test', true);
    } else if (body.action === 'sync') {
      if (!Array.isArray(body.dates) || body.dates.length > 400 ||
          !body.dates.every(date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) ||
          !Number.isSafeInteger(body.revision) || body.revision < 0) {
        return response.status(400).json({ error: 'Nieprawidłowy harmonogram.' });
      }
      const record = { subscription: body.subscription, dates: [...new Set(body.dates)],
        revision: body.revision, updatedAt: Date.now() };
      // Compare and write atomically so delayed requests cannot restore an older schedule.
      const script = "local old = redis.call('HGET', KEYS[1], ARGV[1]); " +
        "if old and cjson.decode(old).revision > tonumber(ARGV[2]) then return 0 end; " +
        "if not old and redis.call('HLEN', KEYS[1]) >= 5 then return -1 end; " +
        "redis.call('HSET', KEYS[1], ARGV[1], ARGV[3]); return 1";
      const result = await redis(['EVAL', script, 1, DEVICES, deviceId, body.revision, JSON.stringify(record)]);
      if (result === -1) return response.status(409).json({ error: 'Połączono już pięć urządzeń.' });
    } else {
      return response.status(400).json({ error: 'Nieznane działanie.' });
    }
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Push request failed', error.statusCode || error.name);
    return response.status(503).json({ error: 'Nie udało się połączyć z serwerem powiadomień. Spróbuj ponownie.' });
  }
};
