'use strict';

const crypto = require('node:crypto');
const { redis } = require('../vera-booking/lib/storage');
const recordsKey = 'vera:booking:records';
const sessionLifetime = 30 * 24 * 60 * 60;

function equal(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function signature(expiry, secret) {
  return crypto.createHmac('sha256', secret).update('vera-inbox:' + expiry).digest('hex');
}

function signedIn(req, secret) {
  const match = /(?:^|;\s*)vera_inbox=(\d+)\.([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '');
  return !!match && Number(match[1]) > Date.now() / 1000 && equal(match[2], signature(match[1], secret));
}

function setSession(res, value, age) {
  res.setHeader('Set-Cookie', 'vera_inbox=' + value + '; Path=/api/booking-inbox; Max-Age=' + age + '; HttpOnly; Secure; SameSite=Strict');
}

const decide = `
  local raw = redis.call('HGET', KEYS[1], ARGV[1])
  if not raw then return 0 end
  local record = cjson.decode(raw)
  if record.date ~= ARGV[3] then return 0 end
  if record.status == ARGV[2] then return 1 end
  if ARGV[2] == 'cancelled' then
    if record.status ~= 'confirmed' then return 0 end
  elseif record.status and record.status ~= 'pending' then
    return 0
  end
  record.status = ARGV[2]
  if record.status == 'declined' or record.status == 'cancelled' then
    local start = tonumber(string.sub(record.time, 1, 2)) * 60 + tonumber(string.sub(record.time, 4, 5))
    for minute = start, start + record.duration - 1, 5 do
      if redis.call('HGET', KEYS[2], tostring(minute)) == ARGV[1] then
        redis.call('HDEL', KEYS[2], tostring(minute))
      end
    end
    redis.call('HDEL', KEYS[3], ARGV[1])
  end
  redis.call('HSET', KEYS[1], ARGV[1], cjson.encode(record))
  return 1
`;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  const secret = process.env.BOOKING_INBOX_KEY;
  if (!secret || secret.length < 24 || !process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(503).json({error:'Skrzynka zapisów online nie jest jeszcze podłączona.'});
  }
  try {
    if (req.method === 'POST') {
      if (req.headers['x-vera-inbox'] !== '1') return res.status(403).end();
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body?.action === 'login') {
        if (typeof body.key !== 'string' || !equal(body.key, secret)) return res.status(401).json({error:'Sprawdź hasło dostępu.'});
        const expiry = String(Math.floor(Date.now() / 1000) + sessionLifetime);
        setSession(res, expiry + '.' + signature(expiry, secret), sessionLifetime);
        return res.status(200).json({ok:true});
      }
      if (body?.action === 'logout') {
        setSession(res, '', 0);
        return res.status(200).json({ok:true});
      }
      if (!signedIn(req, secret)) return res.status(401).json({error:'Zaloguj się ponownie.'});
      if (!['confirmed','declined','cancelled'].includes(body?.action) || !/^[a-f0-9-]{36}$/.test(body.id)) {
        return res.status(400).json({error:'Nieprawidłowe zgłoszenie.'});
      }
      let date = body.date;
      if (body.action === 'cancelled') {
        date = JSON.parse(await redis(['HGET', recordsKey, body.id]))?.date;
        if (!date) return res.status(409).json({error:'Nie znaleziono tej rezerwacji online.'});
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({error:'Nieprawidłowa data zgłoszenia.'});
      const result = await redis(['EVAL', decide, 3, recordsKey, 'vera:booking:day:' + date,
        'vera:booking:outbox', body.id, body.action, date]);
      return result === 1 ? res.status(200).json({ok:true}) : res.status(409).json({error:'Status zgłoszenia uległ zmianie. Odśwież listę.'});
    }
    if (req.method !== 'GET') return res.status(405).end();
    if (!signedIn(req, secret)) return res.status(401).json({error:'Zaloguj się, aby zobaczyć zgłoszenia.'});
    const entries = await redis(['HVALS', recordsKey]);
    const bookings = entries.map(raw => {
      const {fingerprint, ...booking} = JSON.parse(raw);
      return booking;
    }).filter(booking => !['declined','cancelled'].includes(booking.status));
    bookings.sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));
    return res.status(200).json({bookings});
  } catch {
    return res.status(503).json({error:'Nie udało się połączyć ze skrzynką. Spróbuj ponownie.'});
  }
};
