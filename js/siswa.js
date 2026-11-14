/* siswa.js — halaman siswa: Beranda, Laporan 4F, Jurnal Pancasila, 7 Kebiasaan, Kumpulkan Bukti, Nilai */
'use strict';
const SILA_GAYA = [['star', 'star'], ['link', 'pink'], ['shield', 'green'], ['users', 'orange'], ['sparkle', 'purple']];
const SILA_PANDUAN = [
  ['Tindakan ibadah, syukur, doa, atau menghormati teman yang sedang beribadah sesuai agamanya masing-masing.', 'Berdoa sebelum makan dan membantu teman merapikan sajadah sebelum salat.'],
  ['Tindakan peduli, tolong-menolong, menghibur sesama, serta bersikap sopan kepada guru dan orang tua.', 'Membantu meminjamkan alat tulis kepada teman yang pensilnya patah.'],
  ['Bagaimana caramu menjaga kerukunan, bekerja sama, dan menghargai perbedaan latar belakang teman hari ini?', 'Bekerja sama dalam kelompok tanpa membeda-bedakan suku dan agama anggota kelompok.'],
  ['Bagaimana kamu bermusyawarah, mendengarkan pendapat orang lain, atau menerima keputusan bersama dengan lapang dada hari ini?', 'Mengikuti pemilihan ketua regu dan menerima hasil voting dengan gembira.'],
  ['Tindakan hidup hemat, menghargai karya teman, atau bersikap adil saat giliran piket kelas.', 'Menghabiskan makanan tanpa sisa dan mematikan lampu kelas saat keluar.']
];
const F4 = [
  { k: 'fakta', label: 'Fakta (Facts)', judul: 'Apa yang terjadi selama kegiatan?', tanya: 'Ceritakan kejadiannya apa adanya: kapan, di mana, siapa saja yang terlibat, dan apa yang kamu lakukan.' },
  { k: 'feeling', label: 'Perasaan (Feeling)', judul: 'Apa yang kamu rasakan selama kegiatan berlangsung?', tanya: 'Ceritakan perasaan senang, bingung, bangga, ragu, atau tertantang yang kamu dan teman-temanmu alami.', emosi: true },
  { k: 'finding', label: 'Pembelajaran (Finding)', judul: 'Apa yang kamu pelajari dari kegiatan ini?', tanya: 'Apa pelajaran atau makna yang kamu temukan?' },
  { k: 'future', label: 'Penerapan (Future)', judul: 'Apa yang akan kamu lakukan setelah ini?', tanya: 'Apa rencana nyatamu ke depan setelah belajar dari pengalaman ini?' }
];
// Langkah 1 = Judul Cerita, langkah 2–5 = empat bagian 4F
const F4L = [{ k: 'judul', label: 'Judul Cerita', judul: 'Beri judul ceritamu', tanya: 'Tulis judul singkat yang menggambarkan pengalamanmu.', min: 5, maks: 120 }].concat(F4);
// Contoh jawaban bawaan. Guru bisa menulis contoh sendiri per tugas (Kelola Tugas → Contoh jawaban).
const PAKET_CONTOH = {
  dharmayatra: {
    judul: 'Perjalanan Suci yang Mengajarkanku Rasa Syukur',
    fakta: 'Pada hari kegiatan Dharma Yatra, saya dan teman-teman sekelas berangkat bersama bapak dan ibu guru menuju pura yang menjadi tujuan kami. Di sana kami sembahyang bersama, mendengarkan penjelasan tentang sejarah dan makna tempat suci tersebut, lalu berkeliling dengan tertib sambil menjaga kebersihan. Sebelum pulang, kami makan bersama dan membereskan sampah kami sendiri.',
    feeling: 'Awalnya saya agak gugup karena baru pertama kali mengikuti perjalanan suci bersama banyak teman. Setelah sembahyang bersama, hati saya terasa tenang dan damai. Saya juga merasa senang dan bangga karena bisa mengenal tempat suci dan saling membantu dengan teman-teman.',
    finding: 'Saya belajar bahwa Dharma Yatra bukan sekadar berwisata, tetapi perjalanan untuk mendekatkan diri kepada Tuhan dan mengenal warisan leluhur. Saya juga belajar bersikap sopan, tertib, dan menjaga kebersihan di tempat suci, serta bersyukur atas kesempatan belajar ini.',
    future: 'Setelah kegiatan ini, saya akan lebih rajin sembahyang di rumah dan menjaga sikap sopan di tempat ibadah. Saya juga akan mengajak teman-teman membuang sampah pada tempatnya dan menceritakan pengalaman ini kepada keluarga.'
  },
  umum: {
    judul: 'Pengalaman yang Tidak Akan Kulupakan',
    fakta: 'Pada hari kegiatan, saya dan teman-teman sekelas mengikuti kegiatan ini bersama bapak dan ibu guru. Kami berkumpul, berangkat bersama, lalu melakukan kegiatan sesuai arahan guru. Di akhir kegiatan, kami merapikan tempat dan pulang dengan tertib.',
    feeling: 'Awalnya saya agak ragu dan sedikit gugup. Namun setelah bekerja sama dengan teman-teman, saya merasa senang dan bangga bisa mengikuti kegiatan ini sampai selesai.',
    finding: 'Saya belajar bahwa kegiatan yang dikerjakan bersama terasa lebih ringan dan menyenangkan. Saya juga belajar disiplin, saling membantu, dan menghargai orang lain.',
    future: 'Mulai minggu depan, saya akan lebih disiplin dan membantu teman yang membutuhkan. Saya juga akan menceritakan pengalaman ini kepada keluarga di rumah.'
  }
};
// Urutan: contoh tulisan guru untuk tugas ini → paket bawaan yang cocok dengan judul tugas → paket umum
function contohLangkah(S, k) {
  const c = (S.tugas.contoh || {})[k]; if (c) return c;
  return (/dharma\s*-?\s*yatra/i.test(S.tugas.judul + ' ' + (S.tugas.deskripsi || '')) ? PAKET_CONTOH.dharmayatra : PAKET_CONTOH.umum)[k];
}
const EMOSI = ['😊 Bangga & Puas', '⚡ Bersemangat', '🤔 Sempat Ragu', '🤝 Merasa Dihargai', '💪 Tertantang'];
const IKON_KEB = ['clock', 'sparkle', 'flame', 'gift', 'book', 'users', 'shield'];
const IKON_JENIS = { '4F': ['edit', 'blue'], 'Jurnal Pancasila': ['book', 'purple'], Kebiasaan: ['checkc', 'green'] };
const rutePerJenis = (t) => (t.jenis === '4F' ? 'laporan/' + t.tugasId : t.jenis === 'Jurnal Pancasila' ? 'jurnal' : 'kebiasaan');
const sapaan = () => { const j = new Date().getHours(); return j < 11 ? 'pagi' : j < 15 ? 'siang' : j < 18 ? 'sore' : 'malam'; };
const MIN_JURNAL = 20;

// =============== BERANDA ===============
function ringSvg(p, warna) { const c = 2 * Math.PI * 50; return raw('<svg width="118" height="118" viewBox="0 0 118 118" aria-hidden="true"><circle cx="59" cy="59" r="50" fill="none" stroke="#E2E8F0" stroke-width="11"/><circle cx="59" cy="59" r="50" fill="none" stroke="' + (warna || '#16A34A') + '" stroke-width="11" stroke-linecap="round" stroke-dasharray="' + (c * p / 100).toFixed(1) + ' ' + c.toFixed(1) + '"/></svg>'); }
function berandaHtml(d) {
  const nama = String(d.me.nama).split(' ')[0], t = d.target, pct = Math.round(t.selesai / t.total * 100), b = d.berjalan, maks = Math.max(1, ...d.sila.map((s) => s.jumlah));
  const [ik, wr] = b ? (IKON_JENIS[b.jenis] || ['edit', 'blue']) : ['edit', 'blue'];
  return h`<div class="home"><div>
    <section class="hero" aria-label="Sapaan"><div><span class="pillw">${ic('sparkle')} Kelas ${d.me.kelas || '-'} • ${setting('SEMESTER', '')}</span><h1>Selamat ${sapaan()}, <em>${nama}</em>! 👋</h1><p>Satu langkah kecil hari ini untuk membentuk karakter hebat dan budi pekerti luhurmu!</p>
      <button class="btn white" data-act="lanjut" data-h="${b ? rutePerJenis(b) : 'bukti'}">Lanjutkan Tugas ${ic('arrow')}</button></div>${MASKOT}</section>
    <div class="row between"><h2 class="title-dot">Tugas Berjalan</h2><a href="#/bukti" class="sm bold">Lihat Semua ›</a></div>
    ${b ? h`<div class="card hover row wrap"><span class="ib ${wr}">${ic(ik)}</span><div class="grow"><div class="sm bold" style="color:#6D28D9;text-transform:uppercase;letter-spacing:.04em">${b.jenis}${b.tenggat ? ' • tenggat ' + fmtTgl(b.tenggat) : ''}</div><h3>${b.judul}</h3><div class="row mt8"><div class="bar grow" role="progressbar" aria-valuenow="${b.progres}" aria-valuemin="0" aria-valuemax="100"><i style="width:${b.progres}%"></i></div><span class="sm muted">${b.progres}%</span></div></div><button class="btn" data-act="lanjut" data-h="${rutePerJenis(b)}">${ic('play')} ${b.progres ? 'Lanjut' : 'Mulai'}</button></div>`
      : h`<div class="card">${empty('Semua tugas sudah selesai! 🎉', 'Tunggu tugas baru dari gurumu, atau isi jurnal dan kebiasaan harianmu.')}</div>`}
    <h2 class="title-dot" style="margin-left:0">Pusat Belajar & Karakter</h2>
    <div class="grid g4">${[['laporan', 'edit', 'blue', 'Laporan 4F', d.jenis.f4 + ' Tugas Selesai'], ['jurnal', 'book', 'purple', 'Jurnal Sila', d.jenis.jurnal + ' Jurnal Terisi'], ['kebiasaan', 'checkc', 'green', '7 Kebiasaan', d.jenis.kebiasaan + ' Hari Berturut'], ['bukti', 'upload', 'pink', 'Kumpulkan Bukti', d.jenis.bukti + ' Berkas']].map((c) => h`<a class="card hover cat" href="#/${c[0]}"><div class="row between"><span class="ib ${c[2]}">${ic(c[1])}</span>${ic('arrow')}</div><b class="mt16" style="display:block">${c[3]}</b><span class="muted sm">${c[4]}</span></a>`)}</div>
    <div class="row between"><h2 class="title-dot">Capaian Profil Pancasila</h2><span class="sm muted">Total: ${d.totalJurnal} Pengamalan</span></div>
    <div class="grid g5">${d.sila.map((s, i) => h`<a class="card hover sila" href="#/jurnal"><span class="ib ${SILA_GAYA[i][1]}">${ic(SILA_GAYA[i][0])}</span><b class="sm">Sila ${s.no}: ${s.pendek}</b><span class="muted sm">${s.jumlah} Jurnal</span><div class="bar"><i style="width:${Math.round(s.jumlah / maks * 100)}%;background:var(--${SILA_GAYA[i][1] === 'star' ? 'star' : SILA_GAYA[i][1]})"></i></div></a>`)}</div>
  </div><aside class="grid" style="gap:20px" aria-label="Status harian">
    <section class="card"><div class="row between"><h3 class="row gap8">${ic('checkc')} Target Harian</h3>${pill(pct + '% Selesai', 'green')}</div>
      <div class="row mt16"><div class="ring">${ringSvg(pct)}<b>${t.selesai}/${t.total}<small>Kebiasaan</small></b></div><div class="grow"><b>Kerja Bagus, ${nama}!</b><p class="sm muted">${t.sisa.length ? h`Selesaikan ${t.sisa.length} kebiasaan lagi: <a href="#/kebiasaan" class="bold">${t.sisa.join(' & ')}</a>.` : 'Semua kebiasaan hari ini sudah tercatat. Hebat! 🎉'}</p></div></div>
      <div class="week" role="list">${t.hari.map((x) => h`<div role="listitem"><i class="${x.hariIni ? 'today' : x.tercapai ? 'ok' : ''}">${x.hariIni ? ic('calendar') : x.tercapai ? ic('check') : ''}</i>${HARI[tglObj(x.tgl).getDay()]}</div>`)}</div></section>
    ${d.papan.length ? h`<section class="card"><div class="row between mb16"><h3 class="row gap8">${ic('trophy')} Papan Bintang ${d.me.kelas}</h3><span class="sm muted">Total</span></div>${d.papan.map((p) => h`<div class="lb ${p.kamu ? 'me' : ''}"><span class="n">${p.rank}</span>${avatar(p.nama, p.foto, 'sm')}<div class="grow"><b class="sm">${p.nama}${p.kamu ? ' (Kamu)' : ''}</b></div><span class="st">${ic('star')}${p.total}</span></div>`)}</section>` : ''}
    <section class="card gift"><span class="ib orange">${ic('gift')}</span><div class="grow"><div class="sm bold" style="color:#6D28D9;text-transform:uppercase">Lencana Garuda Emas</div><p class="sm">Dapatkan nilai pada <b>${Math.max(0, d.lencana.target - d.lencana.progres)} tugas lagi</b> untuk membuka lencana spesial!</p><div class="row mt8"><div class="bar grow"><i style="width:${Math.round(d.lencana.progres / d.lencana.target * 100)}%;background:var(--purple)"></i></div><span class="sm muted">${d.lencana.progres}/${d.lencana.target}</span></div></div></section>
  </aside></div>`;
}
PAGES.beranda = { roles: ['siswa'], judul: 'Beranda', render: async (el, a, live) => { await apiSWR('siswa.beranda', {}, (d) => { if (!live()) return; setChips(d); el.innerHTML = R(berandaHtml(d)); }, 12000); } };
ACT.lanjut = (b) => nav(b.dataset.h);

// =============== LAPORAN 4F ===============
PAGES.laporan = {
  roles: ['siswa'], judul: 'Laporan 4F', render: async (el, args, live) => {
    if (args[0]) return laporanForm(el, args[0], live);
    const d = await api('siswa.tugas', {}); if (!live()) return;
    const l = d.tugas.filter((t) => t.jenis === '4F');
    el.innerHTML = R(h`${ph('Laporan Refleksi 4F', 'Beri judul ceritamu, lalu isi Fakta, Feeling, Finding, dan Future dengan jujur.')}${l.length ? h`<div class="grid g2">${l.map((t) => h`<a class="card hover acc-blue" href="#/laporan/${t.tugasId}"><div class="row between"><b class="head">${t.judul}</b>${statusPill(t.status)}</div><p class="sm muted mt8">${t.deskripsi || ''}</p><div class="row mt16"><div class="bar grow"><i style="width:${t.progres}%"></i></div><span class="sm muted">${t.progres}%</span></div><div class="sm muted mt8">Tenggat ${fmtTgl(t.tenggat)}${t.nilai !== null ? ' · Nilai ' + t.nilai : ''}</div></a>`)}</div>` : h`<div class="card">${empty('Belum ada tugas 4F', 'Gurumu belum menerbitkan tugas Laporan 4F untuk kelasmu.')}</div>`}`);
  }
};
async function laporanForm(el, id, live) {
  const d = await api('4f.get', { tugasId: id }); if (!live()) return;
  const isi0 = (d.submission && d.submission.isi) || {};
  const S = window._f4 = { el: el, tugas: d.tugas, id: d.submission && d.submission.id, status: d.submission ? d.submission.status : 'Belum', nilai: d.nilai, min: d.minKarakter, isi: Object.assign({ judul: '', fakta: '', feeling: '', finding: '', future: '', emosi: [], langkah: 1 }, isi0), simpan: null, kotor: false };
  const lama = !!d.submission && isi0.v !== 2 && isi0.langkah !== undefined;   // draf versi lama (4 langkah, tanpa judul): geser satu langkah
  S.langkah = S.status === 'Dinilai' ? 6 : Math.min(5, Math.max(1, (Number(S.isi.langkah) || 1) + (lama ? 1 : 0)));
  f4Gambar();
}
const minStep = (S, i) => F4L[i].min || S.min;
const f4Terisi = (S, i) => String(S.isi[F4L[i].k] || '').trim().length >= minStep(S, i);
function f4Gambar() {
  const S = window._f4, el = S.el;
  if (S.status === 'Dinilai') {
    el.innerHTML = R(h`<a href="#/laporan" class="btn ghost sm">${ic('arrowl')} Semua tugas 4F</a>${ph(S.tugas.judul, 'Laporan sudah dinilai guru.', statusPill('Dinilai'))}
      <div class="card acc-orange mb16"><div class="row wrap"><div class="grade">${S.nilai.nilai}</div><div>${stars(S.nilai.bintang)}<div class="sm muted">Nilai dari gurumu</div></div></div><div class="bubble mt16"><b>Umpan balik guru</b><p>${S.nilai.umpanBalik}</p></div></div>
      ${S.isi.judul ? h`<div class="card mb16"><span class="pill star">Judul ceritamu</span><h2 class="mt8">${S.isi.judul}</h2></div>` : ''}
      <div class="grid">${F4.map((f) => h`<div class="card"><span class="pill purple">${f.label}</span><div class="quote mt8">${S.isi[f.k]}</div></div>`)}</div>`);
    return;
  }
  const i = S.langkah - 1, f = F4L[i], isJudul = f.k === 'judul', nilai = String(S.isi[f.k] || ''), n = nilai.length, mn = minStep(S, i), selesai = F4L.filter((x, j) => f4Terisi(S, j)).length, sebelum = i >= 2 ? F4L[i - 1] : null;
  el.innerHTML = R(h`<a href="#/laporan" class="btn ghost sm">${ic('arrowl')} Semua tugas 4F</a>
    ${ph(S.tugas.judul, S.tugas.deskripsi, h`${S.status === 'Dikirim' ? pill('Terkirim — masih bisa direvisi sampai dinilai', 'orange') : ''}<span class="pill star">${ic('star')} Dinilai guru: 75–100 + bintang</span>`)}
    ${S.tugas.templat ? h`<div class="card flat mb16" style="background:var(--purple-soft);border:0">${ic('bulb')} <b>Petunjuk guru:</b> ${S.tugas.templat}</div>` : ''}
    <section class="card mb16"><div class="row between wrap"><h3 class="row gap8">${ic('chart')} Progres Pengisian Refleksi</h3>${pill('Langkah ' + S.langkah + ' dari 5 (' + selesai * 20 + '% selesai)')}</div>
      <div class="bar mt8"><i style="width:${selesai * 20}%"></i></div>
      <div class="steps mt16">${F4L.map((x, j) => h`<button class="step ${j === i ? 'cur' : f4Terisi(S, j) ? 'done' : ''}" data-act="f4step" data-i="${j + 1}" aria-current="${j === i ? 'step' : 'false'}"><span class="no">${f4Terisi(S, j) && j !== i ? ic('check') : j + 1}</span><span style="min-width:0"><small>${j === i ? 'Sedang diisi' : f4Terisi(S, j) ? 'Tersimpan' : 'Belum diisi'}</small><b>${x.label}</b></span></button>`)}</div></section>
    ${!isJudul && S.isi.judul ? h`<div class="card flat mb16 row wrap" style="background:var(--star-soft);border:0"><span class="pill star">Judul ceritamu</span><b class="grow">“${S.isi.judul}”</b><button class="btn sec sm" data-act="f4step" data-i="1">Ubah judul</button></div>` : ''}
    ${sebelum ? h`<section class="card mb16"><div class="row between wrap"><b class="row gap8">${ic('file')} Ringkasan ${sebelum.label}</b><button class="btn sec sm" data-act="f4mundur">Ubah Jawaban</button></div><div class="quote mt8">${String(S.isi[sebelum.k] || '(belum diisi)').slice(0, 420)}${String(S.isi[sebelum.k] || '').length > 420 ? '…' : ''}</div></section>` : ''}
    <section class="card"><span class="pill purple">LANGKAH ${S.langkah} DARI 5</span><h2 class="mt8">${f.judul}</h2><p class="muted">${f.tanya}</p>
      ${isJudul && S.tugas.deskripsi ? h`<div class="bubble mt8">${ic('bulb')} <b>Petunjuk dari gurumu:</b> ${S.tugas.deskripsi}</div>` : ''}
      <details class="contoh"><summary>${ic('bulb')} Lihat contoh ${isJudul ? 'judul' : 'pengisian ' + f.label}</summary><p class="mt8"><i>Contoh: “${contohLangkah(S, f.k)}”</i></p><p class="sm muted">Contoh hanya untuk ide. Tulis pengalamanmu sendiri dengan kata-katamu.</p></details>
      ${f.emosi ? h`<div class="field"><label>Pilih 1–3 emosi yang paling menggambarkan perasaanmu:</label><div class="emo chips" id="f4emo">${EMOSI.map((e) => h`<button type="button" class="${S.isi.emosi.indexOf(e) > -1 ? 'on' : ''}" data-act="f4emo" data-e="${e}" aria-pressed="${S.isi.emosi.indexOf(e) > -1}">${e}</button>`)}</div></div>` : ''}
      <div class="field"><div class="row between"><label for="f4t">${isJudul ? 'Judul ceritamu' : 'Uraian ' + f.label} <span style="color:var(--danger)">*</span></label><span class="sm muted">${isJudul ? 'Singkat dan bermakna' : 'Jujur saja, tidak ada jawaban benar/salah'}</span></div>
      ${isJudul ? h`<input class="input" id="f4t" data-in="f4txt" maxlength="${f.maks}" value="${nilai}" placeholder="mis. ${contohLangkah(S, 'judul')}">` : h`<textarea class="textarea" id="f4t" rows="7" data-in="f4txt" placeholder="Tulis ceritamu di sini…">${nilai}</textarea>`}
      <div class="row between"><span class="counter ${n >= mn ? 'ok' : 'no'}" id="f4c">${n >= mn ? '✓ Memenuhi syarat minimum' : 'Kurang ' + (mn - n) + ' karakter lagi'}</span><span class="sm muted"><b id="f4n">${n}</b> / ${mn} karakter minimum</span></div></div>
      <a class="btn sec sm" href="#/bukti/${S.tugas.tugasId}">${ic('image')} Lampirkan foto / tautan kegiatan</a></section>
    <div class="bottombar noprint"><span class="sm muted grow" id="f4s">${S.simpan ? '✓ Tersimpan ' + S.simpan : 'Tersimpan otomatis saat kamu mengetik'}</span>${S.langkah > 1 ? h`<button class="btn sec" data-act="f4mundur">${ic('arrowl')} Kembali</button>` : ''}<button class="btn sec" data-act="f4draf">${ic('save')} Simpan Draf</button>${S.langkah < 5 ? h`<button class="btn" data-act="f4lanjut">Lanjut ke ${F4L[S.langkah].label} ${ic('arrow')}</button>` : h`<button class="btn" data-act="f4kirim">${ic('check')} Kirim Laporan</button>`}</div>`);
}
const f4Auto = debounce(() => f4Simpan(false, true), 2500);
async function f4Simpan(kirim, senyap) {
  const S = window._f4; S.isi.langkah = S.langkah;
  try { await api('4f.simpan', { tugasId: S.tugas.tugasId, isi: S.isi, kirim: !!kirim }); S.kotor = false; const w = new Date(); S.simpan = String(w.getHours()).padStart(2, '0') + ':' + String(w.getMinutes()).padStart(2, '0'); const e = $('#f4s'); if (e) e.textContent = '✓ Tersimpan ' + S.simpan; if (kirim) S.status = 'Dikirim'; return true; }
  catch (e) { if (!senyap) gagal(e); else { const x = $('#f4s'); if (x) x.textContent = 'Belum tersimpan — ' + e.message; } return false; }
}
INP.f4txt = (t) => { const S = window._f4, f = F4L[S.langkah - 1], mn = minStep(S, S.langkah - 1); S.isi[f.k] = t.value; S.kotor = true; const n = t.value.length, c = $('#f4c'); $('#f4n').textContent = n; c.textContent = n >= mn ? '✓ Memenuhi syarat minimum' : 'Kurang ' + (mn - n) + ' karakter lagi'; c.className = 'counter ' + (n >= mn ? 'ok' : 'no'); f4Auto(); };
ACT.f4emo = (b) => { const S = window._f4, e = b.dataset.e, i = S.isi.emosi.indexOf(e); if (i > -1) S.isi.emosi.splice(i, 1); else if (S.isi.emosi.length < 3) S.isi.emosi.push(e); else return toast('Pilih maksimal 3 emosi.', 'warn'); b.classList.toggle('on'); b.setAttribute('aria-pressed', i < 0); S.kotor = true; f4Auto(); };
ACT.f4step = (b) => { const S = window._f4, i = Number(b.dataset.i); for (let k = 0; k < i - 1; k++) if (!f4Terisi(S, k)) return toast('Selesaikan langkah ' + (k + 1) + ' (' + F4L[k].label + ') dulu.', 'warn'); S.langkah = i; f4Gambar(); window.scrollTo(0, 0); };
ACT.f4mundur = () => { const S = window._f4; S.langkah = Math.max(1, S.langkah - 1); f4Gambar(); window.scrollTo(0, 0); };
ACT.f4lanjut = async () => { const S = window._f4, i = S.langkah - 1; if (!f4Terisi(S, i)) return toast(F4L[i].k === 'judul' ? 'Tulis judul ceritamu dulu (minimal ' + F4L[i].min + ' karakter).' : 'Tulis minimal ' + minStep(S, i) + ' karakter pada bagian ini dulu.', 'warn'); S.langkah++; await f4Simpan(false, true); f4Gambar(); window.scrollTo(0, 0); };
ACT.f4draf = async (b) => { b.disabled = true; if (await f4Simpan(false, false)) toast('Draf tersimpan.', 'success'); b.disabled = false; };
ACT.f4kirim = (b) => {
  const S = window._f4; const kurang = F4L.filter((x, i) => !f4Terisi(S, i)).map((x) => x.label);
  if (kurang.length) return toast('Lengkapi dulu: ' + kurang.join(', '), 'warn');
  konfirmasi('Kirim laporan ke guru?', 'Setelah dikirim, gurumu akan menilai laporan ini. Kamu masih bisa merevisi sampai guru memberi nilai.', 'Ya, kirim', async () => { if (await f4Simpan(true, false)) { toast('Laporan 4F terkirim! 🎉', 'success'); window.scrollTo(0, 0); f4Gambar(); } });
};

// =============== JURNAL PANCASILA ===============
PAGES.jurnal = { roles: ['siswa'], judul: 'Jurnal Pancasila', render: async (el, a, live) => { await jurnalMuat(el, (window._jt && window._jt.tanggal) || undefined, live); } };
async function jurnalMuat(el, tgl, live) {
  const d = await api('jurnal.get', tgl ? { tanggal: tgl } : {}); if (live && !live()) return;
  const J = window._jt = { el: el, tanggal: d.tanggal, hariIni: d.hariIni, minggu: d.minggu, per: d.bintangPerSila, entri: {}, draft: {} };
  d.entri.forEach((e) => { J.entri[e.sila] = e; J.draft[e.sila] = e.catatan; }); jurnalGambar();
}
function jurnalGambar() {
  const J = window._jt, m = meta().sila, terisi = Object.keys(J.entri).length, dapat = (t) => t <= J.hariIni && selisihHari(t) >= -7 && selisihHari(J.hariIni) - selisihHari(t) <= 7;
  const tg = tglObj(J.tanggal);
  J.el.innerHTML = R(h`<section class="card mb16"><div class="row wrap"><span class="ib purple">${ic('book')}</span><div class="grow"><div class="row wrap gap8">${pill('REFLEKSI HARIAN', 'purple')}${pill('+' + J.per + ' Bintang per jurnal terisi', 'star')}</div><h1 style="font-size:24px">Jurnal Harian Karakter Pancasila</h1><p class="muted">Catat tindakan nyata pengamalan nilai-nilai luhur Pancasila dalam keseharianmu di sekolah, rumah, dan lingkungan sekitar.</p></div></div>
    <div class="row wrap mt16"><b class="row gap8">${ic('calendar')} ${BULAN[tg.getMonth()]} ${tg.getFullYear()}</b><div class="week-strip grow" style="justify-content:flex-end">${J.minggu.map((x) => h`<button class="day ${x.tgl === J.tanggal ? 'on' : ''}" data-act="jhari" data-t="${x.tgl}" ${dapat(x.tgl) ? '' : 'disabled'} aria-label="${fmtTgl(x.tgl)}"><small>${HARI[tglObj(x.tgl).getDay()]}</small><b>${tglObj(x.tgl).getDate()}</b><span class="dot ${x.jumlah ? 'ok' : ''}"></span></button>`)}</div></div></section>
    <div class="grid g2">${m.map((s, i) => { const e = J.entri[s.no], v = J.draft[s.no] || ''; return h`<section class="card sila-card ${e ? 'done' : ''}"><div class="top2"><span class="ib ${SILA_GAYA[i][1]}">${ic(SILA_GAYA[i][0])}</span><div class="grow"><div class="row wrap gap8"><span class="sm bold" style="color:#C2410C">SILA KE-${s.no}</span>${e ? pill('✓ Sudah Terisi', 'green') : pill('Belum Diisi', 'gray')}</div><h3>${s.nama}</h3></div><span class="pill star">${ic('star')} +${J.per}</span></div>
      <div class="bubble mt8 sm">${ic('bulb')} <b>Panduan:</b> ${SILA_PANDUAN[i][0]}</div>
      <div class="field mt8"><label for="j${s.no}">Tuliskan aksi nyatamu</label><textarea class="textarea" id="j${s.no}" rows="4" data-in="jtxt" data-s="${s.no}" placeholder="Contoh: ${SILA_PANDUAN[i][1]}">${v}</textarea><div class="row between"><span class="sm muted">Min. ${MIN_JURNAL} karakter</span><span class="counter ${v.trim().length >= MIN_JURNAL ? 'ok' : 'no'}" id="jc${s.no}">${v.trim().length}</span></div></div>
      <div class="row wrap"><label class="btn sec sm ${e ? '' : 'hide'}" for="jf${s.no}" style="cursor:pointer">${ic('image')} Unggah Foto Aksi${e && e.foto ? ' (' + e.foto + ')' : ''}</label><input type="file" id="jf${s.no}" accept="image/*" class="hide" data-ch="jfoto" data-s="${s.no}"><span class="grow"></span><button class="btn sm" data-act="jsimpan" data-s="${s.no}">${ic('save')} Simpan Sila ${s.no}</button></div></section>`; })}
      <section class="card" style="background:var(--primary-soft);border:0"><div class="row"><span class="ib blue" style="background:#fff">${ic('bulb')}</span><div><b>Tips Karakter Hari Ini</b><p class="sm">“Kebaikan kecil yang dilakukan secara konsisten jauh lebih berharga daripada tindakan besar yang jarang dilakukan. Mulailah dari lingkungan terdekat!”</p></div></div></section></div>
    <div class="bottombar noprint"><span class="ib star">${ic('trophy')}</span><div class="grow"><b>Total Kemajuan Jurnal: ${terisi}/5 Sila Terisi</b><div class="sm muted">${terisi < 5 ? 'Lengkapi ' + (5 - terisi) + ' sila lagi untuk menyelesaikan jurnal hari ini.' : 'Jurnal hari ini lengkap. Hebat! 🌟'}</div></div><button class="btn" data-act="jsemua">${ic('check')} Simpan Semua Jurnal</button></div>`);
}
INP.jtxt = (t) => { const s = t.dataset.s, J = window._jt; J.draft[s] = t.value; const n = t.value.trim().length, c = $('#jc' + s); c.textContent = n; c.className = 'counter ' + (n >= MIN_JURNAL ? 'ok' : 'no'); };
ACT.jhari = (b) => { const J = window._jt; jurnalMuat(J.el, b.dataset.t, null).catch(gagal); };
async function jurnalSimpanSatu(s) {
  const J = window._jt, v = String(J.draft[s] || '').trim();
  if (v.length < MIN_JURNAL) throw new Error('Sila ' + s + ': tulis aksi nyatamu minimal ' + MIN_JURNAL + ' karakter.');
  if (J.entri[s] && J.entri[s].catatan === v) return null;
  const r = await api('jurnal.simpan', { sila: Number(s), tanggal: J.tanggal, catatan: v }); J.entri[s] = Object.assign({ foto: 0 }, J.entri[s], { sila: Number(s), catatan: v }); return r;
}
ACT.jsimpan = async (b) => { b.disabled = true; try { const r = await jurnalSimpanSatu(b.dataset.s); toast(r ? 'Jurnal Sila ke-' + b.dataset.s + ' berhasil disimpan!' + (r.bintang ? ' ⭐ +' + r.bintang + ' Bintang Karakter' : '') : 'Tidak ada perubahan.', 'success'); const bt = await api('siswa.beranda', {}).catch(() => null); if (bt) setChips(bt); const y = window.scrollY; jurnalGambar(); window.scrollTo(0, y); } catch (e) { gagal(e); b.disabled = false; } };
ACT.jsemua = async (b) => { b.disabled = true; let ok = 0; try { for (const s of [1, 2, 3, 4, 5]) { if (String(window._jt.draft[s] || '').trim().length >= MIN_JURNAL) { const r = await jurnalSimpanSatu(s); if (r) ok++; } } toast(ok ? ok + ' jurnal disimpan!' : 'Belum ada catatan baru untuk disimpan.', ok ? 'success' : 'warn'); jurnalGambar(); } catch (e) { gagal(e); } b.disabled = false; };
INP.jfoto = async (t) => {
  const s = t.dataset.s, J = window._jt, f = t.files[0]; if (!f) return;
  try { toast('Mengunggah foto…'); const b64 = await kompresGambar(f, 1600, 0.8); await api('bukti.upload', { jurnal: { tanggal: J.tanggal, sila: Number(s) }, nama: f.name.replace(/\.\w+$/, '') + '.jpg', mime: 'image/jpeg', base64: b64 }); J.entri[s].foto = (J.entri[s].foto || 0) + 1; toast('Foto aksi terunggah.', 'success'); jurnalGambar(); } catch (e) { gagal(e); }
};

// =============== 7 KEBIASAAN (jurnal cerita) ===============
// Setiap kebiasaan dicatat dengan cerita singkat; kebiasaan baru dihitung "dilakukan" bila ceritanya terisi (minimal karakter dari server).
const KEB_PANDUAN = [
  ['Ceritakan: jam berapa kamu bangun dan apa yang kamu lakukan setelah bangun?', 'Saya bangun jam 05.00, lalu merapikan tempat tidur dan membantu ibu menyiapkan sarapan.'],
  ['Ibadah apa yang kamu lakukan hari ini, bersama siapa, dan apa yang kamu rasakan?', 'Saya berdoa bersama keluarga sebelum berangkat sekolah dan beribadah sesuai agama saya.'],
  ['Olahraga apa yang kamu lakukan, berapa lama, dan di mana?', 'Saya bersepeda bersama kakak selama 30 menit di sekitar rumah.'],
  ['Apa yang kamu makan hari ini? Sebutkan sayur, buah, atau lauk yang bergizi.', 'Saya sarapan nasi, telur, dan sayur bayam, lalu makan buah pisang saat istirahat.'],
  ['Apa yang kamu pelajari atau baca hari ini di luar jam pelajaran?', 'Saya membaca buku cerita selama 20 menit dan mengulang pelajaran IPA.'],
  ['Apa kegiatan baikmu bersama keluarga, teman, atau tetangga hari ini?', 'Saya membantu tetangga menyapu halaman dan ikut kerja bakti di lingkungan.'],
  ['Jam berapa kamu tidur dan apa yang kamu lakukan sebelum tidur?', 'Saya tidur jam 20.30 setelah menyikat gigi dan berdoa.']
];
PAGES.kebiasaan = { roles: ['siswa'], judul: '7 Kebiasaan', render: async (el, a, live) => { await kebMuat(el, undefined, live); } };
async function kebMuat(el, tgl, live) {
  const d = await api('kebiasaan.get', tgl ? { tanggal: tgl } : {}); if (live && !live()) return;
  window._kb = Object.assign({ el: el, draft: d.cerita.slice(), legacy: d.nilai.map((v, i) => v === 1 && !d.cerita[i]), kotor: false }, d); setChips({ hariApi: d.hariApi }); kebGambar();
}
const kebAda = (K, i) => K.draft[i].trim().length >= K.min || (K.legacy[i] && !K.draft[i].trim());   // dihitung dilakukan
const kebJumlah = (K) => K.draft.reduce((a, x, i) => a + (kebAda(K, i) ? 1 : 0), 0);
const kebPendek = (K) => K.draft.map((x, i) => (x.trim().length > 0 && x.trim().length < K.min ? i + 1 : 0)).filter(Boolean);
function kebStatus(K, i) { return K.draft[i].trim().length >= K.min ? pill('✓ Sudah dicatat', 'green') : K.legacy[i] && !K.draft[i].trim() ? pill('Tercatat (tanpa cerita)', 'gray') : K.draft[i].trim() ? pill('Masih terlalu pendek', 'orange') : pill('Belum diisi', 'gray'); }
function kebGambar() {
  const K = window._kb, n = kebJumlah(K), nama = meta().kebiasaan, tg = tglObj(K.tanggal), dapat = (t) => t <= K.hariIni && selisihHari(K.hariIni) - selisihHari(t) <= 7;
  K.el.innerHTML = R(h`<section class="card mb16"><div class="row wrap"><span class="ib green">${ic('checkc')}</span><div class="grow"><h1 style="font-size:24px">Jurnal 7 Kebiasaan Anak Indonesia Hebat</h1><p class="muted">Ceritakan secara singkat kegiatan baik yang kamu lakukan. ${tg.getDate()} ${BULAN[tg.getMonth()]} ${tg.getFullYear()}</p></div><span class="chip fire">${ic('flame')} ${K.hariApi} Hari Api</span></div>
    <div class="row mt16"><div class="bar g grow" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="7"><i id="kbar" style="width:${Math.round(n / 7 * 100)}%"></i></div><b id="kjml">${n}/7</b></div>
    <p class="sm muted mt8" id="ktarget">${n >= K.target ? '🎉 Target hari ini (' + K.target + ' kebiasaan) tercapai!' : 'Target hari ini: ' + K.target + ' kebiasaan. Kebiasaan dihitung bila kamu menuliskan ceritanya.'}</p>
    <div class="week-strip mt16">${K.minggu.map((x) => h`<button class="day ${x.tgl === K.tanggal ? 'on' : ''}" data-act="khari" data-t="${x.tgl}" ${dapat(x.tgl) ? '' : 'disabled'} aria-label="${fmtTgl(x.tgl)}"><small>${HARI[tglObj(x.tgl).getDay()]}</small><b>${tglObj(x.tgl).getDate()}</b><span class="dot ${x.jumlah >= K.target ? 'ok' : ''}"></span></button>`)}</div></section>
    <div class="grid g2 mb16">${nama.map((s, i) => h`<section class="card habit-card ${kebAda(K, i) ? 'acc-green' : ''}" id="kk${i}"><div class="row"><span class="ib green">${ic(IKON_KEB[i])}</span><div class="grow"><b class="head">${i + 1}. ${s}</b></div><span id="kp${i}">${kebStatus(K, i)}</span></div>
      <div class="bubble mt8 sm">${ic('bulb')} ${KEB_PANDUAN[i][0]}</div>
      <div class="field mt8"><label class="skip" for="kc${i}">Cerita ${s}</label><textarea class="textarea" id="kc${i}" rows="3" maxlength="400" data-in="kcerita" data-i="${i}" placeholder="Contoh: ${KEB_PANDUAN[i][1]}">${K.draft[i]}</textarea><div class="row between"><span class="sm muted">Min. ${K.min} karakter</span><span class="counter ${K.draft[i].trim().length >= K.min ? 'ok' : 'no'}" id="kn${i}">${K.draft[i].trim().length}</span></div></div></section>`)}</div>
    <div class="bottombar noprint"><span class="ib green">${ic('checkc')}</span><div class="grow"><b id="kjml2">${n}/7 kebiasaan sudah diceritakan</b><div class="sm muted" id="ks">Cerita tersimpan otomatis saat sudah cukup panjang.</div></div><button class="btn" data-act="ksimpan">${ic('save')} Simpan Kebiasaan</button></div>`);
}
function kebSegarkan(i) {
  const K = window._kb, n = kebJumlah(K), t = K.draft[i].trim().length;
  $('#kp' + i).innerHTML = R(kebStatus(K, i)); const c = $('#kn' + i); c.textContent = t; c.className = 'counter ' + (t >= K.min ? 'ok' : 'no'); $('#kk' + i).classList.toggle('acc-green', kebAda(K, i));
  $('#kbar').style.width = Math.round(n / 7 * 100) + '%'; $('#kjml').textContent = n + '/7'; $('#kjml2').textContent = n + '/7 kebiasaan sudah diceritakan';
  $('#ktarget').textContent = n >= K.target ? '🎉 Target hari ini (' + K.target + ' kebiasaan) tercapai!' : 'Target hari ini: ' + K.target + ' kebiasaan. Kebiasaan dihitung bila kamu menuliskan ceritanya.';
}
const kebAuto = debounce(() => kebSimpan(true), 2000);
async function kebSimpan(senyap) {
  const K = window._kb, pendek = kebPendek(K);
  if (pendek.length) { const e = $('#ks'); if (e) e.textContent = 'Cerita nomor ' + pendek.join(', ') + ' masih terlalu pendek (min. ' + K.min + ' karakter) — belum disimpan.'; if (!senyap) toast('Cerita nomor ' + pendek.join(', ') + ' masih terlalu pendek. Tambahkan sedikit lagi atau kosongkan.', 'warn'); return false; }
  try {
    const r = await api('kebiasaan.simpan', { tanggal: K.tanggal, cerita: K.draft }); K.kotor = false; const e = $('#ks'); if (e) e.textContent = '✓ Tersimpan';
    if (!senyap) toast(r.jumlah + ' dari 7 kebiasaan tercatat. Hebat! 🌟', 'success');
    const b = await api('kebiasaan.get', { tanggal: K.tanggal }).catch(() => null); if (b) { K.minggu = b.minggu; K.hariApi = b.hariApi; K.nilai = b.nilai; K.legacy = b.nilai.map((v, i) => v === 1 && !b.cerita[i]); setChips({ hariApi: b.hariApi }); }
    return true;
  } catch (e) { gagal(e); return false; }
}
INP.kcerita = (t) => { const K = window._kb, i = Number(t.dataset.i); K.draft[i] = t.value; K.kotor = true; kebSegarkan(i); kebAuto(); };
ACT.ksimpan = async (b) => { b.disabled = true; const ok = await kebSimpan(false); if (ok) { const y = window.scrollY; kebGambar(); window.scrollTo(0, y); } b.disabled = false; };
ACT.khari = async (b) => { const K = window._kb; if (K.kotor && !(await kebSimpan(true))) return toast('Perbaiki cerita yang terlalu pendek (atau kosongkan) sebelum pindah hari.', 'warn'); kebMuat(K.el, b.dataset.t, null).catch(gagal); };

// =============== KUMPULKAN BUKTI ===============
PAGES.bukti = {
  roles: ['siswa'], judul: 'Kumpulkan Bukti', render: async (el, args, live) => {
    const d = await api('siswa.tugas', {}); if (!live()) return;
    if (!args[0]) { el.innerHTML = R(h`${ph('Kumpulkan Bukti', 'Pilih tugas, lalu unggah foto/PDF atau tempel tautan YouTube, TikTok, dan Facebook.')}${d.tugas.length ? h`<div class="grid g2">${d.tugas.map((t) => h`<a class="card hover acc-pink" href="#/bukti/${t.tugasId}"><div class="row between"><b class="head">${t.judul}</b>${statusPill(t.status)}</div><div class="sm muted mt8">${t.jenis} · tenggat ${fmtTgl(t.tenggat)} · ${t.buktiN} berkas/tautan</div></a>`)}</div>` : h`<div class="card">${empty('Belum ada tugas aktif', 'Tugas dari gurumu akan muncul di sini.')}</div>`}`); return; }
    const t = d.tugas.find((x) => x.tugasId === args[0]); if (!t) { el.innerHTML = R(h`<div class="card">${empty('Tugas tidak ditemukan', 'Mungkin sudah dinonaktifkan guru.', h`<a class="btn" href="#/bukti">Kembali</a>`)}</div>`); return; }
    window._bk = { el: el, t: t, id: args[0] }; await buktiGambar();
  }
};
async function buktiGambar() {
  const B = window._bk, t = B.t, d = await api('bukti.daftar', { tugasId: t.tugasId }), mb = Number(setting('MAKS_UPLOAD_MB', 4)), kunci = t.status === 'Dinilai';
  B.t.buktiN = d.bukti.length; if (d.bukti.length && t.status === 'Belum') t.status = 'Draft';
  B.el.innerHTML = R(h`<a href="#/bukti" class="btn ghost sm">${ic('arrowl')} Semua tugas</a>${ph(t.judul, t.jenis + ' · tenggat ' + fmtTgl(t.tenggat), statusPill(t.status))}
    ${kunci ? h`<div class="card flat mb16">Tugas ini sudah dinilai, bukti tidak bisa diubah lagi.</div>` : ''}
    <div class="grid g2"><section class="card acc-pink"><h3 class="row gap8">${ic('upload')} Unggah Foto / PDF</h3><div class="drop mt8" id="drop" data-act="pilihberkas" tabindex="0" role="button" aria-label="Pilih berkas">${ic('cloud')}<p><b>Seret berkas ke sini atau klik untuk memilih</b></p><p class="sm muted">JPG, PNG, WEBP, atau PDF · maks. ${mb} MB per berkas</p></div><input type="file" id="berkas" class="hide" accept="image/*,application/pdf" multiple data-ch="berkas"></section>
      <section class="card acc-purple"><h3 class="row gap8">${ic('link')} Tempel Tautan Video / Media Sosial</h3><div class="chips mt8"><span class="pill pink">YouTube</span><span class="pill gray">TikTok</span><span class="pill blue">Facebook</span></div><div class="field mt8"><label for="tautan">Alamat tautan (https://…)</label><input class="input" id="tautan" type="url" inputmode="url" placeholder="https://www.youtube.com/watch?v=…"></div><button class="btn sec" data-act="tautan">${ic('plus')} Tambah Tautan</button></section></div>
    <h2 class="title-dot">Bukti terlampir (${d.bukti.length})</h2>
    ${d.bukti.length ? h`<div class="grid">${d.bukti.map((b) => h`<div class="file"><span class="ib ${b.tipe === 'link' ? 'purple' : b.tipe === 'pdf' ? 'orange' : 'pink'}">${ic(b.tipe === 'link' ? 'link' : b.tipe === 'pdf' ? 'file' : 'image')}</span><div class="grow"><b>${b.nama}</b><div class="sm muted">${b.tipe === 'link' ? String(b.url).slice(0, 60) : ukuran(b.ukuran)} · ${fmtWaktu(b.waktu)}</div></div>${b.tipe === 'link' && /^https:\/\//.test(b.url) ? h`<a class="btn sec sm" href="${b.url}" target="_blank" rel="noopener noreferrer">Buka</a>` : ''}${kunci ? '' : h`<button class="btn ghost icon" data-act="hapusbukti" data-id="${b.buktiId}" aria-label="Hapus">${ic('trash')}</button>`}</div>`)}</div>` : h`<div class="card flat">${empty('Belum ada bukti', 'Unggah foto atau tempel tautan di atas.')}</div>`}
    <div class="bottombar noprint"><span class="grow sm muted">${t.jenis === '4F' ? 'Laporan 4F dikirim dari halaman Laporan 4F.' : 'Setelah semua bukti terlampir, kumpulkan tugasmu.'}</span>${t.jenis === '4F' ? h`<a class="btn" href="#/laporan/${t.tugasId}">${ic('edit')} Buka Laporan 4F</a>` : kunci ? '' : h`<button class="btn" data-act="kumpul">${ic('check')} ${t.status === 'Dikirim' ? 'Kumpulkan Ulang' : 'Kumpulkan Tugas'}</button>`}</div>`);
  const dz = $('#drop'); if (dz) { ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('over'); })); ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('over'); })); dz.addEventListener('drop', (e) => unggahBanyak(Array.from(e.dataTransfer.files))); dz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#berkas').click(); } }); }
}
ACT.pilihberkas = () => $('#berkas').click();
INP.berkas = (t) => { unggahBanyak(Array.from(t.files)); t.value = ''; };
async function unggahBanyak(files) {
  const B = window._bk, mb = Number(setting('MAKS_UPLOAD_MB', 4)); let n = 0;
  for (const f of files) {
    try {
      const pdf = f.type === 'application/pdf';
      if (!pdf && !/^image\//.test(f.type)) throw new Error(f.name + ': jenis berkas tidak didukung.');
      toast('Mengunggah ' + f.name + '…');
      const b64 = pdf ? await bacaBase64(f) : await kompresGambar(f, 1600, 0.82);
      if (b64.length * 3 / 4 > mb * 1048576) throw new Error(f.name + ' lebih dari ' + mb + ' MB.');
      await api('bukti.upload', { tugasId: B.id, nama: pdf ? f.name : f.name.replace(/\.\w+$/, '') + '.jpg', mime: pdf ? 'application/pdf' : 'image/jpeg', base64: b64 }); n++;
    } catch (e) { gagal(e); }
  }
  if (n) { toast(n + ' berkas terunggah.', 'success'); await buktiGambar(); }
}
ACT.tautan = async (b) => { const v = $('#tautan').value.trim(); if (!v) return toast('Tempel alamat tautan dulu.', 'warn'); b.disabled = true; try { await api('bukti.link', { tugasId: window._bk.id, url: v }); toast('Tautan tersimpan.', 'success'); await buktiGambar(); } catch (e) { gagal(e); b.disabled = false; } };
ACT.hapusbukti = (b) => konfirmasi('Hapus bukti ini?', 'Berkas akan dihapus dari tugasmu.', 'Hapus', async () => { try { await api('bukti.hapus', { buktiId: b.dataset.id }); toast('Bukti dihapus.', 'success'); await buktiGambar(); } catch (e) { gagal(e); } }, true);
ACT.kumpul = async (b) => { b.disabled = true; try { await api('tugas.kirim', { tugasId: window._bk.id }); window._bk.t.status = 'Dikirim'; toast('Tugas terkumpul! 🎉', 'success'); await buktiGambar(); } catch (e) { gagal(e); b.disabled = false; } };

// =============== NILAI & UMPAN BALIK ===============
PAGES.nilai = {
  roles: ['siswa'], judul: 'Nilai & Umpan Balik', render: async (el, a, live) => {
    const d = await api('nilai.saya', {}); if (!live()) return; setChips({ bintang: d.totalBintang });
    el.innerHTML = R(h`${ph('Nilai & Umpan Balik', 'Hasil penilaian dan pesan dari gurumu.', h`<span class="chip star">${ic('star')} ${d.totalBintang} Total Bintang</span>`)}${d.rows.length ? h`<div class="grid">${d.rows.map((r) => h`<article class="card acc-orange"><div class="row wrap"><div class="grow"><div class="row wrap gap8">${pill(r.jenis, 'purple')}${statusPill(r.status)}</div><h3 class="mt8">${r.tugas}</h3>${r.judulCerita ? h`<div class="sm"><b>Judul ceritamu:</b> ${r.judulCerita}</div>` : ''}<div class="sm muted">Dikumpulkan ${fmtWaktu(r.waktu)}</div></div>${r.nilai !== null ? h`<div class="center"><div class="grade">${r.nilai}</div>${stars(r.bintang)}</div>` : h`<span class="muted sm">Menunggu penilaian guru</span>`}</div>${r.nilai !== null ? h`<div class="bubble mt16"><b>${r.guru || 'Guru'} berkata:</b><p>${r.umpanBalik}</p></div>` : ''}</article>`)}</div>` : h`<div class="card">${empty('Belum ada nilai', 'Kumpulkan tugasmu, lalu nilai dan umpan balik guru akan muncul di sini.', h`<a class="btn" href="#/bukti">Kumpulkan Tugas</a>`)}</div>`}`);
  }
};