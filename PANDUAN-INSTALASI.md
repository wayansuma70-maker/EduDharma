# Panduan Instalasi — EduDharma & Pancasila Digital

Waktu pengerjaan sekitar 45–60 menit untuk pertama kali. Tidak perlu bisa coding. Kerjakan **berurutan**.

**Yang Anda terima**

| Berkas | Dipakai untuk |
|---|---|
| `Kode.gs`, `Notifikasi.gs`, `CRM.gs`, `Migrasi.gs`, `appsscript.json` | **Backend** — disalin-tempel ke Google Apps Script (Tahap 1) |
| `EduDharma-Frontend.zip` | **Frontend** — diekstrak lalu diunggah ke GitHub Pages (Tahap 3–5) |
| `PANDUAN-INSTALASI.md` | Panduan ini |

**Syarat:** akun Google (milik guru/admin yang menjadi "pemilik" aplikasi), akun GitHub (gratis), dan setiap siswa/guru punya **akun Google** (Gmail biasa atau akun sekolah) karena login memakai Google.

---

## Tahap 1 — Pasang backend di Google Apps Script

1. Buka <https://script.google.com> → **Proyek baru**. Beri nama `EduDharma API`.
2. Di panel kiri, klik ikon ⚙️ **Setelan proyek** → centang **"Tampilkan file manifes appsscript.json di editor"**.
3. Kembali ke **Editor**. Buat 4 berkas skrip (tombol **＋ → Skrip**) bernama `Kode`, `Notifikasi`, `CRM`, `Migrasi`. Hapus isi bawaan, lalu **tempel isi** `Kode.gs`, `Notifikasi.gs`, `CRM.gs`, `Migrasi.gs` ke masing-masing.
4. Buka `appsscript.json` di editor → ganti seluruh isinya dengan isi berkas `appsscript.json` dari kami.
5. Klik **💾 Simpan**.

## Tahap 2 — Siapkan database otomatis & deploy

1. Di editor, pilih fungsi **`setupAppEnvironment`** pada menu di atas → klik **▶ Jalankan**.
2. Akan muncul permintaan izin → **Tinjau izin** → pilih akun Anda → **Lanjutan** → **Buka EduDharma API (tidak aman)** → **Izinkan**. (Peringatan ini normal untuk skrip buatan sendiri.)
3. Setelah selesai, buka **Log eksekusi** di bagian bawah. Cari baris:
   ```
   🔐 AKSES DARURAT (catat sekarang …)
      Nama pengguna : darurat
      Kata sandi    : xxxxxxxxxxxxxxxx
   ```
   **Salin kata sandi itu sekarang dan simpan di tempat aman** (pengelola kata sandi). Sandi hanya tampil sekali. Kalau terlewat: jalankan fungsi `resetAksesDarurat` untuk membuat yang baru.
4. Setup otomatis membuat: folder Drive, spreadsheet database (semua sheet), 3 tugas contoh, dan trigger pengantre notifikasi. Anda sebagai pemilik otomatis menjadi **admin pertama**. Aman dijalankan ulang.
5. Klik **Terapkan → Deployment baru** → ikon ⚙️ pilih **Aplikasi web**:
   - **Jalankan sebagai:** *Saya*
   - **Siapa yang memiliki akses:** *Siapa saja*
   - Klik **Terapkan** → **salin URL Aplikasi Web** (berakhiran `/exec`). Simpan URL ini.

> ⚠️ **Penting untuk ke depannya:** setiap kali Anda mengubah kode `.gs`, buat versi baru: **Terapkan → Kelola deployment → ✏️ Edit → Versi: Versi baru → Terapkan**. Jika tidak, alamat `/exec` tetap menjalankan kode lama.

## Tahap 3 — Isi alamat backend di frontend

1. Ekstrak **`EduDharma-Frontend.zip`**. Hasilnya adalah **satu folder** (namanya mengikuti nama ZIP, mis. `EduDharma-Frontend`) yang **langsung berisi** `index.html`, folder `css`, folder `js`, dst.
2. Buka `js/config.js` di folder hasil ekstrak dengan Notepad/TextEdit. Ganti tulisan `https://script.google.com/macros/s/GANTI_DENGAN_ID_DEPLOYMENT/exec` dengan **URL /exec** dari Tahap 2. Simpan.

## Tahap 4 — Siapkan Git & repository GitHub (sekali saja)

1. **Pasang Git.** Windows: <https://git-scm.com/download/win> (pengaturan bawaan). Mac: buka Terminal, ketik `git --version`, ikuti tawaran instal. Cek: `git --version`.
2. **Akun GitHub:** daftar di <https://github.com>. Username Anda menjadi alamat situs: `https://USERNAME.github.io/…`.
3. **Identitas Git** (sekali seumur komputer):
   ```bash
   git config --global user.name "Nama Anda"
   git config --global user.email "email-akun-github@contoh.com"
   ```
4. Di GitHub: **+ → New repository** → nama: `edudharma` → **Public** → **jangan centang** README/.gitignore/license → **Create repository**. Biarkan halaman petunjuknya terbuka.

## Tahap 5 — Unggah frontend (lewat terminal)

> **Kerjakan dari folder hasil ekstrak ZIP** (mis. `EduDharma-Frontend`) — folder yang **langsung berisi `index.html`**. Bukan folder di atasnya, bukan folder di dalamnya. **Jangan** pakai "Upload files" di situs GitHub (struktur folder rusak → situs 404).

1. Windows: buka folder hasil ekstrak tadi di File Explorer → klik address bar → ketik `powershell` → Enter. (Mac/Linux: `cd` ke folder tersebut.)
2. **Cek dulu** isinya:
   ```bash
   dir          # Windows PowerShell
   ls -la       # Mac / Linux / Git Bash
   ```
   Harus terlihat: `index.html`, `manifest.json`, `sw.js`, folder `css`, folder `js`. Kalau yang terlihat justru satu folder lagi (mis. `EduDharma-Frontend` atau `frontend`) dan bukan `index.html`, Anda satu tingkat terlalu tinggi — masuk dulu ke dalamnya.
3. Jalankan (ganti `USERNAME` dengan username GitHub Anda):
   ```bash
   git init
   git add .
   git commit -m "EduDharma pertama"
   git branch -M main
   git remote add origin https://github.com/USERNAME/edudharma.git
   git push -u origin main
   ```
4. Saat diminta masuk: **username** = username GitHub; **password** = **Personal Access Token** (bukan kata sandi akun). Cara membuat: GitHub → foto profil → **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token** → centang **`repo`** → Generate → salin token (hanya tampil sekali).
5. Buka repository di browser. **Pastikan `index.html` terlihat langsung di halaman depan repository** (bukan di dalam folder).
6. Aktifkan situs: repository → **Settings → Pages** → *Build and deployment*: **Source: Deploy from a branch** → **Branch: `main`**, folder **`/ (root)`** → **Save**. Tunggu 1–3 menit; alamat situs muncul di bagian atas: `https://USERNAME.github.io/edudharma/`.

**Memperbarui frontend di kemudian hari** (misalnya mengganti `config.js`), dari folder yang sama:
```bash
git add .
git commit -m "pembaruan"
git push
```

## Tahap 6 — Login Google (Client ID)

1. Buka <https://console.cloud.google.com> → buat **Proyek baru** (mis. `EduDharma`).
2. **APIs & Services → OAuth consent screen**: pilih **External**, isi nama aplikasi *EduDharma*, email dukungan, email kontak → Simpan. Pada **Publishing status**, ubah ke **In production** (Dalam produksi) agar semua siswa bisa masuk. (Untuk login dasar email/profil, biasanya tidak perlu verifikasi tambahan; bila Google meminta, ikuti petunjuknya.)
3. **Credentials → Create credentials → OAuth client ID** → *Application type*: **Web application**.
4. **Authorized JavaScript origins** → **Add URI**: `https://USERNAME.github.io` — **hanya alamat dasar, tanpa `/edudharma` dan tanpa garis miring di akhir.** Klik **Create**.
5. Salin **Client ID** (berakhiran `.apps.googleusercontent.com`).
6. Buka situs Anda dengan tambahan `#darurat` di akhir: `https://USERNAME.github.io/edudharma/#darurat` → masuk dengan **darurat** + sandi dari Tahap 2.
7. Menu **Pengaturan → Keamanan** → tempel Client ID → **Simpan**. Lalu keluar dan buka situs tanpa `#darurat` — tombol **Masuk dengan Google** akan muncul.

## Tahap 7 — Daftarkan pengguna

Menu **Pengguna** (admin):
- **Tambah** satu per satu, atau **Impor CSV** (ada tombol *Unduh templat*). Kolom: `nama, email, kelas, peran, wa`. Peran: `siswa` atau `guru`.
- **Email harus sama persis dengan akun Google yang dipakai masuk.**
- Siswa **wajib** punya kelas. Guru: isi kelas yang diampu (mis. `7B,7C`); kosong = semua kelas.
- Akun admin pemilik (Anda) sudah ada. Ubah namanya bila perlu.

Punya data siswa lama di spreadsheet? Pakai menu **Impor Data Lama** → tempel alamat spreadsheet → **Pindai (uji coba)** dulu → bila sesuai **Jalankan Impor**. Aman diulang; data yang sama tidak dobel. Judul kolom cukup "Nama", "Email", "Kelas", "No HP".

## Tahap 8 — (Opsional) WhatsApp & Email otomatis

1. Daftar di <https://fonnte.com>, sambungkan nomor WhatsApp sekolah, salin **token** perangkat.
2. **Pengaturan → Keamanan → Token Fonnte** → tempel → Simpan. (Token tersimpan di server, tidak pernah tampil di browser maupun spreadsheet.)
3. **WhatsApp & Notifikasi → Pengaturan**: tekan **Cek perangkat**, isi *Alamat aplikasi* (URL GitHub Pages) agar tautan di pesan benar, nyalakan saklar **WhatsApp** dan/atau **Email**, atur kejadian di tabel (nilai terbit, tugas baru, dll.), lalu **Simpan**. Coba **Tes kirim** ke nomor Anda sendiri.
4. **Blast** (pengumuman massal) memakai batch 10/20/50 dengan jeda antarpesan. Gunakan seperlunya dan hormati opt-out; pengiriman massal berlebihan berisiko membuat nomor dibatasi WhatsApp.

Catatan kuota: akun Google gratis dibatasi sekitar 100 email/hari; kuota tersisa terlihat di halaman Notifikasi.

## Tahap 9 — Pasang di HP (PWA)

- **Android/Chrome:** buka situs → menu ⋮ → **Instal aplikasi** / **Tambahkan ke layar utama**.
- **iPhone/Safari:** tombol Bagikan → **Tambahkan ke Layar Utama**.

---

## Uji awal setelah terpasang (±10 menit)

Lakukan ini sebelum dipakai siswa — aplikasi sudah diuji pada simulator, tetapi **belum pernah dijalankan di Google sungguhan**, jadi pastikan hal ini:

1. Masuk sebagai admin lewat Google → menu terlihat lengkap (9 item).
2. Tambah 1 siswa uji (akun Google kedua Anda) dan 1 guru uji.
3. Sebagai siswa: isi satu sila jurnal, centang kebiasaan, buka Laporan 4F → ketik → *Kirim*, unggah satu foto. Pastikan bintang bertambah.
4. Sebagai guru: buka **Submission** → nilai laporan tadi (75–100 + umpan balik) → pastikan foto bisa dilihat.
5. Sebagai siswa: **Nilai & Umpan Balik** menampilkan nilai.
6. Cek spreadsheet database di Drive: baris baru muncul di `Submission`, `Penilaian`, `Bukti`.
7. Jika WhatsApp dinyalakan: tes kirim, lalu nilai satu tugas dan lihat pesan masuk (bisa tertunda ±1 menit).

## Pemecahan masalah

| Gejala | Penyebab & solusi |
|---|---|
| Situs 404 | `index.html` tidak di root repository. Lihat Tahap 5 langkah 5. Atau Settings → Pages belum diatur ke `main` / `/ (root)`. |
| Halaman tampil tanpa gaya | Folder `css`/`js` tidak ikut ter-push. Ulangi Tahap 5 dari folder yang benar. |
| "Konfigurasi belum lengkap" | `js/config.js` belum diisi `GAS_URL`, atau belum di-push ulang. |
| "Server memberi jawaban tak terduga" | Deployment bukan **Siapa saja**, atau memakai URL `/dev`. Deploy ulang dan pakai URL `/exec`. |
| Perubahan kode `.gs` tidak berefek | Buat **versi baru** deployment (lihat catatan Tahap 2). |
| Tombol Google tidak muncul / "origin tidak diizinkan" | Client ID belum diisi, atau *Authorized JavaScript origin* salah (harus `https://USERNAME.github.io` tanpa path). |
| "Email … belum terdaftar" | Email Google siswa belum ada/berbeda di menu **Pengguna**, atau statusnya Nonaktif. |
| Akses darurat terkunci | 5 kali salah → terkunci 15 menit. Tunggu, atau jalankan `resetAksesDarurat` di editor. |
| Sandi darurat hilang | Jalankan `resetAksesDarurat`, baca sandi baru di Log eksekusi. |
| Notifikasi tidak terkirim | Cek saklar, token, **Cek perangkat**; lihat tab **Antrean & Riwayat** (kolom Respons). Trigger harus ada: jalankan `pasangTrigger` bila perlu. |
| Aplikasi lambat saat pertama dibuka | Normal (Apps Script "dingin"). Halaman login otomatis memanaskannya; berikutnya cepat. |
| Foto tidak mau diunggah | Maks. 4 MB (bisa diubah di Pengaturan, maks. 8 MB); jenis JPG/PNG/WEBP/PDF. Foto dikecilkan otomatis. |

## Keamanan singkat

- Rahasia (secret sesi, Client ID, token Fonnte, hash sandi darurat) hanya di *Script Properties*, tidak di kode/Sheets/browser.
- Berkas siswa di Drive **tidak dibagikan publik**; guru melihatnya lewat aplikasi, dibatasi kelas yang diampu.
- Siswa hanya bisa membaca/menulis data miliknya; guru terbatas pada kelasnya; semua dicek di server.
- Aksi penting (nilai, pengguna, pengaturan, ekspor) tercatat di **Pengaturan → Log Audit**.
- Jika HP hilang: **Pengaturan → Keamanan → Keluar dari semua perangkat**.

## Batasan yang perlu diketahui

- Rekam suara pada Laporan 4F (ada di contoh desain) **belum** disertakan.
- Maskot adalah gambar vektor buatan sendiri yang mirip gaya referensi, bukan ilustrasi aslinya. Ganti dengan ilustrasi Anda di `js/ui.js` (konstanta `MASKOT`).
- Nama 7 Kebiasaan mengikuti daftar resmi menurut pengetahuan kami; bila perlu ubah di `Kode.gs` (konstanta `KEBIASAAN`).
- Dirancang untuk skala sekolah (ratusan siswa). Untuk ribuan pengguna aktif bersamaan, kuota Apps Script akan menjadi batas.
- Penggabungan kontak duplikat di CRM belum ada (duplikat hanya ditandai).
