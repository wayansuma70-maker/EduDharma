/* api.js — komunikasi dengan GAS (fetch text/plain), sesi, cache SWR, antrean notifikasi */
'use strict';
const Sesi = {
  get() { try { return JSON.parse(localStorage.getItem('ed.sesi') || 'null'); } catch (e) { return null; } },
  set(o) { try { localStorage.setItem('ed.sesi', JSON.stringify(o)); } catch (e) { /* abaikan */ } },
  clear() { try { localStorage.removeItem('ed.sesi'); Cache.hapusSemua(); } catch (e) { /* abaikan */ } }
};
const Cache = {
  hapusSemua() { try { Object.keys(localStorage).filter((k) => k.indexOf('ed.c:') === 0).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* abaikan */ } }
};
const READ = /^(siswa\.|auth\.me|auth\.config|jurnal\.get|kebiasaan\.get|4f\.get|bukti\.(daftar|ambil)|nilai\.saya|guru\.|tugas\.list|submission\.|rekap\.|pengguna\.list|pengaturan\.get|rahasia\.status|audit\.list|notif\.(status|antrean)|wa\.(audience|blastList)|crm\.(list|stats|detail|export)|batch)/;
let _epoch = 0; const _inflight = {};
let _drain = null;

async function apiRun(action, data, token) {
  const cfg = window.APP_CONFIG || {};
  if (!cfg.GAS_URL || /GANTI|XXXX/.test(cfg.GAS_URL)) throw new Error('Konfigurasi belum lengkap: isi GAS_URL di js/config.js.');
  let res;
  try { res = await fetch(cfg.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, token: token, data: data || {} }) }); }
  catch (e) { throw new Error('Tidak bisa terhubung ke server. Periksa koneksi internet.'); }
  try { return await res.json(); } catch (e) { throw new Error('Server memberi jawaban tak terduga. Pastikan Web App di-deploy dengan akses "Anyone".'); }
}
async function api(action, data, opts) {
  const s = Sesi.get(), token = s && s.token, baca = READ.test(action);
  if (!baca) { _epoch++; Cache.hapusSemua(); }
  const k = _epoch + '|' + action + '|' + JSON.stringify(data || {});
  if (baca && _inflight[k]) return _inflight[k];
  const p = (async () => {
    const j = await apiRun(action, data, token);
    if (j.code === 'AUTH' && !/^auth\.(google|darurat)$/.test(action)) { keluar(true); throw new Error(j.message || 'Sesi berakhir.'); }
    if (j.nq > 0 && s && s.me && s.me.peran !== 'siswa') jadwalkanDrain();
    if (!j.success) { const e = new Error(j.message || 'Gagal.'); e.code = j.code; throw e; }
    return j.data;
  })();
  if (baca) { _inflight[k] = p; p.then(() => { delete _inflight[k]; }, () => { delete _inflight[k]; }); }
  return p;
}
async function apiSWR(action, data, onData, maxAge) {
  const key = 'ed.c:' + action + ':' + JSON.stringify(data || {}); let c = null;
  try { c = JSON.parse(localStorage.getItem(key)); } catch (e) { c = null; }
  if (c) { onData(c.d, true); if (Date.now() - c.t < (maxAge || 15000)) return c.d; }
  try {
    const d = await api(action, data), sama = c && JSON.stringify(c.d) === JSON.stringify(d);
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: d })); } catch (e) { /* kuota penuh */ }
    if (!sama) onData(d, false);
    return d;
  } catch (e) { if (!c) throw e; if (navigator.onLine === false) return c.d; throw e; }
}
function jadwalkanDrain() {
  clearTimeout(_drain);
  _drain = setTimeout(async () => { try { await apiRun('notif.drain', {}, (Sesi.get() || {}).token); } catch (e) { /* abaikan */ } }, 400);
}
function hangatkan() { try { fetch(window.APP_CONFIG.GAS_URL + '?w=pub', { mode: 'no-cors' }); } catch (e) { /* abaikan */ } }
