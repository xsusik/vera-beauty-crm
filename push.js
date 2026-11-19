/* Server reminders contain dates only. Client names, numbers and SMS text stay in the CRM. */
(() => {
  'use strict';
  const STORAGE_KEY = 'vera-push-connection';
  const api = new URL('./api/reminders', location.href).href;
  let connection;
  try { connection = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { connection = null; }
  let config;
  let subscription;
  let pendingDates = null;
  let revision = Date.now();
  let queue = Promise.resolve();
  let status = connection ? 'Łączenie z powiadomieniami…' : 'Powiadomienia są wyłączone.';
  let ready = false;

  function update(message) {
    status = message;
    document.dispatchEvent(new Event('vera-push-status'));
  }
  async function request(action, extra = {}) {
    const response = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + connection.key },
      body: JSON.stringify({ action, subscription: subscription.toJSON(), ...extra }),
      signal: AbortSignal.timeout(15000)
    });
    const value = await response.json();
    if (!response.ok) throw new Error(value.error || 'Błąd serwera powiadomień.');
    return value;
  }
  function sync(dates) {
    pendingDates = dates;
    if (!dates || !ready || !connection || !subscription) return;
    const requestedRevision = revision = Math.max(revision + 1, Date.now());
    update('Aktualizowanie przypomnień…');
    queue = queue.catch(() => {}).then(async () => {
      await request('sync', { dates, revision: requestedRevision });
      if (revision === requestedRevision) update('Powiadomienia włączone. Harmonogram aktualny.');
    }).catch(() => update('Harmonogram nie został zaktualizowany. Połącz się z internetem i otwórz CRM ponownie.'));
    return queue;
  }
  function supported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }
  function ios() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  async function init() {
    if (!supported()) {
      update('Na iPhonie dodaj CRM do ekranu początkowego w Safari, a następnie otwórz ją z ikony.');
      return;
    }
    try {
      const response = await fetch(api, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      config = await response.json();
      if (!response.ok || !config.configured) {
        update('Powiadomienia wymagają podłączenia serwera.');
        return;
      }
      if (!connection) { update('Gotowe do włączenia powiadomień.'); return; }
      const registration = await navigator.serviceWorker.ready;
      subscription = await registration.pushManager.getSubscription();
      ready = !!subscription && Notification.permission === 'granted';
      if (ready) sync(pendingDates);
      else update('Włącz ponownie powiadomienia na tym urządzeniu.');
    } catch {
      update('Brak połączenia z serwerem powiadomień. Spróbuj ponownie po połączeniu z internetem.');
    }
  }
  async function enable(key) {
    if (ios() && !navigator.standalone && !matchMedia('(display-mode: standalone)').matches) {
      throw new Error('Dodaj CRM do ekranu początkowego w Safari i otwórz ją z ikony.');
    }
    if (!supported()) throw new Error('Ta przeglądarka nie obsługuje powiadomień.');
    if (!config?.configured) throw new Error('Najpierw trzeba podłączyć serwer powiadomień.');
    if (!pendingDates) throw new Error('Najpierw przywróć dostęp do zapisanych danych CRM.');
    if (!key) throw new Error('Wpisz kod połączenia otrzymany przy konfiguracji.');
    // iOS requires this call directly from a user gesture.
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Zezwól na powiadomienia w ustawieniach iPhone’a.');
    const registration = await navigator.serviceWorker.ready;
    const decoded = atob(config.publicKey.replace(/-/g, '+').replace(/_/g, '/'));
    const publicKey = Uint8Array.from(decoded, char => char.charCodeAt(0));
    subscription = await registration.pushManager.getSubscription() ||
      await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: publicKey });
    const previous = connection;
    connection = { key };
    try {
      await request('sync', { dates: pendingDates, revision: revision = Math.max(Date.now(), revision + 1) });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
      ready = true;
      update('Powiadomienia włączone. Harmonogram aktualny.');
    } catch (error) {
      connection = previous;
      throw error;
    }
  }
  async function disable() {
    await queue;
    if (connection && subscription) await request('disable');
    ready = false;
    if (subscription) await subscription.unsubscribe();
    subscription = null;
    localStorage.removeItem(STORAGE_KEY);
    connection = null;
    update('Powiadomienia są wyłączone.');
  }
  window.VeraPush = {
    init, sync, enable, disable,
    test: () => request('test'),
    get status() { return status; },
    get enabled() { return ready; }
  };
  window.addEventListener('online', init);
})();
