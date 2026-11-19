'use strict';
async function redis(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: 'POST', headers: { Authorization: 'Bearer ' + process.env.UPSTASH_REDIS_REST_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(command), signal: AbortSignal.timeout(10000)
  });
  const value = await response.json();
  if (!response.ok || value.error) throw new Error('Storage unavailable');
  return value.result;
}
const ready = () => ['UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','TELEGRAM_BOT_TOKEN','TELEGRAM_CHAT_ID','CRON_SECRET'].every(name => process.env[name]);
async function deliver(id) {
  const key = 'vera:booking:delivery:' + id;
  if (!await redis(['SET', key, '1', 'NX', 'EX', 60])) return false;
  try {
    const raw = await redis(['HGET', 'vera:booking:outbox', id]);
    if (!raw) return true;
    const record = JSON.parse(raw);
    const price = (record.from ? 'od ' : '') + record.price + (record.maximum > record.price ? '–' + record.maximum : '') + ' zł';
    const text = ['🌸 Nowa prośba o wizytę', 'Nr: ' + id, '', record.name, 'Telefon: ' + record.phone,
      'Usługa: ' + record.service, ...record.extras.map(item => '+ ' + item.name + ' × ' + item.quantity),
      'Termin: ' + record.date + ', ' + record.time + ' (Polska)', 'Czas: ' + record.duration + ' min',
      'Cena: ' + price, 'Uwagi: ' + (record.note || '—'), '', 'Skontaktuj się z klientką, aby potwierdzić wizytę.',
      ...inboxLink()].join('\n');
    const response = await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({chat_id:process.env.TELEGRAM_CHAT_ID,text}),
      signal: AbortSignal.timeout(10000)
    });
    const value = await response.json();
    if (!response.ok || !value.ok) return false;
    await redis(['HDEL','vera:booking:outbox',id]);
    return true;
  } finally { await redis(['DEL',key]); }
}
function inboxLink() {
  try {
    const url = new URL(process.env.CRM_URL);
    if (url.protocol !== 'https:') return [];
    url.searchParams.set('bookings', '1');
    return ['Otwórz zgłoszenia w CRM: ' + url.href];
  } catch {
    return [];
  }
}
module.exports = { redis, ready, deliver };
