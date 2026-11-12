/* app.js — boot, login Google, shell (sidebar/topbar/bottom-nav), router hash, PWA */
'use strict';
const Router = { id: 0 };
const MENU = {
  siswa: [['beranda', 'Beranda', 'home'], ['laporan', 'Laporan 4F', 'edit'], ['jurnal', 'Jurnal Pancasila', 'book'], ['kebiasaan', '7 Kebiasaan', 'checkc'], ['bukti', 'Kumpulkan Bukti', 'upload'], ['nilai', 'Nilai & Umpan Balik', 'star']],
  guru: [['guru', 'Beranda Guru', 'home'], ['tugas', 'Kelola Tugas', 'edit'], ['submission', 'Submission', 'table'], ['rekap', 'Rekap & Ekspor', 'chart'], ['crm', 'CRM Kontak', 'users'], ['notif', 'WhatsApp & Notifikasi', 'message']],
  admin: [['pengguna', 'Pengguna', 'users'], ['pengaturan', 'Pengaturan', 'settings'], ['migrasi', 'Impor Data Lama', 'download']]
};
const menuUntuk = (p) => (p === 'siswa' ? [MENU.siswa] : p === 'guru' ? [MENU.guru] : [MENU.guru, MENU.admin]);
const sesi = () => Sesi.get() || {};
const aku = () => sesi().me || {};
const meta = () => sesi().meta || { sila: [], kebiasaan: [], setting: {} };
const setting = (k, d) => { const v = (meta().setting || {})[k]; return v === undefined ? d : v; };
const home = () => (aku().peran === 'siswa' ? 'beranda' : 'guru');

function nav(hash) { if (location.hash === '#/' + hash) renderRoute(); else location.hash = '#/' + hash; }
function keluar(sesiHabis) { Sesi.clear(); tutupModal(); location.hash = ''; renderLogin(sesiHabis ? 'Sesi berakhir. Silakan masuk lagi.' : ''); }

// ---------- Login ----------
async function renderLogin(pesan) {
  document.title = 'Masuk — EduDharma';
  const darurat = location.hash === '#darurat';
  $('#app').innerHTML = R(h`<main class="login"><div class="card"><div>${MASKOT}</div><h1>EduDharma</h1><p class="muted login-slogan">Edukasi Wisata Digital Sempatik_Teknologi Membuka Jalan, Edukasi Menguatkan Langkah, Pesona Memikat Dunia</p>
    ${pesan ? h`<div class="err" role="alert">${pesan}</div>` : ''}
    ${darurat ? h`<form id="f-darurat" class="mt16" style="text-align:left"><div class="field"><label for="du">Nama pengguna darurat</label><input class="input" id="du" autocomplete="username" required></div><div class="field"><label for="dp">Kata sandi darurat</label><input class="input" id="dp" type="password" autocomplete="current-password" required></div><button class="btn block" type="submit">Masuk Darurat</button><p class="hint muted sm mt8">Hanya untuk admin saat Google login belum disiapkan. Sandi ada di log setup Apps Script.</p></form>`
      : h`<div class="gbtn" id="gbtn"><div class="sk" style="width:260px;height:44px"></div></div><p class="muted sm">Masuk dengan akun Google yang didaftarkan sekolah.<br>Belum bisa masuk? Hubungi guru atau admin.</p>`}
    <div id="login-err"></div></div></main>`);
  hangatkan();
  if (darurat) { $('#f-darurat').onsubmit = async (e) => { e.preventDefault(); const b = tombolKirim(e); b.disabled = true; try { const d = await api('auth.darurat', { username: $('#du').value, password: $('#dp').value }); Sesi.set({ token: d.token, me: d.me, meta: d.meta }); location.hash = ''; mulai(); } catch (er) { $('#login-err').innerHTML = R(h`<div class="err" role="alert">${er.message}</div>`); b.disabled = false; } }; return; }
  try {
    const c = await api('auth.config', {});
    window._cfgPublik = c;
    if (!c.googleClientId) { $('#gbtn').innerHTML = R(h`<div class="err">Admin belum mengisi Google Client ID. Admin dapat masuk lewat akses darurat (tambahkan <b>#darurat</b> di akhir alamat).</div>`); return; }
    await muatSkrip('https://accounts.google.com/gsi/client');
    google.accounts.id.initialize({ client_id: c.googleClientId, callback: onKredensial, auto_select: false });
    $('#gbtn').innerHTML = ''; google.accounts.id.renderButton($('#gbtn'), { theme: 'outline', size: 'large', text: 'signin_with', shape: 'pill', width: 300, locale: 'id' });
  } catch (e) { $('#gbtn').innerHTML = R(h`<div class="err">${e.message}</div>`); }
}
async function onKredensial(resp) {
  try { const d = await api('auth.google', { credential: resp.credential }); Sesi.set({ token: d.token, me: d.me, meta: d.meta }); mulai(); }
  catch (e) { $('#login-err').innerHTML = R(h`<div class="err" role="alert">${e.message}</div>`); }
}

// ---------- Shell ----------
function renderShell() {
  const me = aku(), grup = menuUntuk(me.peran), ikon = (r) => r[2];
  const item = (r) => h`<a href="#/${r[0]}" data-r="${r[0]}">${ic(ikon(r))}<span>${r[1]}</span></a>`;
  const navHtml = grup.map((g, i) => h`${i ? h`<div class="sec">Administrasi</div>` : ''}${g.map(item)}`);
  const semua = [].concat(...grup), bn = semua.slice(0, 4);
  $('#app').innerHTML = R(h`<a class="skip" href="#view">Lewati ke konten</a>
    <aside class="side" id="side" aria-label="Navigasi utama"><div class="brand"><span class="logo">${ic('shield')}</span><div><b>EduDharma</b><small>Edukasi Wisata Digital</small></div></div>
      <nav class="nav">${navHtml}</nav><button class="btn sec sm hide mt8" id="btn-install" data-act="pasang">${ic('download')} Pasang aplikasi</button>
      <div class="me">${avatar(me.nama, me.foto)}<div class="grow"><b>${me.nama}</b><small>${me.peran === 'siswa' ? 'Kelas ' + (me.kelas || '-') : me.peran === 'guru' ? 'Guru' : 'Admin'}</small></div><button class="btn ghost icon" data-act="keluar" aria-label="Keluar" title="Keluar">${ic('logout')}</button></div></aside>
    <div class="scrim" id="scrim" data-act="menu"></div>
    <div class="main"><div id="offline" class="banner hide">Kamu sedang offline — data terakhir ditampilkan, perubahan belum bisa disimpan.</div>
      <header class="top"><button class="burger" data-act="menu" aria-label="Buka menu">${ic('menu')}</button>
        <form class="search" id="f-cari" role="search"><label class="skip" for="q">Cari</label>${ic('search')}<input id="q" type="search" placeholder="${me.peran === 'siswa' ? 'Cari tugas, sila, atau kebiasaan…' : 'Cari nama siswa pada submission…'}" autocomplete="off"></form><div class="grow"></div>
        ${me.peran === 'siswa' ? h`<span class="chip fire" title="Hari berturut-turut aktif">${ic('flame')}<span id="c-api">0</span> Hari Api</span><span class="chip star" title="Total bintang">${ic('star')}<span id="c-bintang">0</span></span>` : ''}
        <button class="bell" id="bell" data-act="lonceng" aria-label="Pengingat">${ic('bell')}<i class="hide" id="bell-dot"></i></button></header>
      <main class="page" id="view" tabindex="-1"></main></div>
    <nav class="bnav" aria-label="Navigasi bawah">${bn.map((r) => h`<a href="#/${r[0]}" data-r="${r[0]}">${ic(ikon(r))}<span>${r[1].split(' ')[0]}</span></a>`)}<button data-act="menu">${ic('menu')}<span>Menu</span></button></nav>`);
  $('#f-cari').onsubmit = (e) => { e.preventDefault(); cariCepat($('#q').value); };
  if (window._pasang) $('#btn-install').classList.remove('hide');
  segarkanLonceng();
}
function setChips(d) { const a = $('#c-api'), b = $('#c-bintang'); if (a && d.hariApi !== undefined) a.textContent = d.hariApi; if (b && d.bintang !== undefined) b.textContent = d.bintang; }
function cariCepat(q) {
  q = String(q || '').trim().toLowerCase(); if (!q) return;
  if (aku().peran !== 'siswa') { window._cariSub = q; return nav('submission'); }
  const peta = [['4f', 'laporan'], ['laporan', 'laporan'], ['refleksi', 'laporan'], ['jurnal', 'jurnal'], ['sila', 'jurnal'], ['pancasila', 'jurnal'], ['kebiasaan', 'kebiasaan'], ['bangun', 'kebiasaan'], ['tidur', 'kebiasaan'], ['bukti', 'bukti'], ['unggah', 'bukti'], ['foto', 'bukti'], ['nilai', 'nilai'], ['bintang', 'nilai'], ['beranda', 'beranda'], ['tugas', 'bukti']];
  const f = peta.find((p) => q.indexOf(p[0]) > -1);
  if (f) { $('#q').value = ''; nav(f[1]); } else toast('Tidak ada yang cocok. Coba kata: jurnal, 4F, kebiasaan, bukti, atau nilai.', 'warn');
}
async function segarkanLonceng() {
  const dot = $('#bell-dot'); if (!dot) return;
  try {
    if (aku().peran === 'siswa') { const d = await apiSWR('siswa.tugas', {}, () => {}, 60000); window._pengingat = d.tugas.filter((t) => (t.status === 'Belum' || t.status === 'Draft') && t.tenggat && selisihHari(t.tenggat) <= 3); dot.classList.toggle('hide', !window._pengingat.length); }
    else { const d = await apiSWR('guru.beranda', {}, () => {}, 60000); window._pengingat = d.kpi.belumDinilai; dot.classList.toggle('hide', !d.kpi.belumDinilai); }
  } catch (e) { /* lonceng tidak kritis */ }
}
ACT.lonceng = () => {
  const p = window._pengingat;
  if (aku().peran !== 'siswa') { if (p > 0) { window._filterSub = 'Dikirim'; nav('submission'); } else toast('Semua pengumpulan sudah dinilai. 👍', 'success'); return; }
  if (!p || !p.length) return toast('Tidak ada tugas yang mendesak. Kerja bagus! 🌟', 'success');
  modal('Pengingat Tugas', h`<div class="grid">${p.map((t) => h`<a class="card flat" href="#/${t.jenis === '4F' ? 'laporan/' + t.tugasId : t.jenis === 'Jurnal Pancasila' ? 'jurnal' : 'kebiasaan'}" data-act="tutup"><b>${t.judul}</b><div class="sm muted">Tenggat ${fmtTgl(t.tenggat)} · ${selisihHari(t.tenggat) < 0 ? 'sudah lewat' : selisihHari(t.tenggat) === 0 ? 'hari ini' : selisihHari(t.tenggat) + ' hari lagi'}</div></a>`)}</div>`);
};
ACT.menu = () => { $('#side').classList.toggle('open'); $('#scrim').classList.toggle('open'); };
ACT.keluar = () => konfirmasi('Keluar dari EduDharma?', 'Kamu perlu masuk lagi dengan akun Google untuk membuka aplikasi.', 'Keluar', () => keluar(false));
ACT.tutup = () => tutupModal();
ACT.pasang = async () => { const e = window._pasang; if (!e) return; e.prompt(); await e.userChoice; window._pasang = null; $('#btn-install').classList.add('hide'); };

// ---------- Router ----------
async function renderRoute() {
  const s = Sesi.get(); if (!s || !s.token) return renderLogin();
  if (!$('#view')) renderShell();
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').map(decodeURIComponent); let nama = parts[0];
  let r = PAGES[nama];
  if (!r || r.roles.indexOf(s.me.peran) < 0) { nama = home(); r = PAGES[nama]; if (location.hash && location.hash !== '#/' + nama) history.replaceState(null, '', '#/' + nama); }
  const id = ++Router.id, el = $('#view');
  $$('[data-r]').forEach((a) => a.classList.toggle('on', a.dataset.r === (r.aktif || nama)));
  $('#side').classList.remove('open'); $('#scrim').classList.remove('open');
  el.innerHTML = R(skel(3)); window.scrollTo(0, 0); document.title = r.judul + ' — EduDharma';
  try { await r.render(el, parts.slice(1), () => id === Router.id); }
  catch (e) { if (id === Router.id) el.innerHTML = R(h`<div class="card"><h3>Ups, ada kendala</h3><p class="muted mt8">${e.message}</p><button class="btn mt16" data-act="muat-ulang">${ic('refresh')} Coba lagi</button></div>`); }
}
ACT['muat-ulang'] = () => renderRoute();
function mulai() { renderShell(); renderRoute(); apiSWR('auth.me', {}, () => {}, 300000).then((d) => { const s = Sesi.get(); if (s) { s.me = d.me; s.meta = d.meta; Sesi.set(s); } }).catch(() => {}); }

// ---------- Event global ----------
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const f = ACT[t.dataset.act]; if (f) { if (t.tagName === 'A' && t.dataset.act === 'tutup') { tutupModal(); return; } e.preventDefault(); f(t, e); }
});
document.addEventListener('input', (e) => { const t = e.target.closest('[data-in]'); if (t && INP[t.dataset.in]) INP[t.dataset.in](t, e); });
document.addEventListener('change', (e) => { const t = e.target.closest('[data-ch]'); if (t && INP[t.dataset.ch]) INP[t.dataset.ch](t, e); });
window.addEventListener('hashchange', () => { if (location.hash === '#darurat') renderLogin(); else renderRoute(); });
window.addEventListener('online', () => { const o = $('#offline'); if (o) o.classList.add('hide'); toast('Kembali online.', 'success'); });
window.addEventListener('offline', () => { const o = $('#offline'); if (o) o.classList.remove('hide'); });
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); window._pasang = e; const b = $('#btn-install'); if (b) b.classList.remove('hide'); });
window.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('./sw.js').catch(() => {});
  if (!window.APP_CONFIG || /GANTI|XXXX/.test(window.APP_CONFIG.GAS_URL || '')) { $('#app').innerHTML = R(h`<main class="login"><div class="card"><div>${MASKOT}</div><h1>Konfigurasi belum lengkap</h1><p class="muted mt8">Buka berkas <b>js/config.js</b> lalu isi <b>GAS_URL</b> dengan alamat Web App (/exec), kemudian unggah ulang ke GitHub. Lihat PANDUAN-INSTALASI.md.</p></div></main>`); return; }
  if (location.hash === '#darurat') return renderLogin();
  if (Sesi.get()) mulai(); else renderLogin();
  if (navigator.onLine === false) { const o = $('#offline'); if (o) o.classList.remove('hide'); }
});