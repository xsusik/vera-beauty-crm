(() => {
'use strict';
const KEY='vera-beauty-room-crm-v1';
const BACKUP_KEY=`${KEY}-backup-date`;
const BACKUP_INTERVAL_DAYS=7;
const UNDO_TIME=20000;
const INSTAGRAM='https://www.instagram.com/vera_beauty__room/';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const pad=n=>String(n).padStart(2,'0');
const dateStr=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseDate=s=>new Date(`${s}T12:00:00`);
const addDays=(date,n)=>{const d=new Date(date);d.setDate(d.getDate()+n);return d};
const startWeek=date=>{const d=new Date(date);d.setDate(d.getDate()-(d.getDay()+6)%7);d.setHours(12,0,0,0);return d};
const monthStart=d=>new Date(d.getFullYear(),d.getMonth(),1,12);
const sameMonth=(d,m)=>d.getMonth()===m.getMonth()&&d.getFullYear()===m.getFullYear();
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const currency=n=>new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:0}).format(Number(n)||0);
const datePL=(date,opts={day:'numeric',month:'long',year:'numeric'})=>parseDate(date).toLocaleDateString('pl-PL',opts);
const shortDay=d=>new Date(d).toLocaleDateString('pl-PL',{weekday:'short'}).replace('.','');
const monthLabel=d=>d.toLocaleDateString('pl-PL',{month:'long',year:'numeric'});
const id=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`v${Date.now()}${Math.random().toString(36).slice(2)}`;
const today=()=>dateStr(new Date());
const ico={
 dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
 appointments:'<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 2v4M16 2v4M4 10h16M8 14h3M8 17h6"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 sparkle:'<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3ZM19 17l.75 2.25L22 20l-2.25.75L19 23l-.75-2.25L16 20l2.25-.75L19 17Z"/>',
 wallet:'<rect x="2" y="6" width="20" height="15" rx="2"/><path d="M2 10h20M5 6V4a2 2 0 0 1 2-2h12"/><path d="M16 16h3"/>',
 settings:'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.9 1.9-.06-.06A1.65 1.65 0 0 0 16 18.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.39 1.11V21h-2.7v-.09A1.65 1.65 0 0 0 10.3 19a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06-1.9-1.9.06-.06A1.65 1.65 0 0 0 5.9 15a1.65 1.65 0 0 0-1.9-1.7H4v-2.7h.09A1.65 1.65 0 0 0 6 9a1.65 1.65 0 0 0-.42-1.82l-.06-.06 1.9-1.9.06.06A1.65 1.65 0 0 0 9.3 5.6 1.65 1.65 0 0 0 10.3 5a1.65 1.65 0 0 0 1.61-1.91V3h2.7v.09A1.65 1.65 0 0 0 16 5a1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.9 1.9-.06.06A1.65 1.65 0 0 0 20.4 9a1.65 1.65 0 0 0 1.6 1.6h.09v2.7H22A1.65 1.65 0 0 0 19.4 15Z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
 arrowRight:'<path d="M5 12h14m-6-6 6 6-6 6"/>',arrowLeft:'<path d="M19 12H5m6 6-6-6 6-6"/>',
 chevronLeft:'<path d="m15 18-6-6 6-6"/>',chevronRight:'<path d="m9 18 6-6-6-6"/>',chevronDown:'<path d="m6 9 6 6 6-6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',
 instagram:'<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
 facebook:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4"/>',
 pencil:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',trash:'<path d="M3 6h18M8 6V4h8v2M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.9L7.1 10a16 16 0 0 0 6.9 6.9l1.6-1.9a2 2 0 0 1 1.9-.6l2.8.5a2 2 0 0 1 1.7 2Z"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',trending:'<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
 card:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
 chart:'<path d="M3 3v18h18M7 16v-4M12 16V8M17 16V5"/>',
 note:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
 external:'<path d="M13 5h6v6M19 5l-9 9"/><path d="M19 13v6H5V5h6"/>',
 gift:'<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8H8a3 3 0 1 1 3-3l1 3ZM12 8h4a3 3 0 1 0-3-3l-1 3Z"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 checkCircle:'<circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/>',
 alert:'<path d="M12 2 2 20h20L12 2ZM12 9v4M12 17h.01"/>',
 mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>',
 shield:'<path d="M12 22S4 18 4 11V5l8-3 8 3v6c0 7-8 11-8 11Z"/><path d="m9 12 2 2 4-4"/>',
 reschedule:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 15h8m-3-3 3 3-3 3"/>',
 undo:'<path d="M9 5 4 10l5 5M4 10h10a5 5 0 0 1 0 10h-3"/>'
};
const icon=(name,size=18)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ico[name]||ico.sparkle}</svg>`;
const salonCatalog = [
 {
  "id": "vera-manicure",
  "name": "Kombinowany manicure",
  "category": "Paznokcie",
  "price": 60,
  "duration": 60,
  "active": true
 },
 {
  "id": "vera-hybrid",
  "name": "Manicure hybrydowy (jeden kolor)",
  "category": "Paznokcie",
  "price": 130,
  "duration": 90,
  "active": true
 },
 {
  "id": "vera-extensions",
  "name": "Przedłużanie żelowe (od 190 zł)",
  "category": "Paznokcie",
  "price": 190,
  "duration": 150,
  "active": true
 },
 {
  "id": "vera-fantasy",
  "name": "French konstrukcyjny (fantasy) (od 220 zł)",
  "category": "Paznokcie",
  "price": 220,
  "duration": 180,
  "active": true
 },
 {
  "id": "vera-refill",
  "name": "Uzupełnienie żelowe (jeden kolor)",
  "category": "Paznokcie",
  "price": 160,
  "duration": 120,
  "active": true
 },
 {
  "id": "vera-natural",
  "name": "Żel na naturalnej płytce paznokci",
  "category": "Paznokcie",
  "price": 160,
  "duration": 120,
  "active": true
 },
 {
  "id": "vera-remove-hybrid",
  "name": "Ściąganie hybrydy",
  "category": "Paznokcie",
  "price": 30,
  "duration": 30,
  "active": true
 },
 {
  "id": "vera-remove-gel",
  "name": "Ściąganie żelu",
  "category": "Paznokcie",
  "price": 40,
  "duration": 45,
  "active": true
 },
 {
  "id": "vera-pedicure",
  "name": "Pedicure klasyczny",
  "category": "Stopy",
  "price": 100,
  "duration": 60,
  "active": true
 },
 {
  "id": "vera-pedicure-hybrid",
  "name": "Pedicure hybrydowy",
  "category": "Stopy",
  "price": 130,
  "duration": 90,
  "active": true
 },
 {
  "id": "vera-pedicure-full",
  "name": "Pełny pedicure",
  "category": "Stopy",
  "price": 160,
  "duration": 120,
  "active": true
 },
 {
  "id": "vera-brows-henna",
  "name": "Regulacja + henna",
  "category": "Brwi i rzęsy",
  "price": 60,
  "duration": 45,
  "active": true
 },
 {
  "id": "vera-brows",
  "name": "Regulacja",
  "category": "Brwi i rzęsy",
  "price": 20,
  "duration": 30,
  "active": true
 },
 {
  "id": "vera-french",
  "name": "French / babyboomer",
  "category": "Paznokcie",
  "price": 20,
  "duration": 30,
  "active": true
 },
 {
  "id": "vera-design",
  "name": "Wzorki (1 paznokieć) (5–15 zł)",
  "category": "Paznokcie",
  "price": 5,
  "duration": 10,
  "active": true
 },
 {
  "id": "vera-other-stylist",
  "name": "Ściąganie po innej stylistce",
  "category": "Paznokcie",
  "price": 20,
  "duration": 30,
  "active": true
 },
 {
  "id": "vera-feet-french",
  "name": "French (pedicure)",
  "category": "Stopy",
  "price": 20,
  "duration": 20,
  "active": true
 }
];
function includeSalonCatalog(value){
 if(value.salonCatalogVersion === 1)return value;
 const names=new Set(value.services.map(s=>String(s.name).trim().toLocaleLowerCase("pl")));
 const ids=new Set(value.services.map(s=>s.id));
 const missing=salonCatalog.filter(s=>!ids.has(s.id)&&!names.has(s.name.toLocaleLowerCase("pl")));
 return {...value,salonCatalogVersion:1,services:[...value.services,...missing.map(s=>({...s}))]};
}
const seed=()=>includeSalonCatalog({version:1,demo:false,clients:[],services:[],appointments:[],waitlist:[],settings:{
 businessName:'Vera Beauty Room',instagram:INSTAGRAM,facebook:'',phone:'',address:'',startTime:'09:00',endTime:'19:00',breakStart:'',breakEnd:''
}});
function normalizeData(value){
 if(!value||!Array.isArray(value.clients)||!Array.isArray(value.services)||!Array.isArray(value.appointments)||
    !value.settings||typeof value.settings!=='object'||Array.isArray(value.settings))throw new Error('Nieprawidłowy format danych CRM.');
 return {...value,waitlist:Array.isArray(value.waitlist)?value.waitlist:[],settings:{...seed().settings,...value.settings}};
}
function withoutDemo(value){
 const clients=value.clients.filter(c=>!String(c.id).startsWith('demo-c'));
 const appointments=value.appointments.filter(a=>!String(a.id).startsWith('demo-a')&&clients.some(c=>c.id===a.clientId));
 const used=new Set(appointments.map(a=>a.serviceId));
 const services=value.services.filter(s=>!/^s[0-5]$/.test(String(s.id))||used.has(s.id));
 return {...value,clients,appointments,services,demo:false};
}
let storedData=null;
let readFailed=false;
function load(){
 try{
  storedData=localStorage.getItem(KEY);
  if(storedData===null)return seed();
  const value=normalizeData(JSON.parse(storedData));
  return includeSalonCatalog(value.demo?withoutDemo(value):value);
 }catch(error){
  readFailed=true;
  console.warn('Nie można odczytać danych CRM',error);
  return seed();
 }
}
let data=load();
const ui={page:'dashboard',search:'',status:'all',calendarView:'week',calendarDate:new Date(),month:new Date(),modal:null,mobile:false,installReady:false,agendaDay:0};
const undoEntries=new Map();
let backupDate='';
try{backupDate=localStorage.getItem(BACKUP_KEY)||''}catch(error){console.warn('Nie można odczytać daty kopii zapasowej',error)}
let installPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{
 event.preventDefault();
 installPrompt=event;
 ui.installReady=true;
 if(!ui.modal)render();
});
window.addEventListener('appinstalled',()=>{
 installPrompt=null;
 ui.installReady=false;
 if(!ui.modal)render();
 toast('Aplikacja została zainstalowana');
});
function save(next,report=toast,replaceUnreadable=false){
 try{
  if(readFailed&&!replaceUnreadable){report('Nie udało się odczytać zapisanych danych. Wczytaj kopię JSON w ustawieniach.');return false}
  if(localStorage.getItem(KEY)!==storedData){report('Dane zmieniły się w innej karcie. Zapisz treść formularza osobno i odśwież aplikację.');return false}
  const serialized=JSON.stringify(next);
  localStorage.setItem(KEY,serialized);
  storedData=serialized;
  readFailed=false;
  data=next;
  syncPushSchedule();
  return true;
 }catch(error){
  console.error('Nie można zapisać danych CRM',error);
  report('Nie udało się zapisać danych. Sprawdź ustawienia przeglądarki i wolne miejsce, a potem spróbuj ponownie.');
  return false;
 }
}
function toast(message,action){
 const notice=document.createElement('div');
 notice.className='toast';
 notice.innerHTML=`<span>${esc(message)}</span>${action?btn(`${icon(action.icon,15)} ${esc(action.label)}`,action.name,`data-id="${esc(action.id)}"`,'toast-action'):''}`;
 $('#toast-root').append(notice);
 setTimeout(()=>notice.remove(),action?UNDO_TIME:4800);
 return notice;
}
function withRecord(key,record){
 const records=data[key];
 return {...data,[key]:records.some(item=>item.id===record.id)
  ? records.map(item=>item.id===record.id?record:item)
  : [...records,record]};
}
const client=id=>data.clients.find(c=>c.id===id);
const service=id=>data.services.find(s=>s.id===id);
const sortedAppointments=()=>[...data.appointments].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
const upcoming=()=>sortedAppointments().filter(a=>a.status==='scheduled'&&a.date+a.time>=today()+new Date().toTimeString().slice(0,5));
const apName=a=>client(a.clientId)?.name||'Usunięta klientka';
const svcName=a=>service(a.serviceId)?.name||'Usunięta usługa';
const paid=ap=>ap.status==='completed'&&ap.payment==='paid';
const apPrice=ap=>Number(ap.price??service(ap.serviceId)?.price??0);
const appointmentDuration=a=>Number(a.duration??service(a.serviceId)?.duration)||60;
const timeInMinutes=time=>Number(time.slice(0,2))*60+Number(time.slice(3,5));
const minuteLabel=value=>`${pad(Math.floor(value/60))}:${pad(value%60)}`;
const dayInMinutes=date=>Date.parse(`${date}T00:00:00Z`)/60000;
const appointmentStart=a=>dayInMinutes(a.date)+timeInMinutes(a.time);
const initials=name=>String(name||'?').split(/\s+/).map(x=>x.charAt(0)).slice(0,2).join('').toUpperCase();
const inMonth=(a,d)=>a.date.slice(0,7)===dateStr(d).slice(0,7);
const paidMonth=d=>data.appointments.filter(a=>paid(a)&&inMonth(a,d)).reduce((sum,a)=>sum+apPrice(a),0);
const presentMonth=new Date();
const formatDateTime=a=>`${datePL(a.date,{day:'numeric',month:'short'})}, ${esc(a.time)}`;
const statusName=x=>({scheduled:'Zaplanowana',completed:'Zakończona',cancelled:'Anulowana',paid:'Opłacona',unpaid:'Nieopłacona'})[x]||x;
const badge=x=>`<span class="status ${esc(x)}"><span class="dot"></span>${esc(statusName(x))}</span>`;
const btn=(label,act,extra='',style='')=>`<button class="btn ${style}" type="button" data-action="${act}" ${extra}>${label}</button>`;
const noResults=(title,subtitle,action,act)=>`<div class="empty"><div class="empty-icon">${icon('calendar',26)}</div><h3>${esc(title)}</h3><p>${esc(subtitle)}</p>${action?btn(esc(action),act):''}</div>`;
const bookingInbox = {bookings:[], mode:'loading', busy:false, error:''};
const bookingAppointmentId = id => 'online-' + id;
const onlineBookingId = appointment => /^online-([a-f0-9-]{36})$/.exec(appointment.id)?.[1];
const importedBooking = id => (data.importedBookings || []).includes(id) ||
 data.appointments.some(a => a.id === bookingAppointmentId(id));

function inboxPrice(booking) {
 const min = currency(booking.price);
 return (booking.from ? 'od ' : '') + min +
  (booking.maximum > booking.price ? ' – ' + currency(booking.maximum) : '');
}

function bookingInboxPage() {
 const headingHtml = heading('Zapisy online','Potwierdź zgłoszenia z witryny i dodaj je do kalendarza.',
  bookingInbox.mode === 'ready' ? btn('Odśwież','booking-refresh','','secondary') : '');
 const error = bookingInbox.error ? `<p class="notice" role="alert">${esc(bookingInbox.error)}</p>` : '';
 if (bookingInbox.mode === 'login') {
  return headingHtml + `<form class="card inbox-access" id="booking-login">
   <h2>Dostęp właścicielki</h2>
   <label for="booking-key">Hasło do zapisów online</label>
   <input class="form-input" id="booking-key" name="key" type="password" required autocomplete="current-password">
   ${error}<button class="btn" type="submit">Otwórz zgłoszenia</button></form>`;
 }
 if (bookingInbox.mode !== 'ready') {
  return headingHtml + `<div class="card inbox-access">${error ||
   '<p role="status">Pobieranie zgłoszeń…</p>'}
   ${bookingInbox.mode === 'error' ? btn('Spróbuj ponownie','booking-refresh','','secondary') : ''}</div>`;
 }
 const visible = bookingInbox.bookings.filter(booking => !importedBooking(booking.id));
 const cards = visible.map(booking => {
  const confirmed = booking.status === 'confirmed';
  const attrs = `data-id="${esc(booking.id)}" ${bookingInbox.busy ? 'disabled' : ''}`;
  const extras = Array.isArray(booking.extras) ? booking.extras : [];
  return `<article class="card inbox-card">
   <div class="inbox-card-head"><div><span class="inbox-tag">${confirmed ? 'Potwierdzone' : 'Nowe zgłoszenie'}</span>
   <h2>${esc(booking.name)}</h2><a href="tel:${esc(booking.phone)}">${esc(booking.phone)}</a></div>
   <div class="inbox-when"><strong>${esc(booking.time)}</strong><time datetime="${esc(booking.date)}">${datePL(booking.date,{day:'numeric',month:'long',year:'numeric'})}</time></div></div>
   <dl><div><dt>Usługa</dt><dd>${esc(booking.service)}</dd></div>
    ${extras.length ? `<div><dt>Dodatki</dt><dd>${extras.map(extra => esc(extra.name) + ' × ' + esc(extra.quantity)).join(', ')}</dd></div>` : ''}
    <div><dt>Czas i cena</dt><dd>${esc(booking.duration)} min · ${esc(inboxPrice(booking))}</dd></div>
    ${booking.note ? `<div><dt>Uwagi</dt><dd>${esc(booking.note)}</dd></div>` : ''}</dl>
   <div class="inbox-actions">${btn(confirmed ? 'Dodaj do kalendarza' : 'Potwierdź i dodaj','booking-confirm',attrs)}
   ${confirmed ? '' : btn('Odrzuć','booking-decline',attrs,'secondary')}</div>
  </article>`;
 }).join('');
 return headingHtml + error + (cards ? '<div class="inbox-grid">' + cards + '</div>' :
  '<div class="card inbox-access"><h2>Wszystko przejrzane</h2><p>Nowe zgłoszenia pojawią się tutaj.</p></div>') +
  `<div class="inbox-footer">${btn('Wyloguj ze skrzynki','booking-logout','','secondary sm')}</div>`;
}

async function bookingInboxRequest(payload) {
 const response = await fetch('./api/booking-inbox', {
  cache:'no-store', signal:AbortSignal.timeout(15000),
  ...(payload ? {method:'POST', headers:{'Content-Type':'application/json','X-Vera-Inbox':'1'},
   body:JSON.stringify(payload)} : {})
 });
 const result = await response.json().catch(() => ({}));
 if (!response.ok) {
  const error = new Error(result.error || 'Skrzynka zapisów online jest niedostępna.');
  error.status = response.status;
  throw error;
 }
 return result;
}

function renderBookingInbox() {
 if (ui.page === 'booking-inbox' && !ui.modal) renderPage();
}

async function refreshBookingInbox(payload) {
 if (bookingInbox.busy) return;
 bookingInbox.busy = true;
 bookingInbox.error = '';
 if (!payload) renderBookingInbox();
 try {
  if (payload) await bookingInboxRequest(payload);
  bookingInbox.bookings = payload?.action === 'logout' ? [] : (await bookingInboxRequest()).bookings;
  bookingInbox.mode = payload?.action === 'logout' ? 'login' : 'ready';
 } catch (error) {
  bookingInbox.error = error.message;
  bookingInbox.mode = error.status === 401 ? 'login' : 'error';
  bookingInbox.bookings = [];
 } finally {
  bookingInbox.busy = false;
  renderBookingInbox();
 }
}

function importBooking(booking) {
 if (importedBooking(booking.id)) return true;
 const onlineId = bookingAppointmentId(booking.id);
 const existingClient = data.clients.find(c => {
  const digits = String(c.phone || '').replace(/\D/g,'').replace(/^00/,'');
  return (digits.length === 9 ? '48' + digits : digits) === booking.phone.slice(1) &&
   c.name.trim().toLocaleLowerCase('pl') === booking.name.trim().toLocaleLowerCase('pl');
 });
 const customer = existingClient || {id:onlineId,name:booking.name,phone:booking.phone,email:'',notes:'',createdAt:today()};
 const catalogEntry = salonCatalog.find(s => s.name === booking.service ||
  s.name.startsWith(booking.service + ' (od '));
 const existingService = service(catalogEntry?.id) || data.services.find(s => s.name === booking.service);
 const treatment = existingService || {id:onlineId,name:booking.service,category:catalogEntry?.category || 'Inne',
  duration:booking.duration,price:booking.price,active:true};
 const extras = Array.isArray(booking.extras) ? booking.extras : [];
 const visit = {
  id:onlineId, clientId:customer.id, serviceId:treatment.id,
  date:booking.date,time:booking.time,duration:booking.duration,price:booking.price,
  status:'scheduled',payment:'unpaid',confirmed:true,
  note:[booking.note,...extras.map(extra => extra.name + ' × ' + extra.quantity),
   (booking.from || booking.maximum > booking.price) ? 'Cena z zapisów online: ' + inboxPrice(booking) : ''].filter(Boolean).join('\n')
 };
 if (hasOverlap(visit)) {
  toast('Ten termin nakłada się na inną wizytę. Skontaktuj się z klientką.');
  return false;
 }
 return save({
  ...data,
  clients:existingClient ? data.clients : [...data.clients,customer],
  services:existingService ? data.services : [...data.services,treatment],
  appointments:[...data.appointments,visit],
  importedBookings:[...(data.importedBookings || []),booking.id]
 });
}

async function decideBooking(id, action) {
 const booking = bookingInbox.bookings.find(item => item.id === id);
 if (!booking || bookingInbox.busy || readFailed || importedBooking(id)) return;
 if (action === 'declined' && !window.confirm('Odrzucić zgłoszenie? Godzina znów będzie widoczna na stronie zapisów.')) return;
 if (action === 'confirmed' && hasOverlap({
  id:bookingAppointmentId(id),date:booking.date,time:booking.time,duration:booking.duration,status:'scheduled'
 })) return toast('Ten termin nakłada się na inną wizytę. Skontaktuj się z klientką.');
 bookingInbox.busy = true;
 bookingInbox.error = '';
 renderBookingInbox();
 try {
  if (booking.status !== action) await bookingInboxRequest({action,id,date:booking.date});
  booking.status = action;
  if (action === 'declined') {
   bookingInbox.bookings = bookingInbox.bookings.filter(item => item.id !== id);
   toast('Odrzucono zgłoszenie. Termin zwolniony.');
  } else if (importBooking(booking)) {
   ui.calendarDate = new Date(booking.date + 'T12:00:00');
   ui.month = new Date(ui.calendarDate);
   go('calendar');
   toast('Wizyta dodana do kalendarza. Daj znać klientce, że termin jest potwierdzony.');
  }
 } catch (error) {
  bookingInbox.error = error.message;
  if (error.status === 401) {
   bookingInbox.mode = 'login';
   bookingInbox.bookings = [];
  }
 } finally {
  bookingInbox.busy = false;
  renderBookingInbox();
 }
}
function navLink(page,label,symbol,group='main') {return `<button class="nav-link ${ui.page===page?'active':''}" data-action="navigate" data-page="${page}">${icon(symbol)}<span>${label}</span>${page==='appointments'&&upcoming().length?`<span class="mini-count">${upcoming().length}</span>`:''}</button>`}
function shell(){const pages={dashboard:'Plan dnia',calendar:'Kalendarz',appointments:'Wizyty','booking-inbox':'Zapisy online',clients:'Klientki',services:'Usługi',finance:'Finanse',settings:'Ustawienia'};return `
<div class="app-shell"><div class="mobile-backdrop ${ui.mobile?'open':''}" data-action="close-menu"></div>
<aside id="side-menu" class="sidebar ${ui.mobile?'open':''}">
<div class="brand"><div class="brand-mark">V</div><div class="brand-title">vera beauty <small>studio manager</small></div></div>
<div class="nav-label">ZARZĄDZANIE</div>
${navLink('dashboard','Plan dnia','dashboard')}${navLink('calendar','Kalendarz','calendar')}${navLink('appointments','Wizyty','appointments')}${navLink('booking-inbox','Zapisy online','bell')}${navLink('clients','Klientki','users')}${navLink('services','Usługi i cennik','sparkle')}
<div class="nav-label" style="margin-top:20px">BIZNES</div>${navLink('finance','Finanse','wallet')}${navLink('settings','Ustawienia','settings')}
<div class="sidebar-spacer"></div>
<div class="side-footer"><div class="avatar">V</div><div><strong>Vera Beauty Room</strong><small>Panel właścicielki</small></div>${icon('chevronDown',14)}</div></aside>
<div class="main"><header class="topbar"><div class="topbar-left"><button class="mobile-toggle" data-action="toggle-menu" aria-label="Otwórz menu">${icon('menu')}</button><span class="mobile-brand">${esc(data.settings.businessName)}</span><div class="breadcrumbs"><span class="path-first">Studio Manager</span><span class="path-first">/</span><b>${pages[ui.page]}</b></div></div><div class="top-right"><div class="global-search">${icon('search',15)}<input data-role="global-search" placeholder="Szukaj w bieżącej sekcji..." aria-label="Szukaj" value="${esc(ui.search)}"></div><button class="btn secondary install-button" data-action="install-app" aria-label="Zainstaluj aplikację" ${ui.installReady?'':'hidden'}>${icon('download',15)} Zainstaluj</button><button class="top-icon" data-action="navigate" data-page="booking-inbox" aria-label="Zapisy online">${icon('bell',19)}</button><div class="top-user"><div class="avatar">V</div><div><b>Vera Beauty</b><span>Właścicielka</span></div></div></div></header>
<main class="page" id="page-content">${pageContent()}</main></div>
<nav class="mobile-nav" aria-label="Nawigacja główna">${[['dashboard','Plan dnia','dashboard'],['calendar','Kalendarz','calendar'],['appointments','Wizyty','appointments'],['clients','Klientki','users']].map(([page,label,symbol])=>`<button type="button" data-action="navigate" data-page="${page}" ${ui.page===page?'aria-current="page"':''}>${icon(symbol,21)}<span>${label}</span></button>`).join('')}<button type="button" data-action="toggle-menu" aria-expanded="${ui.mobile}" aria-controls="side-menu">${icon('menu',21)}<span>Więcej</span></button></nav></div><div id="modal-root">${modalHtml()}</div>`}
function render(){document.querySelector('#app').innerHTML=shell()}
function renderPage(){$('#page-content').innerHTML=pageContent()}
function go(page){ui.page=page;ui.search='';ui.mobile=false;ui.status='all';render();window.scrollTo({top:0,behavior:'instant'});if(page==='booking-inbox')void refreshBookingInbox()}
function startAppointment(options={}){
 if(!data.services.some(s=>s.active)){openModal('service',{returnToAppointment:options});return}
 if(!data.clients.length){openModal('client',{returnToAppointment:options});return}
 openModal('appointment',options);
}
function heading(title,subtitle,actions='',eyebrow='STUDIO MANAGER'){return `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><div class="page-subtitle">${subtitle}</div></div>${actions?`<div class="page-actions">${actions}</div>`:''}</div>`}
function demoBanner(){return data.demo?`<div class="demo-banner"><div>${icon('info',15)} <b>Tryb demonstracyjny:</b> nazwy klientek, wizyty i ceny są przykładowe. Najpierw usuń dane demo, by rozpocząć pracę.</div><button data-action="clear-demo">Usuń dane demo</button></div>`:''}
function pageContent(){let body='';switch(ui.page){case'dashboard':body=dashboard();break;case'calendar':body=calendar();break;case'appointments':body=appointmentsPage();break;case'booking-inbox':body=bookingInboxPage();break;case'clients':body=clientsPage();break;case'services':body=servicesPage();break;case'finance':body=financePage();break;case'settings':body=settingsPage();break;default:body=dashboard()}return (readFailed?'<p class="notice" role="alert">Nie udało się odczytać zapisanych danych. Jeśli masz kopię, wczytaj ją w ustawieniach.</p>':'')+demoBanner()+body}
function dashboard(){
 const now=new Date();
 const date=dateStr(addDays(now,ui.agendaDay));
 const tomorrow=dateStr(addDays(now,1));
 const appointments=sortedAppointments();
 const active=appointments.filter(a=>a.date===date&&a.status!=='cancelled');
 const cancelled=appointments.filter(a=>a.date===date&&a.status==='cancelled');
 const pending=appointments.filter(a=>a.date===tomorrow&&a.status==='scheduled');
 const reminders=pending.filter(a=>!a.reminded).length;
 const needsService=!data.services.some(s=>s.active);
 const prep=(reminders||pendingReminders().length)? `<button class="agenda-prep" type="button" data-action="reminder-list">
  <span class="agenda-tool-icon">${icon('bell',19)}</span><span><strong>Przypomnij klientkom</strong>
  <small>SMS-y do przygotowania: ${pendingReminders().length}</small></span>${icon('arrowRight',18)}</button>`:'';
 return `<header class="agenda-head"><div><p>${esc(data.settings.businessName)}</p><h1>Plan dnia</h1></div>
 <div class="agenda-head-icon">${icon('calendar',29)}</div></header>
 <div class="agenda-layout"><section class="card agenda-card" aria-label="Harmonogram wizyt">
 <div class="agenda-top"><div class="agenda-switch" role="group" aria-label="Wybierz dzień">${['Dzisiaj','Jutro'].map((label,day)=>`<button type="button" aria-pressed="${ui.agendaDay===day}" data-action="agenda-day" data-day="${day}">${label}</button>`).join('')}</div>
 ${btn(icon('plus',20)+' Nowa wizyta','new-appointment',`data-date="${date}"`,'agenda-add')}</div>
 <div class="agenda-date"><h2>${datePL(date,{weekday:'long',day:'numeric',month:'long'})}</h2><span>Liczba wizyt: ${active.length}</span></div>
 ${active.length?`<ol class="agenda-list">${active.map(agendaVisit).join('')}</ol>`:`<div class="agenda-empty"><span>${icon('calendar',27)}</span><h3>Brak wizyt</h3><p>${needsService?'Dodaj pierwszą usługę, aby umówić wizytę.':'Masz wolne miejsce w planie dnia.'}</p></div>`}
 ${cancelled.length?`<details class="agenda-cancelled"><summary>Anulowane wizyty (${cancelled.length})</summary><ol class="agenda-list">${cancelled.map(agendaVisit).join('')}</ol></details>`:''}
 </section><aside class="agenda-tools" aria-label="Narzędzia planowania">
 ${prep}
 <button class="agenda-tool" type="button" data-action="free-slots" data-date="${date}"><span class="agenda-tool-icon">${icon('clock',20)}</span><span><strong>Wolne terminy</strong><small>Znajdź godzinę dla wybranej usługi</small></span>${icon('chevronRight',18)}</button>
 <button class="agenda-tool" type="button" data-action="waitlist"><span class="agenda-tool-icon">${icon('users',20)}</span><span><strong>Lista oczekujących</strong><small>Liczba zgłoszeń: ${data.waitlist.length}</small></span>${icon('chevronRight',18)}</button>
 <div id="backup-card">${backupCard()}</div>
 </aside></div>`;
}
function agendaVisit(a){
 const appointmentId=`data-id="${esc(a.id)}"`;
 const isScheduled=a.status==='scheduled';
 const duration=appointmentDuration(a);
 return `<li class="agenda-visit">
 <div class="agenda-visit-time"><time datetime="${esc(a.date)}T${esc(a.time)}">${esc(a.time)}</time><span>${duration} min</span></div>
 <div class="agenda-visit-body"><div class="agenda-visit-main"><div><h3>${esc(apName(a))}</h3><p>${esc(svcName(a))}</p></div><div class="agenda-status">${isScheduled?(a.confirmed?'<span class="status completed">Potwierdzona</span>':'<span class="status scheduled">Do potwierdzenia</span>'):badge(a.status)}</div></div>
 <div class="agenda-actions">
 ${isScheduled?btn(icon('reschedule',16)+' Przenieś','reschedule-appointment',appointmentId,'secondary'):btn(icon('pencil',16)+' Szczegóły','edit-appointment',appointmentId,'secondary')}
 ${isScheduled?btn(icon('mail',16)+(a.reminded?' SMS wysłany':' SMS'),'remind',appointmentId,'secondary'):''}
 ${isScheduled?`<button class="btn secondary agenda-more" type="button" data-action="agenda-actions" ${appointmentId} aria-label="Więcej działań: ${esc(apName(a))}">${icon('menu',18)}</button>`:''}
 ${a.status==='cancelled'&&waitlistMatches(a).length?btn(icon('users',16)+' Dopasuj zgłoszenie','waitlist-opening',appointmentId,'secondary'):''}
 </div></div></li>`;
}
function backupCard(){
 const last=backupDate?new Date(backupDate):null;
 const valid=last&&Number.isFinite(last.getTime());
 const old=!valid||backupDate<dateStr(addDays(new Date(),-BACKUP_INTERVAL_DAYS+1));
 const hasData=data.clients.length||data.services.length||data.appointments.length;
 return `<section class="backup-card ${old&&hasData?'backup-due':''}">
 <div class="backup-card-head"><span class="agenda-tool-icon">${icon('shield',20)}</span><div><h2>Kopia zapasowa</h2><p>${valid?`Ostatni eksport: ${datePL(backupDate)}`:'Brak kopii z tego urządzenia'}</p></div></div>
 ${old&&hasData?'<p class="backup-tip">Pobierz aktualną kopię i zachowaj ją poza tym urządzeniem.</p>':''}
 ${btn(icon('download',17)+' Pobierz kopię','export-json','','secondary')}
 </section>`;
}
function pendingReminders(){
 const now=new Date();
 const tomorrow=dateStr(addDays(now,1));
 return sortedAppointments().filter(a=>a.status==='scheduled'&&!a.reminded&&
  a.date<=tomorrow&&new Date(`${a.date}T${a.time}`)>now);
}
function syncPushSchedule(){
 try{if(readFailed||localStorage.getItem(KEY)!==storedData)return}catch{return}
 const dates=[...new Set(data.appointments.filter(a=>a.status==='scheduled'&&!a.reminded&&
  a.date>=today()).map(a=>a.date))].sort().slice(0,400);
 window.VeraPush?.sync(dates);
}
function pushSettings(){
 return `<section class="card settings-card"><h2 class="section-title">Przypomnienia na telefon</h2>
 <p class="section-subtitle">Rano przypomnę Ci o SMS-ach na jutrzejsze wizyty. Dotknij powiadomienia, wybierz klientkę i otwórz gotową wiadomość.</p>
 <p class="push-status" role="status">${esc(window.VeraPush?.status||'Powiadomienia są wyłączone.')}</p>
 ${btn(icon('bell',17)+' Ustaw powiadomienia','push-settings','','secondary')}</section>`;
}
function pageSearch(placeholder){return `<label class="field-search">${icon('search',15)}<input data-role="page-search" aria-label="Wyszukaj" placeholder="${esc(placeholder)}" value="${esc(ui.search)}"></label>`}
function filterMatch(...vals){const s=ui.search.trim().toLocaleLowerCase('pl-PL');return !s||vals.some(v=>String(v??'').toLocaleLowerCase('pl-PL').includes(s))}
function calendar(){
 const cursor=ui.calendarDate;
 const weekStart=startWeek(cursor),weeks=Array.from({length:7},(_,i)=>addDays(weekStart,i));
 const monthCursor=new Date(cursor.getFullYear(),cursor.getMonth(),1,12);
 const isWeek=ui.calendarView==='week';
 const label=isWeek?`${datePL(dateStr(weekStart),{day:'numeric',month:'short'})} – ${datePL(dateStr(addDays(weekStart,6)),{day:'numeric',month:'short',year:'numeric'})}`:monthLabel(monthCursor);
 const header=`${heading('Kalendarz wizyt','Zaplanuj tydzień i zapanuj nad każdą wizytą.',btn(icon('plus',15)+' Nowa wizyta','new-appointment',`data-date="${dateStr(cursor)}"`))}<div class="toolbar"><div class="toolbar-left"><div class="tabs"><button class="tab ${isWeek?'active':''}" data-action="calendar-view" data-view="week">Tydzień</button><button class="tab ${!isWeek?'active':''}" data-action="calendar-view" data-view="month">Miesiąc</button></div><button class="btn secondary sm" data-action="calendar-today">Dzisiaj</button>${btn(icon('clock',16)+' Wolne terminy','free-slots',`data-date="${dateStr(cursor)}"`,'secondary sm')}</div><div class="calendar-nav"><button class="icon-btn" data-action="calendar-shift" data-shift="-1" aria-label="Poprzedni">${icon('chevronLeft')}</button><div class="calendar-title">${esc(label)}</div><button class="icon-btn" data-action="calendar-shift" data-shift="1" aria-label="Następny">${icon('chevronRight')}</button></div></div>`;
 let calendarContent='';
 if(isWeek){
  calendarContent=`<div class="week-scroll"><div class="week-grid">${weeks.map(d=>{
   const ds=dateStr(d),daily=sortedAppointments().filter(a=>a.date===ds);
   return `<div class="week-col"><div class="week-heading ${ds===today()?'today':''}"><div class="wd">${shortDay(d)}</div><div class="num">${d.getDate()}</div></div>${daily.map(a=>`<button class="week-appt ${esc(a.status)}" data-action="edit-appointment" data-id="${esc(a.id)}"><div class="time">${esc(a.time)} · ${currency(apPrice(a))}</div><div class="who">${esc(apName(a))}</div><div class="what">${esc(svcName(a))}</div></button>`).join('')}<button class="week-add" data-action="new-appointment" data-date="${ds}" title="Dodaj wizytę ${ds}">+</button></div>`
  }).join('')}</div></div>`;
 }else{
  const first=startWeek(monthStart(monthCursor)),days=Array.from({length:42},(_,i)=>addDays(first,i));
  calendarContent=`<div class="month-grid">${['Pon','Wt','Śr','Czw','Pt','Sob','Nd'].map(x=>`<div class="month-weekday">${x}</div>`).join('')}${days.map(d=>{
   const ds=dateStr(d),daily=sortedAppointments().filter(a=>a.date===ds);return `<div class="month-day ${sameMonth(d,monthCursor)?'':'outside'} ${ds===today()?'today':''}" data-action="calendar-day" data-date="${ds}" role="button" tabindex="0"><span class="daynum">${d.getDate()}</span>${daily.slice(0,2).map(a=>`<div class="month-event ${a.status==='completed'?'done':esc(a.status)}">${esc(a.time)} ${esc(apName(a))}</div>`).join('')}${daily.length>2?`<div class="month-more">+${daily.length-2} więcej</div>`:''}</div>`
  }).join('')}</div>`;
 }
 return `${header}<section class="card calendar-layout">${calendarContent}</section><div class="footer-note">Kliknij wizytę, aby ją edytować. Kliknij „+” lub dzień w kalendarzu, aby dodać nową.</div>`;
}
function appointmentsPage(){
 const filtered=sortedAppointments().filter(a=>(ui.status==='all'||a.status===ui.status)&&filterMatch(apName(a),svcName(a),a.date,a.time)).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
 const counts={all:data.appointments.length,scheduled:data.appointments.filter(a=>a.status==='scheduled').length,completed:data.appointments.filter(a=>a.status==='completed').length,cancelled:data.appointments.filter(a=>a.status==='cancelled').length};
 return `${heading('Wizyty','Zarządzaj rezerwacjami, historią i płatnościami klientek.',btn(icon('plus')+' Dodaj wizytę','new-appointment'))}
 <div class="toolbar"><div class="toolbar-left">${pageSearch('Szukaj klientki lub usługi...')}<div class="tabs">${[['all','Wszystkie'],['scheduled','Planowane'],['completed','Zakończone'],['cancelled','Anulowane']].map(([k,n])=>`<button class="tab ${ui.status===k?'active':''}" data-action="set-status" data-status="${k}">${n} (${counts[k]})</button>`).join('')}</div></div><div class="toolbar-right">${btn(icon('download',14)+' Eksport CSV','export-csv','data-kind="appointments"','secondary')}</div></div>
 <div class="card table-card appointments-table"><div class="table-wrap"><table class="data-table"><thead><tr><th>Klientka</th><th>Termin</th><th>Usługa</th><th>Kwota</th><th>Status</th><th>Płatność</th><th>Działania</th></tr></thead><tbody>${filtered.map(a=>`<tr><td><div class="client-name"><div class="client-initials">${esc(initials(apName(a)))}</div><div><b>${esc(apName(a))}</b><small>${esc(client(a.clientId)?.phone||'Brak numeru')}</small></div></div></td><td style="white-space:nowrap"><b>${datePL(a.date,{day:'numeric',month:'short',year:'numeric'})}</b><div class="muted" style="margin-top:3px">${esc(a.time)}</div></td><td>${esc(svcName(a))}</td><td><b>${currency(apPrice(a))}</b></td><td>${badge(a.status)}</td><td>${badge(a.payment)}</td><td><div class="row-actions"><button class="icon-btn" data-action="edit-appointment" data-id="${esc(a.id)}" aria-label="Edytuj wizytę">${icon('pencil')}</button><button class="icon-btn" data-action="remind" data-id="${esc(a.id)}" aria-label="Przypomnienie SMS">${icon('mail')}</button>${a.status==='scheduled'?`<button class="icon-btn" data-action="complete-appointment" data-id="${esc(a.id)}" aria-label="Zakończ i oznacz jako opłaconą">${icon('checkCircle')}</button>`:''}<button class="icon-btn" data-action="confirm-delete" data-entity="appointment" data-id="${esc(a.id)}" aria-label="Usuń wizytę">${icon('trash')}</button></div></td></tr>`).join('')}</tbody></table></div>${!filtered.length?noResults('Nie znaleziono wizyt','Zmień filtry lub dodaj pierwszą rezerwację.','Nowa wizyta','new-appointment'):''}</div>`;
}
function clientsPage(){
 const filtered=[...data.clients].filter(c=>filterMatch(c.name,c.phone,c.email,c.notes)).sort((a,b)=>a.name.localeCompare(b.name,'pl'));
 return `${heading('Twoje klientki','Wygodna baza kontaktów, notatek i historii wizyt.',btn(icon('plus')+' Dodaj klientkę','new-client'))}
 <div class="toolbar"><div class="toolbar-left">${pageSearch('Szukaj po imieniu, telefonie...')}</div><div class="toolbar-right"><span class="muted">Łącznie: <b>${data.clients.length}</b></span>${btn(icon('download')+' Eksport CSV','export-csv','data-kind="clients"','secondary')}</div></div>
 ${filtered.length?`<div class="client-grid">${filtered.map(c=>{
 const visits=data.appointments.filter(a=>a.clientId===c.id);const completed=visits.filter(a=>a.status==='completed').length;const last=visits.filter(a=>a.status==='completed').sort((a,b)=>b.date.localeCompare(a.date))[0];
 return `<article class="card client-card"><div class="client-card-head"><div class="client-initials">${esc(initials(c.name))}</div><div><h3>${esc(c.name)}</h3><p>${esc(c.phone||'Brak numeru telefonu')}</p></div></div><div class="client-card-detail"><div>Odbyte wizyty<b>${completed}</b></div><div>Ostatnia wizyta<b>${last?datePL(last.date,{day:'numeric',month:'short'}):'–'}</b></div><div>Wszystkie<b>${visits.length}</b></div></div><div class="client-card-actions">${btn('Szczegóły','client-detail',`data-id="${esc(c.id)}"`,'secondary sm')}${btn(icon('plus',13)+' Umów wizytę','new-appointment',`data-client="${esc(c.id)}"`,'sm')}<button class="icon-btn" data-action="edit-client" data-id="${esc(c.id)}" title="Edytuj">${icon('pencil')}</button><button class="icon-btn" data-action="confirm-delete" data-entity="client" data-id="${esc(c.id)}" title="Usuń klientkę">${icon('trash')}</button></div></article>`}).join('')}</div>`:noResults('Nie ma jeszcze klientek','Dodaj pierwszą klientkę i zacznij tworzyć historię wizyt.','Dodaj klientkę','new-client')}`;
}
const serviceSymbol=category=>category==='Paznokcie'?'✳':category==='Stopy'?'❋':category==='Brwi i rzęsy'?'✦':'✧';
function servicesPage(){
 const filtered=data.services.filter(s=>filterMatch(s.name,s.category,String(s.price)));
 return `${heading('Usługi i cennik','Dodawaj zabiegi i ustalaj ceny oraz czas trwania usług.',btn(icon('plus')+' Dodaj usługę','new-service'))}
 <div class="toolbar"><div class="toolbar-left">${pageSearch('Szukaj usługi...')}</div><div class="toolbar-right"><span class="muted">${data.services.filter(s=>s.active).length} aktywnych usług</span></div></div>
 ${filtered.length?`<div class="services-grid">${filtered.map(s=>`<article class="card service-card"><div class="service-symbol">${serviceSymbol(s.category)}</div><div><h3 class="service-title">${esc(s.name)}</h3><div class="service-cat">${esc(s.category)} ${s.active?'':'• Nieaktywna'}</div></div><div class="service-bottom"><div><div class="service-price">${currency(s.price)}</div><div class="service-duration">${icon('clock',12)} ${Number(s.duration)} min</div></div><div class="service-actions"><button class="icon-btn" data-action="edit-service" data-id="${esc(s.id)}" title="Edytuj">${icon('pencil')}</button><button class="icon-btn" data-action="confirm-delete" data-entity="service" data-id="${esc(s.id)}" title="Usuń">${icon('trash')}</button></div></div></article>`).join('')}</div>`:noResults('Brak usług','Dodaj swoje zabiegi, aby móc planować wizyty.','Dodaj usługę','new-service')}`;
}
function financePage(){
 const now=ui.month,monthAp=data.appointments.filter(a=>inMonth(a,now)),completed=monthAp.filter(a=>paid(a));
 const revenue=completed.reduce((s,a)=>s+apPrice(a),0),expect=monthAp.filter(a=>a.status==='scheduled').reduce((s,a)=>s+apPrice(a),0);
 const unpaid=monthAp.filter(a=>a.status==='completed'&&a.payment==='unpaid').reduce((s,a)=>s+apPrice(a),0);
 const totalCount=monthAp.filter(a=>a.status==='completed').length;
 const six=Array.from({length:6},(_,i)=>new Date(now.getFullYear(),now.getMonth()-5+i,1));
 const max=Math.max(1,...six.map(d=>paidMonth(d)));
 const bySvc=new Map();completed.forEach(a=>bySvc.set(svcName(a),(bySvc.get(svcName(a))||0)+apPrice(a)));
 const topSvc=Array.from(bySvc.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5);
 return `${heading('Finanse','Twój przychód z opłaconych wizyt — bez księgowej gimnastyki.',`${btn(icon('download')+' Pobierz raport CSV','export-csv','data-kind="finance"','secondary')}`)}
 <div class="toolbar"><div class="toolbar-left"><div class="calendar-nav"><button class="icon-btn" data-action="finance-shift" data-shift="-1">${icon('chevronLeft')}</button><div class="calendar-title">${esc(monthLabel(now))}</div><button class="icon-btn" data-action="finance-shift" data-shift="1">${icon('chevronRight')}</button></div></div></div>
 <div class="finance-cards"><section class="card fin-card"><div class="fin-label">Przychód opłacony</div><div class="fin-big">${currency(revenue)}</div><div class="fin-help">${completed.length} opłaconych, zakończonych wizyt</div></section><section class="card fin-card"><div class="fin-label">Przyszłe rezerwacje</div><div class="fin-big">${currency(expect)}</div><div class="fin-help">Planowane przychody — jeszcze nie otrzymane</div></section><section class="card fin-card"><div class="fin-label">Nieopłacone zakończone wizyty</div><div class="fin-big">${currency(unpaid)}</div><div class="fin-help">${totalCount} zakończonych wizyt w tym miesiącu</div></section></div>
 <div class="finance-main"><section class="card"><div class="section-header"><div><div class="section-title">Przychód miesięczny</div><div class="section-subtitle">6 ostatnich miesięcy według zaznaczonego okresu</div></div></div><div class="trend-chart" style="height:280px;padding-top:43px">${six.map(d=>`<div class="trend-cell"><div class="bar-value">${paidMonth(d)?currency(paidMonth(d)):''}</div><div class="trend-bar" style="height:${Math.max(3,paidMonth(d)/max*100)}%"></div><span>${d.toLocaleDateString('pl-PL',{month:'short'})}</span></div>`).join('')}</div></section>
 <section class="card"><div class="section-header"><div><div class="section-title">Najpopularniejsze usługi</div><div class="section-subtitle">Przychód z zakończonych, opłaconych wizyt</div></div></div><div class="finance-by-service">${topSvc.length?topSvc.map(([name,sum])=>`<div class="service-progress"><div class="head"><span>${esc(name)}</span><strong>${currency(sum)}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100,sum/Math.max(revenue,1)*100)}%"></div></div></div>`).join(''):noResults('Brak danych','Zakończone i opłacone wizyty pojawią się w raporcie.')}</div></section></div><div class="notice" style="margin-top:20px">${icon('info',16)} Raport operacyjny, nie zastępuje księgowości ani ewidencji podatkowej.</div>`;
}
function settingsPage(){
 const s=data.settings;
 return `${heading('Ustawienia studia','Dopasuj nazwę firmy, kontakty i codzienne godziny pracy.',btn(icon('download')+' Kopia zapasowa','export-json','', 'secondary'))}
 <div class="settings-grid"><div><section class="card settings-card"><div class="section-title" style="margin-bottom:20px">Dane Twojego studia</div><form id="settings-form"><div class="form-grid">
 <div class="form-field full"><label>Nazwa studia</label><input class="form-input" name="businessName" maxlength="100" value="${esc(s.businessName)}" required></div>
 <div class="form-field"><label>Numer telefonu</label><input class="form-input" name="phone" placeholder="+48 600 000 000" maxlength="32" value="${esc(s.phone)}"></div><div class="form-field"><label>Adres studia</label><input class="form-input" name="address" placeholder="Miasto, ulica" maxlength="180" value="${esc(s.address)}"></div>
 <div class="form-field full"><label>Link do Instagrama</label><input class="form-input" type="url" name="instagram" placeholder="https://www.instagram.com/..." value="${esc(s.instagram)}"></div>
 <div class="form-field full"><label>Link do Facebooka</label><input class="form-input" type="url" name="facebook" placeholder="https://www.facebook.com/..." value="${esc(s.facebook)}"><div class="field-hint">Link do Facebooka nie został podany — możesz wkleić go tutaj.</div></div>
 ${field('startTime','Godzina otwarcia',s.startTime,'time','required')}${field('endTime','Godzina zamknięcia',s.endTime,'time','required')}
 ${field('breakStart','Początek przerwy (opcjonalnie)',s.breakStart,'time')}${field('breakEnd','Koniec przerwy (opcjonalnie)',s.breakEnd,'time')}
 </div><div class="settings-action"><button type="submit" class="btn">${icon('check')} Zapisz zmiany</button></div></form></section>
 <section class="card settings-card"><div class="section-title">Kopia zapasowa i eksport</div><p class="section-subtitle">Dane są przechowywane tylko w tej przeglądarce i na tym urządzeniu. Regularnie pobieraj kopię JSON.</p><div class="backup-actions">${btn(icon('download')+' Pobierz JSON','export-json','', 'secondary')}${btn(icon('upload')+' Wczytaj JSON','import-json','', 'secondary')}${btn(icon('download')+' Wizyty CSV','export-csv','data-kind="appointments"','secondary')}</div><div class="divider"></div><div class="section-title">Zarządzanie danymi</div><p class="section-subtitle">Każdy wpis możesz usunąć w odpowiedniej sekcji. Pełne usunięcie jest nieodwracalne.</p><div class="backup-actions">${data.demo?btn('Wyczyść dane demo','clear-demo','','secondary'):''}${btn('Usuń wszystkie dane','confirm-reset','','danger')}</div></section></div>
 <div><div id="push-settings-card">${pushSettings()}</div><section class="card settings-card"><div class="section-title">Twoje social media</div><p class="section-subtitle">Szybki dostęp do profili beauty room.</p>
 ${safeUrl(s.instagram)?`<a class="social-link" href="${esc(safeUrl(s.instagram))}" target="_blank" rel="noopener noreferrer">${icon('instagram',18)} <span>Instagram</span>${icon('external',14)}</a>`:''}
 ${safeUrl(s.facebook)?`<a class="social-link" href="${esc(safeUrl(s.facebook))}" target="_blank" rel="noopener noreferrer">${icon('facebook',18)} <span>Facebook</span>${icon('external',14)}</a>`:`<div class="social-link disabled">${icon('facebook',18)} <span>Facebook — nie dodano</span>${icon('info',14)}</div>`}</section>
 <section class="card settings-card"><div class="section-title" style="margin-bottom:15px">Ważne: prywatność danych</div><div class="info-box">${icon('info',18)}<span>Ta wersja działa lokalnie na jednym urządzeniu. Nie ma kont użytkowników, szyfrowania bazy ani synchronizacji między telefonami. Do prawdziwej pracy z danymi klientek i publikacji online potrzebna będzie zabezpieczona baza danych, logowanie i zgodność z RODO.</span></div><div class="divider"></div><div class="section-title">Wersja systemu</div><p class="section-subtitle">Vera Beauty Room • CRM Starter 1.0</p></section></div></div>`;
}
function safeUrl(u){try{const obj=new URL(u);return ['https:','http:'].includes(obj.protocol)?obj.href:''}catch(e){return ''}}
function field(name,label,value='',type='text',opts=''){
 return `<div class="form-field"><label for="field-${esc(name)}">${esc(label)}</label><input id="field-${esc(name)}" class="form-input" name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" ${opts}></div>`;
}
function modalFrame(title,content,footer=''){return `<div class="overlay" data-action="backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" tabindex="-1"><div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" data-action="close-modal" aria-label="Zamknij">${icon('close')}</button></div><div class="modal-body">${content}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</div></div>`}
const footerSave=(formId='modal-form',text='Zapisz')=>`<button class="btn secondary" type="button" data-action="close-modal">Anuluj</button><button class="btn" form="${formId}" type="submit">${icon('check',15)} ${text}</button>`;
const modalError='<div id="form-error" class="modal-error" role="alert"></div>';
function availableTimes(date,selectedService){
 const now=new Date();
 if(date<dateStr(now)||!selectedService?.active)return [];
 const {startTime,endTime,breakStart,breakEnd}=data.settings;
 const duration=Number(selectedService.duration);
 const start=timeInMinutes(startTime);
 const end=timeInMinutes(endTime);
 const dayStart=dayInMinutes(date);
 const taken=data.appointments.filter(a=>a.status!=='cancelled').map(a=>{
  const from=appointmentStart(a)-dayStart;
  return [from,from+appointmentDuration(a)];
 });
 if(breakStart&&breakEnd)taken.push([timeInMinutes(breakStart),timeInMinutes(breakEnd)]);
 const earliest=date===dateStr(now)?now.getHours()*60+now.getMinutes()+1:start;
 const times=[];
 for(let time=start;duration>0&&time+duration<=end;time+=15){
  if(time>=earliest&&!taken.some(([from,to])=>time<to&&time+duration>from))times.push(minuteLabel(time));
 }
 return times;
}
function activeServiceOptions(selected=''){
 return data.services.filter(s=>s.active).map(s=>`<option value="${esc(s.id)}" ${s.id===selected?'selected':''}>${esc(s.name)} · ${Number(s.duration)} min</option>`).join('');
}
function slotResults(date,serviceId){
 if(!date||!serviceId)return '<p class="confirm-text">Wybierz datę i usługę, aby zobaczyć wolne godziny.</p>';
 const times=availableTimes(date,service(serviceId));
 return times.length?`<div class="slot-grid">${times.map(time=>btn(time,'book-slot',`data-date="${esc(date)}" data-time="${time}" data-service="${esc(serviceId)}"`,'secondary')).join('')}</div>`:
  '<p class="confirm-text">Brak wolnych godzin dla tej usługi. Wybierz inny dzień.</p>';
}
function waitlistMatches(a){
 const when=`${a.date}T${a.time}`;
 return data.waitlist.filter(entry=>{
  const selectedService=service(entry.serviceId);
  if(!client(entry.clientId)||!selectedService?.active||Number(selectedService.duration)>appointmentDuration(a))return false;
  const candidate={...a,serviceId:entry.serviceId,duration:Number(selectedService.duration),status:'scheduled'};
  return new Date(when)>new Date()&&!hasOverlap(candidate);
 });
}
function waitlistModal(m){
 if(m.add){
  return modalFrame('Dodaj do listy oczekujących',`<form id="modal-form" data-form="waitlist"><div class="form-grid">
   <div class="form-field full"><label for="wait-client">Klientka</label><select class="form-input" id="wait-client" name="clientId" required><option value="">Wybierz klientkę</option>${data.clients.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></div>
   <div class="form-field full"><label for="wait-service">Usługa</label><select class="form-input" id="wait-service" name="serviceId" required><option value="">Wybierz usługę</option>${activeServiceOptions()}</select></div>
   </div>${modalError}</form>`,footerSave('modal-form','Dodaj do listy'));
 }
 const opening=m.openingId&&data.appointments.find(a=>a.id===m.openingId&&a.status==='cancelled');
 const entries=opening?waitlistMatches(opening):data.waitlist;
 const rows=entries.map(entry=>`<li class="waitlist-entry"><div><strong>${esc(client(entry.clientId)?.name)}</strong><p>${esc(service(entry.serviceId)?.name)}</p></div>
  ${opening?btn('Umów','book-waitlist',`data-id="${esc(entry.id)}" data-opening="${esc(opening.id)}"`):
  `<button type="button" class="icon-btn" data-action="remove-waitlist" data-id="${esc(entry.id)}" aria-label="Usuń zgłoszenie: ${esc(client(entry.clientId)?.name)}">${icon('trash',18)}</button>`}</li>`).join('');
 const body=(opening?`<p class="confirm-text">Zwolnił się termin: ${formatDateTime(opening)}.</p>`:'')+
  (rows?`<ol class="waitlist-entries">${rows}</ol>`:`<p class="confirm-text">${opening?'Brak pasujących zgłoszeń.':'Lista oczekujących jest pusta.'}</p>`);
 const canAdd=data.clients.length&&data.services.some(s=>s.active);
 return modalFrame(opening?'Termin zwolniony':'Lista oczekujących',body+
  (!opening&&!canAdd?'<p class="confirm-text">Aby dodać zgłoszenie, najpierw dodaj klientkę i aktywną usługę.</p>':''),
  opening?btn(icon('plus',17)+' Umów inną klientkę','fill-opening',`data-id="${esc(opening.id)}"`):
   canAdd?btn(icon('plus',17)+' Dodaj zgłoszenie','add-waitlist'):'');
}
function modalHtml(){
 const m=ui.modal;if(!m)return'';
 if(m.type==='push-settings'){
  const enabled=window.VeraPush?.enabled;
  return modalFrame('Powiadomienia na iPhonie',`<p class="confirm-text">Dodaj CRM do ekranu początkowego w Safari. Otwórz ją z ikony i zezwól na powiadomienia.</p>
   <p class="push-status" role="status">${esc(window.VeraPush?.status)}</p>
   <p class="confirm-text">Przypomnienie przychodzi rano przed dniem wizyty. Po zmianie wizyt połącz telefon z internetem, aby zaktualizować harmonogram.</p>
   ${enabled?'':field('pushKey','Kod połączenia','','password','autocomplete="off" autocapitalize="off" spellcheck="false"')}
   ${modalError}`,enabled?
    btn('Wyślij powiadomienie testowe','push-test')+btn('Wyłącz','push-disable','','secondary'):
    btn(icon('bell',17)+' Włącz powiadomienia','push-enable'));
 }
 if(m.type==='reminder-list'){
  const entries=pendingReminders();
  return modalFrame('Przypomnij klientkom',`<p class="confirm-text">Wizyty na dziś i jutro. Wybierz klientkę, aby przygotować SMS.</p>
   ${entries.length?`<ol class="waitlist-entries">${entries.map(a=>`<li class="waitlist-entry"><div><strong>${esc(apName(a))}</strong><p>${formatDateTime(a)}</p><p>${esc(client(a.clientId)?.phone||'Dodaj numer telefonu')}</p></div>
   ${btn(icon('mail',17)+' SMS','remind',`data-id="${esc(a.id)}"`)}</li>`).join('')}</ol>`:'<p class="confirm-text">Wszystkie przypomnienia na dziś i jutro są oznaczone jako wysłane lub nie masz nadchodzących wizyt.</p>'}`);
 }
 if(m.type==='client'){
  const c=data.clients.find(c=>c.id===m.id)||{name:'',phone:'',email:'',notes:''};
  return modalFrame(m.id?'Edytuj klientkę':'Nowa klientka',`<form id="modal-form" data-form="client"><div class="form-grid">
   ${field('name','Imię i nazwisko',c.name,'text','required maxlength="110" autocomplete="name"')}${field('phone','Telefon',c.phone,'tel','maxlength="32" autocomplete="tel"')}
   <div class="form-field full"><label for="field-email">Adres e-mail (opcjonalnie)</label><input id="field-email" class="form-input" type="email" name="email" maxlength="150" value="${esc(c.email||'')}"></div>
   <div class="form-field full"><label for="field-notes">Notatki o klientce</label><textarea class="form-input" id="field-notes" name="notes" maxlength="2000" placeholder="Preferencje, ulubione kolory, ważne informacje...">${esc(c.notes||'')}</textarea></div>
   </div><div id="form-error" class="modal-error"></div></form>`,footerSave('modal-form',m.id?'Zapisz zmiany':'Dodaj klientkę'));
 }
 if(m.type==='service'){
  const s=data.services.find(x=>x.id===m.id)||{name:'',category:'Paznokcie',duration:60,price:0,active:true};
  return modalFrame(m.id?'Edytuj usługę':'Nowa usługa',`<form id="modal-form" data-form="service"><div class="form-grid">
   <div class="form-field full"><label for="field-name">Nazwa usługi</label><input class="form-input" id="field-name" name="name" maxlength="120" required placeholder="np. Manicure hybrydowy" value="${esc(s.name)}"></div>
   <div class="form-field full"><label for="field-category">Kategoria</label><select class="form-input" id="field-category" name="category">${['Paznokcie','Stopy','Brwi i rzęsy','Pielęgnacja','Inne'].map(x=>`<option value="${esc(x)}" ${s.category===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
   ${field('duration','Czas trwania (min)',s.duration,'number','required min="5" max="600" step="5"')}${field('price','Cena (zł)',s.price,'number','required min="0" max="100000" step="1"')}
   <div class="form-field full"><label for="field-active">Widoczność w rezerwacjach</label><select class="form-input" name="active" id="field-active"><option value="true" ${s.active?'selected':''}>Aktywna</option><option value="false" ${!s.active?'selected':''}>Nieaktywna</option></select></div>
   </div><div id="form-error" class="modal-error"></div></form>`,footerSave('modal-form',m.id?'Zapisz zmiany':'Dodaj usługę'));
 }
 if(m.type==='appointment'){
  const existing=data.appointments.find(a=>a.id===m.id);
  const a={clientId:'',serviceId:'',date:today(),time:'10:00',status:'scheduled',payment:'unpaid',note:'',price:null,...existing,...m.draft};
  const title=m.reschedule?'Przenieś wizytę':m.id?'Edytuj wizytę':'Nowa wizyta';
  const active=data.services.filter(s=>s.active||s.id===a.serviceId);
  const price=a.price??service(a.serviceId)?.price??0;
  return modalFrame(title,`<form id="modal-form" data-form="appointment"><div class="form-grid">
  ${m.reschedule?field('date','Nowa data',a.date,'date','required')+field('time','Nowa godzina',a.time,'time','required'):''}
  <div class="form-field full"><label for="field-clientId">Klientka</label><select class="form-input" id="field-clientId" name="clientId" required><option value="">Wybierz klientkę...</option>${data.clients.map(c=>`<option value="${esc(c.id)}" ${c.id===a.clientId?'selected':''}>${esc(c.name)} — ${esc(c.phone||'bez telefonu')}</option>`).join('')}</select><button class="text-link" style="align-self:flex-start;margin-top:4px" type="button" data-action="new-client-from-appointment">${icon('plus',13)} Utwórz nową klientkę</button></div>
   <div class="form-field full"><label for="field-serviceId">Usługa</label><select class="form-input" id="field-serviceId" name="serviceId" required><option value="">Wybierz usługę...</option>${active.map(s=>`<option value="${esc(s.id)}" ${s.id===a.serviceId?'selected':''}>${esc(s.name)} — ${currency(s.price)} · ${Number(s.duration)} min</option>`).join('')}</select></div>
  ${m.reschedule?'':field('date','Data wizyty',a.date,'date','required')+field('time','Godzina',a.time,'time','required')}
  ${field('price','Cena wizyty (zł)',price,'number','required min="0" max="100000" step="1"')}
  <div class="form-field"><label for="field-status">Status</label><select class="form-input" name="status" id="field-status">${[['scheduled','Zaplanowana'],['completed','Zakończona'],['cancelled','Anulowana']].map(([k,n])=>`<option value="${k}" ${a.status===k?'selected':''}>${n}</option>`).join('')}</select></div>
  <div class="form-field full"><label for="field-payment">Płatność</label><select class="form-input" name="payment" id="field-payment"><option value="unpaid" ${a.payment==='unpaid'?'selected':''}>Nieopłacona</option><option value="paid" ${a.payment==='paid'?'selected':''}>Opłacona</option></select></div>
  <div class="form-field full"><label for="field-note">Notatka do wizyty</label><textarea class="form-input" name="note" id="field-note" maxlength="2000" placeholder="Dodatkowe uwagi...">${esc(a.note||'')}</textarea></div>
  </div>${modalError}</form>`,(existing?.status==='scheduled'?
   btn('Odwołaj wizytę','confirm-cancel',`data-id="${esc(existing.id)}"`,'danger'):'')+
   footerSave('modal-form',m.id?'Zapisz zmiany':'Zapisz wizytę'));
 }
 if(m.type==='free-slots'){
  const active=data.services.filter(s=>s.active);
  const selected=active.length===1?active[0].id:'';
  return modalFrame('Wolne terminy',active.length?`<div class="form-grid">
    ${field('slotDate','Data',m.date,'date',`min="${today()}"`)}
    <div class="form-field"><label for="slot-service">Usługa</label><select class="form-input" id="slot-service"><option value="">Wybierz usługę</option>${activeServiceOptions(selected)}</select></div>
    </div><div id="slot-results" aria-live="polite">${slotResults(m.date,selected)}</div>`:'<p class="confirm-text">Dodaj aktywną usługę, aby wyszukać wolne terminy.</p>');
 }
 if(m.type==='waitlist')return waitlistModal(m);
 if(m.type==='agenda-actions'){
  const a=data.appointments.find(a=>a.id===m.id);
  if(!a)return '';
  const target=`data-id="${esc(a.id)}"`;
  return modalFrame('Działania dla wizyty',`<p class="confirm-text">${esc(apName(a))} · ${formatDateTime(a)}</p><div class="visit-menu">
   ${btn(icon('checkCircle',18)+(a.confirmed?' Cofnij potwierdzenie':' Oznacz jako potwierdzoną'),'toggle-confirmation',target,'secondary')}
   ${btn(icon('pencil',18)+' Edytuj wizytę','edit-appointment',target,'secondary')}
   ${btn(icon('card',18)+' Zakończ i oznacz jako opłaconą','complete-appointment',target,'secondary')}
   ${btn(icon('close',18)+' Odwołaj wizytę','confirm-cancel',target,'danger')}</div>`);
 }
 if(m.type==='client-detail'){
  const c=client(m.id);if(!c)return'';
  const visits=sortedAppointments().filter(a=>a.clientId===c.id).reverse();
  const content=`<div class="client-card-head"><div class="client-initials" style="width:52px;height:52px;font-size:17px">${esc(initials(c.name))}</div><div><h3 style="font-size:15px;margin:0">${esc(c.name)}</h3><p style="color:#a69b9c;margin:4px 0">${esc(c.phone||'Brak numeru')}</p></div></div>
  <div class="detail-info"><div><div class="meta">Telefon</div><div class="val">${esc(c.phone||'–')}</div></div><div><div class="meta">E-mail</div><div class="val">${esc(c.email||'–')}</div></div><div><div class="meta">Wizyty ogółem</div><div class="val">${visits.length}</div></div><div><div class="meta">Klientka od</div><div class="val">${datePL(c.createdAt||today(),{day:'numeric',month:'short',year:'numeric'})}</div></div></div>
  <div class="divider"></div><div class="section-title">Notatki</div><p class="confirm-text">${esc(c.notes||'Brak notatek.')}</p>
  <div class="divider"></div><div class="section-title">Historia wizyt</div>${visits.length?visits.slice(0,12).map(a=>`<div class="detail-visit"><div class="date-tile"><span>${shortDay(parseDate(a.date))}</span><strong>${parseDate(a.date).getDate()}</strong></div><div style="flex:1"><b>${esc(svcName(a))}</b><div class="muted" style="font-size:10px">${formatDateTime(a)}</div></div><div>${currency(apPrice(a))}<div>${badge(a.status)}</div></div></div>`).join(''):`<p class="confirm-text">Brak wizyt.</p>`}`;
  const last=visits.find(a=>a.status==='completed'&&service(a.serviceId)?.active);
  return modalFrame('Karta klientki',content,`<button class="btn secondary" data-action="confirm-delete" data-entity="client" data-id="${esc(c.id)}">${icon('trash')} Usuń</button><button class="btn secondary" data-action="edit-client" data-id="${esc(c.id)}">${icon('pencil')} Edytuj</button>${btn(icon(last?'reschedule':'plus')+(last?' Umów ponownie':' Nowa wizyta'),'new-appointment',`data-client="${esc(c.id)}" data-service="${esc(last?.serviceId||'')}"`)}`);
 }
 if(m.type==='confirm'){
  return modalFrame(m.title||'Potwierdź działanie',`<p class="confirm-text">${esc(m.message||'Czy na pewno chcesz kontynuować?')}</p>${modalError}`,`<button class="btn secondary" data-action="close-modal">${m.confirmAction==='cancel'?'Wróć':'Anuluj'}</button><button class="btn danger" data-action="confirm-yes">${icon(m.confirmAction==='cancel'?'close':'trash')} ${esc(m.button||'Usuń')}</button>`);
 }
 if(m.type==='reminder'){
  const a=data.appointments.find(x=>x.id===m.id),c=a&&client(a.clientId);if(!a||!c)return'';
  const message=`Dzień dobry! Przypominamy o wizycie w ${data.settings.businessName} ${datePL(a.date,{day:'numeric',month:'long'})} o ${a.time}. ${svcName(a)}. Do zobaczenia!`;
  const phone=smsPhone(c.phone);
  return modalFrame('Przypomnienie o wizycie',`<p class="confirm-text"><strong>${esc(c.name)}</strong><br>${esc(phone||'Uzupełnij poprawny numer telefonu klientki.')}</p>
   <div class="form-field"><label for="reminder-text">Gotowa wiadomość</label><textarea id="reminder-text" class="form-input" rows="5">${esc(message)}</textarea></div>
   <p class="confirm-text">Naciśnij „Otwórz SMS”, a potem wyślij wiadomość w aplikacji Wiadomości. Po powrocie zaznacz „Oznacz jako wysłany”.</p>`,
   `${phone?btn(icon('mail',18)+' Otwórz SMS','sms-reminder',`data-phone="${esc(phone)}"`):btn('Uzupełnij telefon','edit-client',`data-id="${esc(c.id)}"`)}
   ${btn(icon('copy',16)+' Kopiuj','copy-reminder','','secondary')}
   ${btn(icon('check',16)+(a.reminded?' Cofnij oznaczenie':' Oznacz jako wysłany'),'toggle-reminded',`data-id="${esc(a.id)}"`,'secondary')}`);
 }
 return'';
}
let modalTrigger=null;
function updateVisibleViewport(){
 const viewport=window.visualViewport;
 if(!viewport||!ui.modal)return;
 document.documentElement.style.setProperty('--visible-top',`${viewport.offsetTop}px`);
 document.documentElement.style.setProperty('--visible-height',`${viewport.height}px`);
}
window.visualViewport?.addEventListener('resize',updateVisibleViewport);
window.visualViewport?.addEventListener('scroll',updateVisibleViewport);
function openModal(type,options={}){
 if(!ui.modal)modalTrigger=document.activeElement;
 ui.modal={type,...options};
 $('#modal-root').innerHTML=modalHtml();
 if(!$('.modal')){closeModal();return}
 $('.app-shell').inert=true;
 document.body.classList.add('modal-open');
 updateVisibleViewport();
 $('.modal').focus({preventScroll:true});
}
function dismissModal(){
 if(ui.modal?.busy)return;
 const draft=ui.modal?.returnToAppointment;
 if(draft?.type==='appointment'){openModal('appointment',draft);return}
 closeModal();
}
function closeModal(){
 ui.modal=null;
 $('#modal-root').replaceChildren();
 $('.app-shell').inert=false;
 document.body.classList.remove('modal-open');
 if(modalTrigger?.isConnected)modalTrigger.focus({preventScroll:true});
 modalTrigger=null;
}
function formError(message){
 const error=$('#form-error');
 if(!error){toast(message);return}
 error.textContent=message;
 error.classList.add('show');
 error.scrollIntoView({block:'nearest'});
}
function updatePrice(){
 const selected=service($('.modal [name="serviceId"]')?.value);
 const price=$('.modal [name="price"]');
 if(selected&&price)price.value=selected.price;
}
function hasOverlap(a){
 if(a.status==='cancelled')return false;
 const start=appointmentStart(a),end=start+appointmentDuration(a);
 return data.appointments.some(other=>{
  if(other.id===a.id||other.status==='cancelled')return false;
  const otherStart=appointmentStart(other);
  return start<otherStart+appointmentDuration(other)&&end>otherStart;
 });
}
function formSave(event){
 event.preventDefault();
 if(ui.modal?.busy)return;
 const formType=event.target.dataset.form;
 const fd=new FormData(event.target);
 const v=name=>String(fd.get(name)??'').trim();
 if(formType==='client'){
  if(!v('name'))return formError('Podaj imię i nazwisko klientki.');
  const c={id:ui.modal.id||id(),name:v('name'),phone:v('phone'),email:v('email'),notes:v('notes'),createdAt:client(ui.modal.id)?.createdAt||today()};
  if(!save(withRecord('clients',c),formError))return;
  const from=ui.modal.returnToAppointment;
  closeModal();render();toast('Zapisano klientkę');
  if(from)startAppointment({...from,draft:{...from.draft,clientId:c.id}});
  return;
 }
 if(formType==='service'){
  const duration=Number(v('duration')),price=Number(v('price'));
  if(!v('name')||!Number.isFinite(duration)||duration<5||duration>600||!Number.isFinite(price)||price<0||price>100000)return formError('Sprawdź nazwę, czas i cenę usługi.');
  const s={id:ui.modal.id||id(),name:v('name'),category:v('category'),duration,price,active:v('active')==='true'};
  const next=withRecord('services',s);
  const previous=service(s.id);
  if(previous&&previous.duration!==s.duration){
   next.appointments=data.appointments.map(a=>a.serviceId===s.id&&a.duration==null?{...a,duration:appointmentDuration(a)}:a);
  }
  if(!save(next,formError))return;
  const from=ui.modal.returnToAppointment;
  closeModal();render();toast('Zapisano usługę');
  if(from&&s.active)startAppointment({...from,draft:{...from.draft,serviceId:from.draft?.serviceId||s.id}});
  return;
 }
 if(formType==='waitlist'){
  if(!client(v('clientId'))||!service(v('serviceId'))?.active)return formError('Wybierz klientkę i aktywną usługę.');
  if(data.waitlist.some(entry=>entry.clientId===v('clientId')&&entry.serviceId===v('serviceId')))return formError('Takie zgłoszenie jest już na liście.');
  const entry={id:id(),clientId:v('clientId'),serviceId:v('serviceId')};
  if(!save(withRecord('waitlist',entry),formError))return;
  closeModal();render();openModal('waitlist');toast('Dodano do listy oczekujących');
  return;
 }
 if(formType==='appointment'){
  const price=Number(v('price')),date=v('date'),time=v('time');
  const selected=service(v('serviceId'));
  if(!client(v('clientId'))||!selected)return formError('Wybierz klientkę i usługę.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))return formError('Ustaw prawidłową datę i godzinę.');
  if(!Number.isFinite(price)||price<0||price>100000)return formError('Podaj prawidłową cenę.');
  const previous=data.appointments.find(a=>a.id===ui.modal.id);
  if(previous?.status==='scheduled'&&v('status')==='cancelled'){
   startCancellation(previous);
   return;
  }
  const a={...previous,id:ui.modal.id||id(),clientId:v('clientId'),serviceId:selected.id,date,time,price,status:v('status'),payment:v('payment'),note:v('note')};
  a.duration=previous?.serviceId===selected.id?appointmentDuration(previous):Number(selected.duration);
  const changed=previous&&(a.date!==previous.date||a.time!==previous.time||a.clientId!==previous.clientId||a.serviceId!==previous.serviceId||
   (a.status==='scheduled'&&previous.status==='cancelled'));
  if(changed){a.confirmed=false;a.reminded=false}
  if(hasOverlap(a))return formError('Ten termin nakłada się na inną wizytę. Wybierz inną godzinę.');
  const next=withRecord('appointments',a);
  if(ui.modal.waitlistId&&a.status==='scheduled'){
   next.waitlist=next.waitlist.filter(entry=>entry.id!==ui.modal.waitlistId||entry.clientId!==a.clientId||entry.serviceId!==a.serviceId);
  }
  if(!save(next,formError))return;
  closeModal();render();
  toast('Wizyta została zapisana');
 }
}
function submitSettings(event){
 event.preventDefault();
 const fd=new FormData(event.target);
 const v=name=>String(fd.get(name)??'').trim();
 const settings={...data.settings,businessName:v('businessName')||'Vera Beauty Room',phone:v('phone'),address:v('address'),
  instagram:v('instagram'),facebook:v('facebook'),startTime:v('startTime'),endTime:v('endTime'),breakStart:v('breakStart'),breakEnd:v('breakEnd')};
 const {startTime,endTime,breakStart,breakEnd,instagram,facebook}=settings;
 if(startTime>=endTime)return toast('Godzina otwarcia musi być wcześniejsza niż zamknięcia.');
 if((breakStart||breakEnd)&&(!breakStart||!breakEnd||breakStart>=breakEnd||breakStart<startTime||breakEnd>endTime))return toast('Podaj początek i koniec przerwy w godzinach pracy.');
 if((instagram&&!safeUrl(instagram))||(facebook&&!safeUrl(facebook)))return toast('Sprawdź linki do mediów społecznościowych.');
 if(save({...data,settings}))toast('Ustawienia zapisane');
}
function confirmDelete(entity,entityId){
 const c=entity==='client'?client(entityId):entity==='service'?service(entityId):data.appointments.find(x=>x.id===entityId);
 if(!c)return;
 if(entity==='appointment'&&onlineBookingId(c)&&c.status==='scheduled'){
  startCancellation(c);
  return;
 }
 const relation=entity==='client'?'clientId':entity==='service'?'serviceId':null;
 const records=relation&&data.appointments.filter(a=>a[relation]===entityId).length;
 if(records){openModal('confirm',{title:'Nie można bezpiecznie usunąć',message:`Ten element jest powiązany z ${records} wizytami. Aby zachować historię, usuń najpierw te wizyty. Usługę możesz także wyłączyć w edycji.`,button:'Rozumiem',confirmAction:'close'});return}
 const name=relation?c.name:`${apName(c)} · ${c.date} ${c.time}`;
 const object=entity==='client'?'klientkę':entity==='service'?'usługę':'wizytę';
 const after=relation?(data.waitlist.some(entry=>entry[relation]===entityId)?' Powiązane zgłoszenia z listy oczekujących też zostaną usunięte.':''):' Po usunięciu masz 20 sekund na cofnięcie.';
 openModal('confirm',{title:'Usunąć wpis?',message:`Usunąć ${object} „${name}”?${after}`,button:'Usuń',confirmAction:'delete',entity,entityId});
}
function startCancellation(a){
 openModal('confirm',{title:'Odwołać wizytę?',
  message:`${apName(a)} · ${formatDateTime(a)}. Wizyta pozostanie w historii. ${onlineBookingId(a)?'Termin zwolni się też na stronie zapisów.':'Termin zwolni się w kalendarzu.'}`,
  button:'Odwołaj wizytę',confirmAction:'cancel',id:a.id});
}
async function cancelVisit(appointmentId){
 const previous=data.appointments.find(a=>a.id===appointmentId);
 const modal=ui.modal;
 if(previous?.status!=='scheduled'||!modal||modal.busy)return;
 if(readFailed||localStorage.getItem(KEY)!==storedData){
  return formError('Odśwież CRM i spróbuj odwołać wizytę ponownie.');
 }
 const bookingId=onlineBookingId(previous);
 if(bookingId){
  modal.busy=true;
  const button=$('[data-action="confirm-yes"]');
  button.disabled=true;
  button.textContent='Odwoływanie…';
  try {
   await bookingInboxRequest({action:'cancelled',id:bookingId});
   bookingInbox.bookings=bookingInbox.bookings.filter(item=>item.id!==bookingId);
  } catch(error) {
   formError(error.status===401?'Zaloguj się w „Zapisy online”, a następnie ponów odwołanie.':error.message);
   return;
  } finally {
   modal.busy=false;
   button.disabled=false;
   button.textContent='Odwołaj wizytę';
  }
 }
 const cancelled={...previous,status:'cancelled'};
 if(!save(withRecord('appointments',cancelled),formError))return;
 closeModal();render();
 if(new Date(cancelled.date+'T'+cancelled.time)>new Date()){
  openModal('waitlist',{openingId:cancelled.id});
 }else toast('Wizyta została odwołana.');
}
function changeVisit(appointmentId,changes,message,report=toast){
 const previous=data.appointments.find(a=>a.id===appointmentId);
 if(!previous||previous.status!=='scheduled')return;
 const a={...previous,...changes};
 if(!save(withRecord('appointments',a),report))return;
 closeModal();render();
 toast(message);
}
function doConfirm(){
 const m=ui.modal;
 if(!m)return;
 if(m.confirmAction==='close'){closeModal();return}
 if(m.confirmAction==='cancel'){void cancelVisit(m.id);return}
 if(m.confirmAction==='reset'){
  if(!save({...seed(),settings:{...data.settings}},formError))return;
  clearUndo();closeModal();render();toast('Wszystkie dane zostały usunięte');
  return;
 }
 if(m.confirmAction==='clear-demo'){
  if(!save(withoutDemo(data),formError))return;
  closeModal();render();toast('Usunięto dane przykładowe, zachowując Twoje wpisy');
  return;
 }
 if(m.confirmAction!=='delete')return;
 const keys={client:'clients',service:'services',appointment:'appointments'};
 const key=keys[m.entity];
 const record=data[key]?.find(item=>item.id===m.entityId);
 if(!record)return;
 const next={...data,[key]:data[key].filter(item=>item.id!==record.id)};
 if(m.entity!=='appointment'){
  const relation=m.entity==='client'?'clientId':'serviceId';
  next.waitlist=next.waitlist.filter(entry=>entry[relation]!==record.id);
 }
 if(!save(next,formError))return;
 closeModal();render();
 if(m.entity==='appointment'){
  const notice=toast('Wizyta została usunięta.',{name:'undo-delete',id:record.id,label:'Cofnij',icon:'undo'});
  const timer=setTimeout(()=>undoEntries.delete(record.id),UNDO_TIME);
  undoEntries.set(record.id,{record,notice,timer});
 }else toast('Wpis usunięty');
}
function clearUndo(){
 undoEntries.forEach(({notice,timer})=>{notice.remove();clearTimeout(timer)});
 undoEntries.clear();
}
function undoDelete(appointmentId){
 const entry=undoEntries.get(appointmentId);
 if(!entry)return;
 const {record,notice,timer}=entry;
 if(!client(record.clientId)||!service(record.serviceId))return toast('Aby przywrócić wizytę, potrzebna jest powiązana klientka i usługa.');
 if(hasOverlap(record))return toast('Ten termin jest już zajęty. Zwolnij go, aby przywrócić wizytę.');
 if(!save(withRecord('appointments',record)))return;
 clearTimeout(timer);undoEntries.delete(appointmentId);notice.remove();
 render();toast('Wizyta została przywrócona.');
}
function downloadFile(name,type,content){const blob=new Blob([content],{type});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),2000)}
function exportJSON(){
 if(readFailed){toast('Brak dostępu do zapisanych danych. Sprawdź ustawienia przeglądarki.');return}
 const now=new Date();
 const filename=`vera-beauty-kopia-${dateStr(now)}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.json`;
 downloadFile(filename,'application/json;charset=utf-8',JSON.stringify({...data,exportedAt:now.toISOString()},null,2));
 backupDate=dateStr(now);
 try{localStorage.setItem(BACKUP_KEY,backupDate)}catch(error){console.warn('Nie można zapisać daty kopii zapasowej',error)}
 const card=$('#backup-card');
 if(card)card.innerHTML=backupCard();
 toast('Kopia jest gotowa. Sprawdź plik w pobranych.');
}
const csvEscape=s=>`"${String(s??'').replace(/"/g,'""')}"`;
function exportCSV(kind){let rows=[];if(kind==='clients')rows=[['Imię i nazwisko','Telefon','E-mail','Notatki','Data dodania'],...data.clients.map(c=>[c.name,c.phone,c.email,c.notes,c.createdAt])];
 else if(kind==='finance')rows=[['Data','Godzina','Klientka','Usługa','Kwota PLN','Status','Płatność'],...data.appointments.filter(a=>inMonth(a,ui.month)).map(a=>[a.date,a.time,apName(a),svcName(a),apPrice(a),statusName(a.status),statusName(a.payment)])];
 else rows=[['Data','Godzina','Klientka','Telefon','Usługa','Cena PLN','Status','Płatność','Notatki'],...sortedAppointments().map(a=>[a.date,a.time,apName(a),client(a.clientId)?.phone||'',svcName(a),apPrice(a),statusName(a.status),statusName(a.payment),a.note])];
 const text='\uFEFF'+rows.map(r=>r.map(csvEscape).join(';')).join('\r\n');downloadFile(`vera-beauty-${kind}-${today()}.csv`,'text/csv;charset=utf-8',text);toast('Pobrano plik CSV')}
function importJSON(){
 const input=document.createElement('input');
 input.type='file';input.accept='.json,application/json';input.hidden=true;
 document.body.append(input);
 input.addEventListener('cancel',()=>input.remove(),{once:true});
 input.addEventListener('change',async()=>{
  try{
   const file=input.files?.[0];
   if(!file)return;
   if(file.size>12_000_000)throw new Error('Plik jest zbyt duży.');
   const parsed=normalizeData(JSON.parse(await file.text()));
   const validRecords=records=>records.every(record=>record&&typeof record.id==='string'&&record.id)&&new Set(records.map(record=>record.id)).size===records.length;
   if(![parsed.clients,parsed.services,parsed.appointments,parsed.waitlist].every(validRecords)||
      !parsed.appointments.every(a=>/^\d{4}-\d{2}-\d{2}$/.test(a.date)&&/^\d{2}:\d{2}$/.test(a.time)))throw new Error('Kopia zawiera nieprawidłowe wpisy.');
   if(!window.confirm(`Wczytać kopię? Zawiera ${parsed.appointments.length} wizyt i ${parsed.clients.length} klientek. Zastąpi aktualne dane w tej przeglądarce.`))return;
   const {exportedAt,...rest}=parsed;
   if(!save(includeSalonCatalog(parsed.demo?withoutDemo(rest):rest),toast,true))return;
   clearUndo();
   if(ui.modal)closeModal();
   render();toast('Kopia została wczytana');
  }catch(error){toast('Błąd: '+error.message)}
  finally{input.remove()}
 },{once:true});
 input.click();
}
function copyReminder(){const message=$('#reminder-text')?.value;if(!message)return;const copy=()=>{const a=$('#reminder-text');a.select();document.execCommand('copy');toast('Tekst przypomnienia skopiowany')};if(navigator.clipboard?.writeText)navigator.clipboard.writeText(message).then(()=>toast('Tekst przypomnienia skopiowany')).catch(copy);else copy()}
function smsPhone(value){
 let phone=String(value||'').replace(/[\s().-]/g,'');
 if(phone.startsWith('00'))phone='+'+phone.slice(2);
 if(/^\d{9}$/.test(phone))phone='+48'+phone;
 if(/^48\d{9}$/.test(phone))phone='+'+phone;
 return /^\+[1-9]\d{6,14}$/.test(phone)?phone:'';
}
function smsReminder(phone){
 const message=$('#reminder-text')?.value||'';
 const recipient=smsPhone(phone);
 if(!recipient){toast('Uzupełnij numer telefonu klientki.');return}
 const apple=/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
 location.href=`sms:${recipient}${apple?'&':'?'}body=${encodeURIComponent(message)}`;
}
async function pushAction(action,target){
 target.disabled=true;
 try{
  if(action==='push-enable')await window.VeraPush.enable($('#field-pushKey').value.trim());
  if(action==='push-test'){await window.VeraPush.test();toast('Wysłano powiadomienie testowe.');return}
  if(action==='push-disable')await window.VeraPush.disable();
  openModal('push-settings');
 }catch(error){formError(error.message)}
 finally{if(target.isConnected)target.disabled=false}
}
function setSearch(value,src){ui.search=value;if(src==='page'){renderPage();const inp=$('[data-role="page-search"]');if(inp){inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length)}}else renderPage()}
function handleAction(e){const target=e.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;if(action!=='backdrop')e.preventDefault();
 switch(action){
 case 'booking-refresh':void refreshBookingInbox();break;
 case 'booking-logout':void refreshBookingInbox({action:'logout'});break;
 case 'booking-confirm':void decideBooking(target.dataset.id,'confirmed');break;
 case 'booking-decline':void decideBooking(target.dataset.id,'declined');break;
 case 'reminder-list':openModal('reminder-list');break;
 case 'push-settings':openModal('push-settings');break;
 case 'push-enable':case 'push-test':case 'push-disable':void pushAction(action,target);break;
 case 'navigate':go(target.dataset.page);break;
 case 'toggle-menu':ui.mobile=!ui.mobile;render();break;
 case 'close-menu':ui.mobile=false;render();break;
 case 'install-app':if(installPrompt){const prompt=installPrompt;installPrompt=null;ui.installReady=false;render();prompt.prompt();prompt.userChoice.then(()=>render()).catch(error=>{console.error('Nie udało się zainstalować aplikacji:',error);toast('Nie udało się rozpocząć instalacji')})}else toast('Aby dodać aplikację, użyj menu przeglądarki i wybierz „Dodaj do ekranu głównego”');break;
 case 'new-appointment':startAppointment({draft:{date:target.dataset.date||today(),clientId:target.dataset.client||'',serviceId:target.dataset.service||''}});break;
 case 'edit-appointment':openModal('appointment',{id:target.dataset.id});break;
 case 'reschedule-appointment':openModal('appointment',{id:target.dataset.id,reschedule:true});break;
 case 'complete-appointment':changeVisit(target.dataset.id,{status:'completed',payment:'paid'},'Wizyta zakończona i opłacona');break;
 case 'agenda-day':{
  ui.agendaDay=Number(target.dataset.day);
  renderPage();
  $(`[data-action="agenda-day"][data-day="${ui.agendaDay}"]`)?.focus({preventScroll:true});
  break;
 }
 case 'agenda-actions':openModal('agenda-actions',{id:target.dataset.id});break;
 case 'confirm-cancel':{
  const a=data.appointments.find(a=>a.id===target.dataset.id);
  if(a?.status==='scheduled')startCancellation(a);
  break;
 }
 case 'toggle-confirmation':case 'toggle-reminded':{
  const a=data.appointments.find(a=>a.id===target.dataset.id);
  if(!a)break;
  if(action==='toggle-confirmation')changeVisit(a.id,{confirmed:!a.confirmed},a.confirmed?'Cofnięto potwierdzenie.':'Wizyta potwierdzona.');
  else if(save(withRecord('appointments',{...a,reminded:!a.reminded}))){
   closeModal();render();toast(a.reminded?'Cofnięto oznaczenie SMS.':'Oznaczono SMS jako wysłany.');
  }
  break;
 }
 case 'free-slots':openModal('free-slots',{date:target.dataset.date<today()?today():target.dataset.date});break;
 case 'book-slot':{
  const {date,time,service:serviceId}=target.dataset;
  startAppointment({draft:{date,time,serviceId}});
  break;
 }
 case 'waitlist':openModal('waitlist');break;
 case 'add-waitlist':openModal('waitlist',{add:true});break;
 case 'waitlist-opening':openModal('waitlist',{openingId:target.dataset.id});break;
 case 'fill-opening':{
  const a=data.appointments.find(visit=>visit.id===target.dataset.id&&visit.status==='cancelled');
  if(a)startAppointment({draft:{date:a.date,time:a.time,serviceId:service(a.serviceId)?.active?a.serviceId:''}});
  break;
 }
 case 'remove-waitlist':{
  const waitlist=data.waitlist.filter(item=>item.id!==target.dataset.id);
  if(save({...data,waitlist})){closeModal();render();openModal('waitlist');toast('Usunięto zgłoszenie z listy.')}
  break;
 }
 case 'book-waitlist':{
  const a=data.appointments.find(a=>a.id===target.dataset.opening&&a.status==='cancelled');
  const entry=a&&waitlistMatches(a).find(item=>item.id===target.dataset.id);
  if(entry)startAppointment({waitlistId:entry.id,draft:{clientId:entry.clientId,serviceId:entry.serviceId,date:a.date,time:a.time}});
  else toast('Termin lub zgłoszenie nie są już dostępne.');
  break;
 }
 case 'undo-delete':undoDelete(target.dataset.id);break;
 case 'new-client':openModal('client');break;
 case 'new-client-from-appointment':{
  const draft=Object.fromEntries(new FormData($('#modal-form')));
  openModal('client',{returnToAppointment:{...ui.modal,draft}});
  break;
 }
 case 'edit-client':openModal('client',{id:target.dataset.id});break;
 case 'client-detail':openModal('client-detail',{id:target.dataset.id});break;
 case 'new-service':openModal('service');break;
 case 'edit-service':openModal('service',{id:target.dataset.id});break;
 case 'set-status':ui.status=target.dataset.status;renderPage();break;
 case 'calendar-view':ui.calendarView=target.dataset.view;renderPage();break;
 case 'calendar-today':ui.calendarDate=new Date();renderPage();break;
 case 'calendar-shift':{const d=ui.calendarDate;ui.calendarDate=ui.calendarView==='week'?addDays(d,7*Number(target.dataset.shift)):new Date(d.getFullYear(),d.getMonth()+Number(target.dataset.shift),1,12);renderPage();break}
 case 'calendar-day':startAppointment({draft:{date:target.dataset.date}});break;
 case 'finance-shift':ui.month=new Date(ui.month.getFullYear(),ui.month.getMonth()+Number(target.dataset.shift),1);renderPage();break;
 case 'close-modal':dismissModal();break;
 case 'backdrop':if(e.target===target)dismissModal();break;
 case 'confirm-delete':confirmDelete(target.dataset.entity,target.dataset.id);break;
 case 'confirm-yes':doConfirm();break;
 case 'confirm-reset':openModal('confirm',{title:'Usunąć wszystkie dane?',message:'Usuniesz wszystkie klientki, usługi, wizyty i informacje o przychodach. Najpierw pobierz kopię zapasową JSON. Ta operacja jest nieodwracalna.',button:'Usuń wszystko',confirmAction:'reset'});break;
 case 'clear-demo':if(!data.demo){toast('Brak danych demonstracyjnych');break}openModal('confirm',{title:'Usunąć dane demonstracyjne?',message:'Usuniemy przykładowe klientki, wizyty i usługi. Twoje własne wpisy i ustawienia studia pozostaną zapisane.',button:'Wyczyść dane demo',confirmAction:'clear-demo'});break;
 case 'export-json':exportJSON();break;
 case 'export-csv':exportCSV(target.dataset.kind||'appointments');break;
 case 'import-json':importJSON();break;
 case 'remind':openModal('reminder',{id:target.dataset.id});break;
 case 'copy-reminder':copyReminder();break;
 case 'sms-reminder':smsReminder(target.dataset.phone);break;
 default:break;
 }
}
document.addEventListener('click',handleAction);
document.addEventListener('submit',e=>{if(e.target.id==='settings-form')submitSettings(e);else if(e.target.id==='modal-form')formSave(e);else if(e.target.id==='booking-login'){e.preventDefault();const key=new FormData(e.target).get('key');e.target.reset();void refreshBookingInbox({action:'login',key})}});
document.addEventListener('input',e=>{if(e.target.dataset.role==='page-search')setSearch(e.target.value,'page');if(e.target.dataset.role==='global-search')setSearch(e.target.value,'global')});
document.addEventListener('change',event=>{
 if(event.target.name==='serviceId')updatePrice();
 if(event.target.id==='slot-service'||event.target.name==='slotDate'){
  $('#slot-results').innerHTML=slotResults($('#field-slotDate').value,$('#slot-service').value);
 }
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&ui.modal){event.preventDefault();dismissModal()}
 if((event.key==='Enter'||event.key===' ')&&event.target.classList.contains('month-day')){
  event.preventDefault();
  startAppointment({draft:{date:event.target.dataset.date}});
 }
 if(event.key==='Tab'&&ui.modal){
  const focusable=$$('.modal button:not([disabled]),.modal input,.modal select,.modal textarea');
  const first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&(event.target===first||event.target===$('.modal'))){event.preventDefault();last?.focus()}
  if(!event.shiftKey&&event.target===last){event.preventDefault();first?.focus()}
 }
});
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible'&&ui.page==='dashboard'&&!ui.modal)renderPage();
 if(document.visibilityState==='visible')syncPushSchedule();
});
document.addEventListener('vera-push-status',()=>{
 $$('.push-status').forEach(element=>element.textContent=window.VeraPush.status);
});
navigator.serviceWorker?.addEventListener('message',event=>{
 if(event.data?.type==='OPEN_REMINDERS')openModal('reminder-list');
});
render();
syncPushSchedule();
void window.VeraPush?.init();
if(new URLSearchParams(location.search).get('bookings')==='1')go('booking-inbox');
if(new URLSearchParams(location.search).get('reminders')==='1')openModal('reminder-list');
})();
