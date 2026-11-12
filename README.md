# EduDharma & Pancasila Digital — Frontend (GitHub Pages)

Aplikasi web statis (HTML/CSS/JS, PWA) untuk laporan refleksi **4F**, **Jurnal Pancasila**, **7 Kebiasaan Anak Indonesia Hebat**, pengumpulan bukti, penilaian guru (75–100) dan reward bintang.
Backend: Google Apps Script (REST API) + Google Sheets/Drive — berkas `.gs` ada terpisah dari ZIP ini.

## Isi folder ini (folder ini = root repository)
```
index.html          ← halaman utama (harus di root)
manifest.json, sw.js, icon-*.png   ← PWA (bisa dipasang di HP)
css/style.css
js/config.js        ← SATU-SATUNYA berkas yang perlu Anda edit (isi GAS_URL)
js/ui.js api.js app.js siswa.js guru.js admin.js
PANDUAN-INSTALASI.md
```

## Langkah singkat
1. Pasang backend di Apps Script (4 berkas `.gs` + `appsscript.json`), jalankan `setupAppEnvironment`, lalu Deploy → Web app (akses: Anyone).
2. Edit `js/config.js`: ganti `GAS_URL` dengan alamat Web App (`…/exec`).
3. Buat repository GitHub (Public), lalu dari folder INI: `git init` → `git add .` → `git commit` → `git push`. Aktifkan Pages (branch `main`, folder `/ (root)`).
4. Buat Google OAuth Client ID, tambahkan `https://USERNAME.github.io` sebagai *Authorized JavaScript origin*, lalu isi di aplikasi (Pengaturan → Keamanan).

Rincian lengkap: **PANDUAN-INSTALASI.md**.

## Keamanan
Frontend tidak memuat rahasia apa pun. `GAS_URL` bersifat publik; token API (Fonnte), Client ID, dan secret sesi disimpan di *Script Properties* backend. Teks buatan pengguna selalu di-escape sebelum ditampilkan.
