/* ui.js — helper tampilan: templat aman-XSS, ikon, maskot, toast, modal, ekspor */
'use strict';
// Registri global dipakai semua halaman (harus ada sebelum siswa.js/guru.js/admin.js dimuat)
const PAGES = {}, ACT = {}, INP = {};
class Raw { constructor(s) { this.s = s; } }
const raw = (s) => new Raw(s);
const esc = (s) => String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function h(str, ...v) {
  let o = str[0];
  v.forEach((x, i) => { o += (x instanceof Raw ? x.s : Array.isArray(x) ? x.map((y) => (y instanceof Raw ? y.s : esc(y))).join('') : esc(x)) + str[i + 1]; });
  return new Raw(o);
}
const R = (x) => (x instanceof Raw ? x.s : String(x));
// tombol kirim form (e.submitter tidak ada di Safari/iOS lama)
const tombolKirim = (e) => e.submitter || e.target.querySelector('button[type=submit], button:not([type])') || { disabled: false };
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

const IC = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>', edit: '<path d="M4 6h10M4 12h7M4 18h5"/><path d="M14 16l5-5 2 2-5 5-3 1z"/>',
  book: '<path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2z"/><path d="M22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/>', checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  upload: '<path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/><path d="M20 17.6A5 5 0 0018 8h-1.3A8 8 0 104 16.3"/>', star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M17 4.5a3.5 3.5 0 010 7M19 14c2 .7 3 2.5 3 6"/>', bell: '<path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 004 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>', flame: '<path d="M12 22c4 0 7-2.8 7-7 0-3-1.8-5-3.5-7-.5 2-1.5 3-3 3 .5-3-.5-6-3.5-9-1 4-5 6-5 12 0 4.2 4 8 8 8z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>', chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  message: '<path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.2A8 8 0 1121 12z"/>', plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', arrowl: '<path d="M19 12H5M11 6l-6 6 6 6"/>', play: '<path d="M7 4l13 8-13 8z"/>', trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0z"/><path d="M17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8c-2-4-6-3-5 0 .5 1.5 3 1 5 0zM12 8c2-4 6-3 5 0-.5 1.5-3 1-5 0z"/>', calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', logout: '<path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4M16 8l5 4-5 4M21 12H9"/>',
  link: '<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>', image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 9"/>',
  file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>', refresh: '<path d="M20 11a8 8 0 00-14-4L4 9M4 4v5h5M4 13a8 8 0 0014 4l2-2M20 20v-5h-5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z"/>', save: '<path d="M5 3h11l4 4v14H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>', tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 8l3 3"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>', cloud: '<path d="M7 18a5 5 0 010-10 6 6 0 0111.5 1.5A4 4 0 0118 18z"/>'
};
const ic = (n, cls) => raw('<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || '') + '</svg>');
const MASKOT = raw('<svg class="mascot" viewBox="0 0 200 200" role="img" aria-label="Maskot Garuda kecil"><defs><radialGradient id="mg" cx="40%" cy="30%"><stop offset="0" stop-color="#FFC15E"/><stop offset="1" stop-color="#F59E0B"/></radialGradient></defs><ellipse cx="100" cy="190" rx="46" ry="6" fill="rgba(0,0,0,.14)"/><path d="M60 78c-20-14-40-4-44 14 16-2 26 4 34 16z" fill="#F59E0B"/><path d="M140 78c20-14 40-4 44 14-16-2-26 4-34 16z" fill="#F59E0B"/><path d="M82 40c4-16 14-22 18-22s14 6 18 22c-6-5-12-7-18-7s-12 2-18 7z" fill="#EF4444"/><ellipse cx="100" cy="112" rx="54" ry="62" fill="url(#mg)"/><ellipse cx="100" cy="132" rx="32" ry="38" fill="#FFE9B8"/><rect x="50" y="80" width="100" height="9" rx="4.5" fill="#7C3F00"/><circle cx="78" cy="85" r="17" fill="#fff" stroke="#7C3F00" stroke-width="5"/><circle cx="122" cy="85" r="17" fill="#fff" stroke="#7C3F00" stroke-width="5"/><circle cx="80" cy="87" r="7" fill="#1E293B"/><circle cx="124" cy="87" r="7" fill="#1E293B"/><circle cx="83" cy="84" r="2.4" fill="#fff"/><circle cx="127" cy="84" r="2.4" fill="#fff"/><path d="M90 102l10 14 10-14z" fill="#F97316"/><path d="M62 124c24 12 52 12 76 0l4 12c-26 14-58 14-84 0z" fill="#2F7BF5"/><path d="M118 136l12 26-14-4z" fill="#2F7BF5"/><path d="M82 176h14M106 176h14" stroke="#F97316" stroke-width="6" stroke-linecap="round"/></svg>');

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'], BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const tglObj = (s) => new Date(String(s).slice(0, 10) + 'T12:00:00');
const fmtTgl = (s) => { if (!s) return '-'; const d = tglObj(s); return isNaN(d) ? '-' : d.getDate() + ' ' + BULAN[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear(); };
const fmtWaktu = (s) => { if (!s) return '-'; const t = String(s); return fmtTgl(t) + (t.length > 10 ? ', ' + t.slice(11, 16) : ''); };
const hariIni = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const selisihHari = (s) => Math.round((tglObj(s) - tglObj(hariIni())) / 864e5);
const inisial = (n) => String(n || '?').trim().split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
const ukuran = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
const avatar = (n, foto, cls) => h`<span class="avatar ${cls || ''}">${foto && /^https:\/\//.test(foto) ? raw('<img src="' + esc(foto) + '" alt="" referrerpolicy="no-referrer">') : inisial(n)}</span>`;
const stars = (n, tot) => { tot = tot || 5; let o = ''; for (let i = 1; i <= tot; i++) o += '<span class="' + (i <= n ? '' : 'off') + '">' + R(ic('star')) + '</span>'; return raw('<span class="stars" role="img" aria-label="' + n + ' dari ' + tot + ' bintang">' + o + '</span>'); };
const pill = (t, k) => h`<span class="pill ${k || ''}">${t}</span>`;
const STATUS_PILL = { Belum: 'gray', Draft: 'gray', Dikirim: 'orange', Dinilai: 'green', Aktif: 'green', Nonaktif: 'gray', Berjalan: 'orange', Selesai: 'green', Dihentikan: 'gray', Terkirim: 'green', Menunggu: 'orange', Gagal: 'pink', Batal: 'gray' };
const statusPill = (s) => pill({ Dikirim: 'Menunggu nilai', Belum: 'Belum dikerjakan' }[s] || s, STATUS_PILL[s] || '');
const ph = (judul, sub, aksi) => h`<div class="ph"><div><h1>${judul}</h1>${sub ? h`<p>${sub}</p>` : ''}</div><div class="row wrap">${aksi || ''}</div></div>`;
const skel = (n, tinggi) => raw(Array.from({ length: n || 3 }, () => '<div class="sk" style="height:' + (tinggi || 90) + 'px;margin-bottom:14px"></div>').join(''));
const empty = (judul, sub, aksi) => h`<div class="empty">${MASKOT}<h3>${judul}</h3><p>${sub || ''}</p>${aksi ? h`<div class="mt16">${aksi}</div>` : ''}</div>`;
const pager = (total, per, hal, act) => { const n = Math.ceil(total / per); if (n <= 1) return ''; let o = ''; for (let i = 1; i <= n && i <= 12; i++) o += '<button data-act="' + act + '" data-p="' + i + '" class="' + (i === hal ? 'on' : '') + '">' + i + '</button>'; return raw('<div class="pager">' + o + '</div>'); };

function toast(msg, tipe) {
  let w = $('.toasts'); if (!w) { w = document.createElement('div'); w.className = 'toasts'; w.setAttribute('role', 'status'); w.setAttribute('aria-live', 'polite'); document.body.appendChild(w); }
  const t = document.createElement('div'); t.className = 'toast ' + (tipe || 'info');
  t.innerHTML = R(ic(tipe === 'error' ? 'x' : tipe === 'success' ? 'checkc' : 'info')) + '<div>' + esc(msg) + '</div>';
  w.appendChild(t); setTimeout(() => { t.remove(); }, tipe === 'error' ? 6000 : 3500);
}
const gagal = (e) => { toast((e && e.message) || 'Terjadi kesalahan.', 'error'); };
function modal(judul, isi, opt) {
  opt = opt || {}; tutupModal();
  const o = document.createElement('div'); o.className = 'overlay' + (opt.kanan ? ' right' : ''); o.id = 'modal';
  o.innerHTML = R(h`<div class="modal ${opt.lebar ? 'wide' : ''} ${opt.kanan ? 'drawer' : ''}" role="dialog" aria-modal="true" aria-label="${judul}"><div class="row between mb16"><h2>${judul}</h2><button class="btn ghost icon" data-act="tutup" aria-label="Tutup">${ic('x')}</button></div><div id="modal-body">${isi}</div></div>`);
  o.addEventListener('mousedown', (e) => { if (e.target === o) tutupModal(); });
  document.body.appendChild(o); const f = $('input,textarea,select,button.btn:not(.ghost)', o); if (f && !opt.noFocus) f.focus();
  return o;
}
const tutupModal = () => { const m = $('#modal'); if (m) m.remove(); };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tutupModal(); });
function konfirmasi(judul, teks, labelOk, fn, bahaya) {
  modal(judul, h`<p>${teks}</p><div class="row mt16" style="justify-content:flex-end"><button class="btn sec" data-act="tutup">Batal</button><button class="btn ${bahaya ? 'danger' : ''}" id="ok-konfirm">${labelOk}</button></div>`, { noFocus: true });
  $('#ok-konfirm').onclick = async () => { tutupModal(); await fn(); };
}
function sibuk(btn, teks, fn) {   // cegah klik ganda + tampilkan status
  return async () => { if (btn.disabled) return; const asal = btn.innerHTML; btn.disabled = true; btn.textContent = teks || 'Memproses…'; try { await fn(); } finally { btn.disabled = false; btn.innerHTML = asal; } };
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

// ----- berkas & ekspor -----
function bacaBase64(file) { return new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = () => no(new Error('Gagal membaca berkas.')); r.readAsDataURL(file); }); }
function kompresGambar(file, maks, mutu) {
  return new Promise((ok, no) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const s = Math.min(1, (maks || 1600) / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); ok(c.toDataURL('image/jpeg', mutu || 0.82).split(',')[1]); };
    im.onerror = () => { URL.revokeObjectURL(url); no(new Error('Gambar tidak bisa dibaca.')); }; im.src = url;
  });
}
function parseCSV(t) {
  const rows = []; let r = [], c = '', q = false; t = String(t).replace(/^\uFEFF/, '');
  const d = (t.split('\n')[0].match(/;/g) || []).length > (t.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
  for (let i = 0; i < t.length; i++) { const ch = t[i]; if (q) { if (ch === '"' && t[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; } else if (ch === '"') q = true; else if (ch === d) { r.push(c); c = ''; } else if (ch === '\n') { r.push(c); rows.push(r); r = []; c = ''; } else if (ch !== '\r') c += ch; }
  if (c !== '' || r.length) { r.push(c); rows.push(r); }
  return rows.filter((x) => x.some((y) => String(y).trim() !== ''));
}
function unduhBlob(blob, nama) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nama; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
function unduhCSV(rows, nama) {
  if (!rows.length) return toast('Tidak ada data untuk diunduh.', 'warn');
  const k = Object.keys(rows[0]), q = (v) => '"' + String(v === null || v === undefined ? '' : v).replace(/"/g, '""') + '"';
  unduhBlob(new Blob(['\uFEFF' + [k.map(q).join(',')].concat(rows.map((r) => k.map((x) => q(r[x])).join(','))).join('\n')], { type: 'text/csv' }), nama + '.csv');
}
function muatSkrip(src) { return new Promise((ok, no) => { if ($('script[src="' + src + '"]')) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('gagal memuat ' + src)); document.head.appendChild(s); }); }
async function unduhExcel(rows, nama) {
  if (!rows.length) return toast('Tidak ada data untuk diunduh.', 'warn');
  try { await muatSkrip('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Data'); XLSX.writeFile(wb, nama + '.xlsx'); }
  catch (e) { toast('Pustaka Excel tidak bisa dimuat (offline?). Mengunduh CSV yang bisa dibuka di Excel.', 'warn'); unduhCSV(rows, nama); }
}
function cetakPDF(judul, rows) {
  if (!rows.length) return toast('Tidak ada data untuk dicetak.', 'warn');
  const k = Object.keys(rows[0]), f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(f);
  f.contentDocument.write(R(h`<html><head><title>${judul}</title><style>body{font:12px Arial,sans-serif;padding:16px}h1{font-size:16px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:4px 6px;text-align:left}th{background:#eee}</style></head><body><h1>${judul}</h1><p>Dicetak ${fmtWaktu(new Date().toISOString())}</p><table><thead><tr>${k.map((x) => h`<th>${x}</th>`)}</tr></thead><tbody>${rows.map((r) => h`<tr>${k.map((x) => h`<td>${r[x]}</td>`)}</tr>`)}</tbody></table></body></html>`));
  f.contentDocument.close(); setTimeout(() => { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 1500); }, 300);
}
