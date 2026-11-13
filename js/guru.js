/* guru.js — halaman guru/admin: Beranda, Kelola Tugas, Submission, Penilaian, Rekap & Ekspor */
'use strict';
const G = ['guru', 'admin'];
const FRASA = ['Refleksimu jujur dan runtut. Pertahankan!', 'Bagus! Coba tambahkan contoh nyata pada bagian pembelajaran.', 'Ceritamu menyentuh. Terus tumbuhkan kebiasaan baik ini.', 'Sudah baik, lengkapi lagi bukti kegiatannya ya.'];
const kpi = (ikon, warna, nilai, label, act) => h`<button class="kpi" ${act ? raw('data-act="' + act + '"') : ''}><span class="ib ${warna}">${ic(ikon)}</span><span><b>${nilai}</b><span>${label}</span></span></button>`;
const barChart = (rows, kunci, label) => rows.length ? h`<div class="bars" role="img" aria-label="Grafik ${label}">${rows.map((r) => h`<div><b>${r[kunci]}</b><i style="height:${Math.max(3, Math.round((r[kunci] - 60) / 40 * 100))}%"></i><small>${r.kelas}</small></div>`)}</div>` : h`<div class="empty">Belum ada data nilai.</div>`;

// =============== BERANDA GURU ===============
PAGES.guru = {
  roles: G, judul: 'Beranda Guru', render: async (el, a, live) => {
    await apiSWR('guru.beranda', {}, (d) => {
      if (!live()) return; const k = d.kpi;
      el.innerHTML = R(h`${ph('Selamat datang, ' + String(aku().nama).split(' ')[0] + '!', 'Ringkasan pengumpulan dan penilaian terbaru.', h`<a class="btn" href="#/submission">${ic('table')} Periksa Submission</a>`)}
        <div class="grid g4 mb16">${kpi('table', 'blue', k.submission, 'Total pengumpulan')}${kpi('clock', 'orange', k.belumDinilai, 'Belum dinilai', 'ke-belum')}${kpi('chart', 'green', k.rata || '-', 'Rata-rata nilai')}${kpi('star', 'star', k.bintang, 'Bintang diberikan')}</div>
        <div class="grid g2"><section class="card"><h3>Rata-rata nilai per kelas</h3>${barChart(d.perKelas.map((x) => Object.assign({ v: x.rata }, x, { rata: x.rata })), 'rata', 'rata-rata nilai per kelas')}</section>
        <section class="card"><div class="row between mb16"><h3>Pengumpulan terbaru</h3><a href="#/submission" class="sm bold">Lihat semua ›</a></div>${d.terbaru.length ? d.terbaru.map((r) => h`<a class="row" style="padding:8px 0;border-top:1px solid var(--border);color:inherit" href="#/penilaian/${r.id}">${avatar(r.siswa, r.foto, 'sm')}<div class="grow"><b class="sm">${r.siswa}</b> <span class="muted sm">· ${r.kelas}</span><div class="sm muted">${r.tugas}</div></div>${statusPill(r.status)}</a>`) : h`<div class="empty">Belum ada pengumpulan.</div>`}</section></div>`);
    }, 12000);
  }
};
ACT['ke-belum'] = () => { window._filterSub = 'Dikirim'; nav('submission'); };

// =============== KELOLA TUGAS ===============
PAGES.tugas = {
  roles: G, judul: 'Kelola Tugas', render: async (el, a, live) => {
    const d = await api('tugas.list', {}); if (!live()) return; window._tg = d;
    el.innerHTML = R(h`${ph('Kelola Tugas', 'Buat, ubah, dan nonaktifkan tugas untuk siswa.', h`<button class="btn" data-act="tugasbaru">${ic('plus')} Tugas Baru</button>`)}
      ${d.rows.length ? h`<div class="table-wrap"><table><thead><tr><th>Judul</th><th>Jenis</th><th>Kelas</th><th>Tenggat</th><th>Status</th><th>Terkumpul</th><th></th></tr></thead><tbody>${d.rows.map((t) => h`<tr><td><b>${t.judul}</b></td><td>${pill(t.jenis, 'purple')}</td><td>${t.kelas}</td><td>${fmtTgl(t.tenggat)}</td><td>${statusPill(t.status)}</td><td>${t.kumpul} (${t.dinilai} dinilai)</td><td><button class="btn sec sm" data-act="tugasedit" data-id="${t.tugasId}">Ubah</button></td></tr>`)}</tbody></table></div>` : h`<div class="card">${empty('Belum ada tugas', 'Buat tugas pertama untuk kelasmu.', h`<button class="btn" data-act="tugasbaru">${ic('plus')} Tugas Baru</button>`)}</div>`}`);
  }
};
function tugasForm(t) {
  const c = (t && t.contoh) || {};
  t = t || { jenis: '4F', kelas: aku().peran === 'admin' ? 'Semua' : (aku().kelas || '').split(/[;,]/)[0] || '', status: 'Aktif' };
  modal(t.tugasId ? 'Ubah Tugas' : 'Tugas Baru', h`<form id="f-tugas"><input type="hidden" id="tg-id" value="${t.tugasId || ''}">
    <div class="field"><label for="tg-j">Judul tugas</label><input class="input" id="tg-j" maxlength="150" required value="${t.judul || ''}"></div>
    <div class="grid g2"><div class="field"><label for="tg-t">Jenis</label><select class="select" id="tg-t" data-ch="tgjenis">${['4F', 'Jurnal Pancasila', 'Kebiasaan'].map((x) => h`<option ${x === t.jenis ? 'selected' : ''}>${x}</option>`)}</select></div>
      <div class="field"><label for="tg-k">Kelas</label><input class="input" id="tg-k" list="dl-kelas" value="${t.kelas}"><datalist id="dl-kelas">${(window._tg ? window._tg.kelasList : []).concat(aku().peran === 'admin' ? ['Semua'] : []).map((x) => h`<option value="${x}">`)}</datalist><span class="hint">Pisahkan dengan koma bila lebih dari satu kelas.</span></div></div>
    <div class="grid g2"><div class="field"><label for="tg-m">Mulai</label><input class="input" id="tg-m" type="date" value="${t.mulai || ''}"></div><div class="field"><label for="tg-e">Tenggat</label><input class="input" id="tg-e" type="date" value="${t.tenggat || ''}"></div></div>
    <div class="field"><label for="tg-d">Petunjuk pengerjaan untuk siswa</label><textarea class="textarea" id="tg-d" rows="3" maxlength="1500" placeholder="mis. Ceritakan pengalamanmu selama mengikuti kegiatan Dharma Yatra.">${t.deskripsi || ''}</textarea><span class="hint">Tampil di langkah pertama (Judul Cerita) dan di bagian atas formulir siswa.</span></div>
    <div class="field"><label for="tg-p">Catatan tambahan guru (opsional)</label><textarea class="textarea" id="tg-p" rows="2" maxlength="1500">${t.templat || ''}</textarea></div>
    <details class="contoh ${t.jenis === '4F' ? '' : 'hide'}" id="tg-contoh" ${c.judul || c.fakta || c.feeling || c.finding || c.future ? 'open' : ''}><summary>${ic('bulb')} Contoh jawaban untuk siswa (4F)</summary><p class="sm muted mt8">Contoh ini muncul di tombol “Lihat contoh” pada tiap langkah. Kosongkan semuanya bila ingin memakai contoh bawaan aplikasi.</p>
      <div class="row wrap mt8"><button type="button" class="btn sec sm" data-act="tgpaket" data-p="dharmayatra">Isi contoh Dharma Yatra</button><button type="button" class="btn ghost sm" data-act="tgpaket" data-p="">Kosongkan</button></div>
      ${[['judul', 'Contoh judul cerita', 1], ['fakta', 'Contoh Fakta', 3], ['feeling', 'Contoh Perasaan (Feeling)', 3], ['finding', 'Contoh Pembelajaran (Finding)', 3], ['future', 'Contoh Penerapan (Future)', 3]].map((x) => h`<div class="field mt8"><label for="tg-c-${x[0]}">${x[1]}</label><textarea class="textarea" id="tg-c-${x[0]}" rows="${x[2]}" maxlength="${x[0] === 'judul' ? 150 : 900}" style="min-height:${x[2] === 1 ? 44 : 70}px">${c[x[0]] || ''}</textarea></div>`)}</details>
    <div class="field"><label for="tg-s">Status</label><select class="select" id="tg-s"><option ${t.status === 'Aktif' ? 'selected' : ''}>Aktif</option><option ${t.status === 'Nonaktif' ? 'selected' : ''}>Nonaktif</option></select></div>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="tutup">Batal</button><button class="btn" type="submit">${ic('save')} Simpan</button></div></form>`, { lebar: false });
  $('#f-tugas').onsubmit = async (e) => { e.preventDefault(); const b = tombolKirim(e); b.disabled = true; try { await api('tugas.simpan', { tugasId: $('#tg-id').value || undefined, judul: $('#tg-j').value, jenis: $('#tg-t').value, kelas: $('#tg-k').value, mulai: $('#tg-m').value, tenggat: $('#tg-e').value, deskripsi: $('#tg-d').value, templat: $('#tg-p').value, status: $('#tg-s').value, contoh: $('#tg-t').value === '4F' ? { judul: $('#tg-c-judul').value, fakta: $('#tg-c-fakta').value, feeling: $('#tg-c-feeling').value, finding: $('#tg-c-finding').value, future: $('#tg-c-future').value } : undefined }); tutupModal(); toast('Tugas tersimpan.', 'success'); renderRoute(); } catch (er) { gagal(er); b.disabled = false; } };
}
INP.tgjenis = (t) => { const d = $('#tg-contoh'); if (d) d.classList.toggle('hide', t.value !== '4F'); };
ACT.tgpaket = (b) => { const p = PAKET_CONTOH[b.dataset.p] || {}; ['judul', 'fakta', 'feeling', 'finding', 'future'].forEach((k) => { $('#tg-c-' + k).value = p[k] || ''; }); if (b.dataset.p) toast('Contoh Dharma Yatra diisi. Silakan sesuaikan dengan kegiatan sebenarnya, lalu Simpan.', 'success'); };
ACT.tugasbaru = () => tugasForm();
ACT.tugasedit = (b) => tugasForm(window._tg.rows.find((x) => x.tugasId === b.dataset.id));

// =============== SUBMISSION ===============
PAGES.submission = {
  roles: G, judul: 'Daftar Submission', render: async (el, a, live) => {
    const f = window._sb = Object.assign({ kelas: '', tugasId: '', status: '', cari: '', halaman: 1 }, window._sb || {});
    if (window._filterSub) { f.status = window._filterSub; f.halaman = 1; window._filterSub = null; }
    if (window._cariSub) { f.cari = window._cariSub; f.halaman = 1; window._cariSub = null; }
    const [tl] = await Promise.all([window._tgList ? Promise.resolve(window._tgList) : api('tugas.list', {})]); window._tgList = tl; if (!live()) return;
    window._sbEl = el; await sbGambar(live);
  }
};
async function sbGambar(live) {
  const el = window._sbEl, f = window._sb, d = await api('submission.list', { kelas: f.kelas, tugasId: f.tugasId, status: f.status, cari: f.cari, halaman: f.halaman, per: 25 }); if (live && !live()) return;
  const tl = window._tgList;
  el.innerHTML = R(h`${ph('Daftar Submission', 'Periksa pengumpulan siswa, lalu beri nilai dan umpan balik.')}
    <div class="toolbar"><select class="select" data-ch="sbf" data-k="kelas" aria-label="Kelas"><option value="">Semua kelas</option>${tl.kelasList.map((k) => h`<option ${k === f.kelas ? 'selected' : ''}>${k}</option>`)}</select>
      <select class="select" data-ch="sbf" data-k="tugasId" aria-label="Tugas"><option value="">Semua tugas</option>${tl.rows.map((t) => h`<option value="${t.tugasId}" ${t.tugasId === f.tugasId ? 'selected' : ''}>${t.judul}</option>`)}</select>
      <input class="input" type="search" placeholder="Cari nama siswa…" value="${f.cari}" data-in="sbcari" aria-label="Cari nama siswa">
      <div class="chips">${[['', 'Semua'], ['Dikirim', 'Belum dinilai'], ['Dinilai', 'Sudah dinilai']].map((s) => h`<button class="${f.status === s[0] ? 'on' : ''}" data-act="sbstatus" data-s="${s[0]}">${s[1]}</button>`)}</div></div>
    ${d.rows.length ? h`<div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Kelas</th><th>Tugas</th><th>Bukti</th><th>Dikirim</th><th>Status</th><th>Nilai</th><th></th></tr></thead><tbody>${d.rows.map((r) => h`<tr class="clk" data-act="buka" data-id="${r.id}"><td><div class="row gap8">${avatar(r.siswa, r.foto, 'sm')}<b>${r.siswa}</b></div></td><td>${r.kelas}</td><td>${r.tugas}<div class="sm muted">${r.jenis}${r.judulCerita ? ' · “' + r.judulCerita + '”' : ''}</div></td><td>${r.buktiN}</td><td>${fmtWaktu(r.waktu)}</td><td>${statusPill(r.status)}</td><td>${r.nilai !== null ? h`<b>${r.nilai}</b> ${stars(r.bintang)}` : '-'}</td><td><button class="btn sec sm" data-act="buka" data-id="${r.id}">${r.nilai !== null ? 'Lihat' : 'Nilai'}</button></td></tr>`)}</tbody></table></div>${pager(d.total, d.per, d.halaman, 'sbhal')}<p class="sm muted center mt8">${d.total} pengumpulan</p>` : h`<div class="card">${empty('Tidak ada pengumpulan', 'Belum ada yang cocok dengan filter ini.')}</div>`}`);
}
const sbCari = debounce(async (v) => { window._sb.cari = v; window._sb.halaman = 1; const y = $('[data-in=sbcari]'); await sbGambar(); const n = $('[data-in=sbcari]'); if (n) { n.focus(); n.setSelectionRange(v.length, v.length); } }, 400);
INP.sbcari = (t) => sbCari(t.value);
INP.sbf = (t) => { window._sb[t.dataset.k] = t.value; window._sb.halaman = 1; sbGambar().catch(gagal); };
ACT.sbstatus = (b) => { window._sb.status = b.dataset.s; window._sb.halaman = 1; sbGambar().catch(gagal); };
ACT.sbhal = (b) => { window._sb.halaman = Number(b.dataset.p); sbGambar().catch(gagal); };
ACT.buka = (b, e) => { nav('penilaian/' + b.dataset.id); };

// =============== PENILAIAN ===============
PAGES.penilaian = {
  roles: G, judul: 'Penilaian', aktif: 'submission', render: async (el, args, live) => {
    const d = await api('submission.detail', { id: args[0] }); if (!live()) return;
    const P = window._pn = { el: el, d: d, nilai: d.nilai ? d.nilai.nilai : '', bintang: d.nilai ? d.nilai.bintang : 0, manual: !!d.nilai, umpan: d.nilai ? d.nilai.umpanBalik : '' }; pnGambar();
  }
};
const bintangDari = (n) => (n >= 90 ? 5 : n >= 85 ? 4 : n >= 80 ? 3 : n >= 75 ? 2 : 0);
function pnIsi(d) {
  if (d.jenis === '4F' && d.isi) return h`${d.isi.judul ? h`<div class="mb16"><span class="pill star">Judul cerita</span><h3 class="mt8">${d.isi.judul}</h3></div>` : ''}${F4.map((f) => h`<div class="mb16"><span class="pill purple">${f.label}</span>${f.emosi && d.isi.emosi && d.isi.emosi.length ? h`<div class="chips mt8">${d.isi.emosi.map((e) => pill(e))}</div>` : ''}<div class="quote mt8">${d.isi[f.k] || '(kosong)'}</div></div>`)}`;
  if (d.jenis === 'Jurnal Pancasila') return d.jurnal && d.jurnal.length ? h`${d.jurnal.map((j) => h`<div class="mb16"><span class="pill purple">${fmtTgl(j.tanggal)} · Sila ${j.sila}</span><div class="quote mt8">${j.catatan}</div></div>`)}` : h`<p class="muted">Tidak ada catatan jurnal pada periode tugas ini.</p>`;
  if (d.jenis === 'Kebiasaan') return d.kebiasaan && d.kebiasaan.length ? h`<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Kebiasaan tercatat</th><th>Catatan</th></tr></thead><tbody>${d.kebiasaan.map((k) => h`<tr><td>${fmtTgl(k.tanggal)}</td><td>${k.jumlah}/7</td><td>${k.catatan || '-'}</td></tr>`)}</tbody></table></div>` : h`<p class="muted">Tidak ada catatan kebiasaan pada periode tugas ini.</p>`;
  return h`<p class="muted">Pengumpulan berupa bukti terlampir.</p>`;
}
function pnGambar() {
  const P = window._pn, d = P.d, dinilai = !!d.nilai;
  P.el.innerHTML = R(h`<a href="#/submission" class="btn ghost sm">${ic('arrowl')} Daftar submission</a>
    ${ph(d.tugas.judul, d.siswa.nama + ' · Kelas ' + d.siswa.kelas + ' · dikirim ' + fmtWaktu(d.waktu), statusPill(d.status))}
    <div class="grid" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:start" id="pn-grid">
      <div class="grid"><section class="card"><h3 class="mb16">Isi pengumpulan</h3>${pnIsi(d)}</section>
        <section class="card"><h3 class="mb16">Bukti terlampir (${d.bukti.length})</h3>${d.bukti.length ? d.bukti.map((b) => h`<div class="file mb16"><span class="ib ${b.tipe === 'link' ? 'purple' : b.tipe === 'pdf' ? 'orange' : 'pink'}">${ic(b.tipe === 'link' ? 'link' : b.tipe === 'pdf' ? 'file' : 'image')}</span><div class="grow"><b>${b.nama}</b><div class="sm muted">${b.tipe === 'link' ? String(b.url).slice(0, 70) : ukuran(b.ukuran)}</div></div>${b.tipe === 'link' ? (/^https:\/\//.test(b.url) ? h`<a class="btn sec sm" href="${b.url}" target="_blank" rel="noopener noreferrer">${ic('link')} Buka</a>` : '') : h`<button class="btn sec sm" data-act="lihatbukti" data-id="${b.buktiId}">${ic('eye')} Lihat</button>`}</div>`) : h`<p class="muted">Tidak ada bukti terlampir.</p>`}</section></div>
      <section class="card acc-orange" style="position:sticky;top:80px"><h3>${dinilai ? 'Ubah penilaian' : 'Penilaian guru'}</h3>
        <div class="field mt8"><label for="pn-n">Nilai (75–100)</label><input class="input" id="pn-n" type="number" min="75" max="100" step="1" inputmode="numeric" value="${P.nilai}" data-in="pnnilai"><span class="hint" id="pn-h"></span></div>
        <div class="field"><label>Bintang (otomatis dari nilai, bisa diubah)</label><div class="starsel row" id="pn-s">${[1, 2, 3, 4, 5].map((i) => h`<button type="button" class="${i <= P.bintang ? 'on' : ''}" data-act="pnbintang" data-n="${i}" aria-label="${i} bintang">${ic('star')}</button>`)}</div></div>
        <div class="field"><label for="pn-u">Umpan balik untuk siswa</label><textarea class="textarea" id="pn-u" rows="5" maxlength="1000" data-in="pnumpan" placeholder="Tulis masukan yang membangun…">${P.umpan}</textarea><div class="chips mt8">${FRASA.map((f, i) => h`<button type="button" data-act="pnfrasa" data-i="${i}">${f.slice(0, 28)}…</button>`)}</div></div>
        <div class="row wrap"><button class="btn" data-act="pnsimpan" data-lanjut="1">${ic('save')} Simpan & Lanjut</button><button class="btn sec" data-act="pnsimpan">Simpan</button></div></section></div>`);
  if (window.innerWidth < 900) $('#pn-grid').style.gridTemplateColumns = '1fr';
}
INP.pnnilai = (t) => { const P = window._pn, v = Number(t.value); P.nilai = t.value; if (!P.manual) { P.bintang = bintangDari(v); $$('#pn-s button').forEach((b, i) => b.classList.toggle('on', i < P.bintang)); } $('#pn-h').textContent = t.value === '' ? '' : (v >= 75 && v <= 100 && Math.floor(v) === v ? '' : 'Nilai harus bilangan bulat 75–100'); };
INP.pnumpan = (t) => { window._pn.umpan = t.value; };
ACT.pnbintang = (b) => { const P = window._pn; P.bintang = Number(b.dataset.n); P.manual = true; $$('#pn-s button').forEach((x, i) => x.classList.toggle('on', i < P.bintang)); };
ACT.pnfrasa = (b) => { const P = window._pn, f = FRASA[Number(b.dataset.i)]; P.umpan = (P.umpan ? P.umpan.replace(/\s*$/, ' ') : '') + f; $('#pn-u').value = P.umpan; };
ACT.pnsimpan = async (b) => {
  const P = window._pn, n = Number(P.nilai);
  if (!(n >= 75 && n <= 100) || Math.floor(n) !== n) return toast('Nilai harus bilangan bulat antara 75 dan 100.', 'warn');
  if (!String(P.umpan).trim()) return toast('Tulis umpan balik singkat untuk siswa.', 'warn');
  b.disabled = true;
  try {
    await api('nilai.simpan', { submissionId: P.d.id, nilai: n, bintang: P.manual ? P.bintang : undefined, umpanBalik: P.umpan }); toast('Nilai dan umpan balik tersimpan.', 'success');
    if (b.dataset.lanjut) { const l = await api('submission.list', { status: 'Dikirim', per: 100 }); const nx = l.rows.find((r) => r.id !== P.d.id); if (nx) return nav('penilaian/' + nx.id); toast('Semua pengumpulan sudah dinilai. 🎉', 'success'); return nav('submission'); }
    renderRoute();
  } catch (e) { gagal(e); b.disabled = false; }
};
ACT.lihatbukti = async (b) => {
  b.disabled = true;
  try {
    const d = await api('bukti.ambil', { buktiId: b.dataset.id }), bin = atob(d.base64), arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([arr], { type: d.mime }));
    if (/^image\//.test(d.mime)) modal(d.nama, h`<img src="${url}" alt="Bukti ${d.nama}" style="max-width:100%;border-radius:12px">`, { lebar: true });
    else window.open(url, '_blank', 'noopener');
  } catch (e) { gagal(e); } b.disabled = false;
};

// =============== REKAP & EKSPOR ===============
PAGES.rekap = {
  roles: G, judul: 'Rekap & Ekspor', render: async (el, a, live) => {
    const f = window._rk = Object.assign({ kelas: '', tugasId: '' }, window._rk || {}), d = await api('rekap.data', { kelas: f.kelas, tugasId: f.tugasId }); if (!live()) return; window._rkd = d;
    const tot = Object.values(d.sebaran).reduce((x, y) => x + y, 0), warna = ['#94A3B8', '#FB923C', '#FACC15', '#4ADE80', '#2F7BF5']; let acc = 0;
    const seg = tot ? [1, 2, 3, 4, 5].map((i) => { const a0 = acc / tot * 100; acc += d.sebaran[i] || 0; return warna[i - 1] + ' ' + a0.toFixed(1) + '% ' + (acc / tot * 100).toFixed(1) + '%'; }).join(',') : '#E2E8F0 0 100%';
    el.innerHTML = R(h`${ph('Rekap & Ekspor', 'Grafik dan tabel nilai, siap diunduh.', h`<button class="btn sec" data-act="rkxlsx">${ic('download')} Unduh Excel</button><button class="btn" data-act="rkpdf">${ic('file')} Unduh PDF</button>`)}
      <div class="toolbar"><select class="select" data-ch="rkf" data-k="kelas" aria-label="Kelas"><option value="">Semua kelas</option>${d.kelasList.map((k) => h`<option ${k === f.kelas ? 'selected' : ''}>${k}</option>`)}</select><select class="select" data-ch="rkf" data-k="tugasId" aria-label="Tugas"><option value="">Semua tugas</option>${d.tugasList.map((t) => h`<option value="${t.id}" ${t.id === f.tugasId ? 'selected' : ''}>${t.judul}</option>`)}</select></div>
      <div class="grid g2 mb16"><section class="card"><h3>Rata-rata nilai per kelas</h3>${barChart(d.perKelas, 'rata', 'rata-rata nilai per kelas')}</section>
        <section class="card"><h3>Sebaran bintang</h3><div class="row wrap mt8"><div style="width:150px;height:150px;border-radius:50%;background:conic-gradient(${seg});display:grid;place-items:center" role="img" aria-label="Diagram sebaran bintang"><div style="width:90px;height:90px;border-radius:50%;background:#fff;display:grid;place-items:center"><b class="head" style="font-size:22px">${tot}</b></div></div><div class="grow">${[5, 4, 3, 2, 1].map((i) => h`<div class="row gap8 sm"><i style="width:12px;height:12px;border-radius:3px;background:${warna[i - 1]}"></i>${i} bintang <b>${d.sebaran[i] || 0}</b></div>`)}</div></div></section></div>
      <h2 class="title-dot">Data Nilai (${d.rows.length})</h2>
      ${d.rows.length ? h`<div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Kelas</th><th>Tugas</th><th>Status</th><th>Nilai</th><th>Bintang</th><th>Dikirim</th></tr></thead><tbody>${d.rows.slice(0, 200).map((r) => h`<tr><td>${r.siswa}</td><td>${r.kelas}</td><td>${r.tugas}</td><td>${statusPill(r.status)}</td><td>${r.nilai !== null ? r.nilai : '-'}</td><td>${r.bintang !== null ? r.bintang : '-'}</td><td>${fmtWaktu(r.waktu)}</td></tr>`)}</tbody></table></div>${d.rows.length > 200 ? h`<p class="sm muted center mt8">Tabel menampilkan 200 baris pertama; unduhan memuat semua.</p>` : ''}` : h`<div class="card">${empty('Belum ada data', 'Belum ada pengumpulan untuk filter ini.')}</div>`}`);
  }
};
INP.rkf = (t) => { window._rk[t.dataset.k] = t.value; renderRoute(); };
const rkBaris = () => window._rkd.rows.map((r) => ({ Siswa: r.siswa, Kelas: r.kelas, Tugas: r.tugas, Jenis: r.jenis, Status: r.status, Nilai: r.nilai === null ? '' : r.nilai, Bintang: r.bintang === null ? '' : r.bintang, Dikirim: r.waktu ? String(r.waktu).slice(0, 16).replace('T', ' ') : '' }));
ACT.rkxlsx = () => unduhExcel(rkBaris(), 'rekap-edudharma-' + hariIni());
ACT.rkpdf = () => cetakPDF('Rekap Nilai ' + setting('NAMA_SEKOLAH', 'EduDharma'), rkBaris());