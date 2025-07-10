# Implementasi Fitur Sign Up & Sign In

Panduan ini merinci langkah-langkah untuk menambahkan fitur Sign Up (pendaftaran) dan Sign In (masuk) ke aplikasi Anda, termasuk implementasi backend, integrasi frontend, dan alur kerja keseluruhan.

## 1. Implementasi Backend (API Sign Up & Sign In)

Backend bertanggung jawab untuk menangani data pengguna, keamanan, dan logika otentikasi.

### Pilihan Teknologi Backend

* **Framework:** Node.js (Express, NestJS), Python (Django, Flask), PHP (Laravel), Ruby (Ruby on Rails), Java (Spring Boot), dll.
* **Basis Data:** MongoDB, PostgreSQL, MySQL, SQLite, dll.

### Desain Basis Data (User Model)

Definisikan skema/model pengguna di basis data Anda. Bidang-bidang esensial meliputi:

* `_id`: Kunci Utama (Primary Key).
* `email`: String, unik, wajib diisi. Digunakan sebagai identifikasi utama pengguna.
* `password`: String, wajib diisi. Akan menyimpan **hash sandi**, bukan teks biasa.
* `createdAt`: Tanggal/waktu pembuatan akun.
* `updatedAt`: Tanggal/waktu terakhir pembaruan akun.

### Aspek Keamanan Penting: Hashing Sandi

* **Jangan pernah menyimpan sandi dalam bentuk teks biasa.** Ini adalah praktik keamanan yang sangat buruk.
* Gunakan algoritma hashing satu arah yang kuat dan modern seperti **Bcrypt**.
    * **Saat registrasi:** Hash sandi yang diberikan pengguna sebelum menyimpannya ke basis data.
    * **Saat login:** Bandingkan sandi yang diberikan pengguna dengan hash yang tersimpan di basis data menggunakan fungsi perbandingan Bcrypt (misalnya, `bcrypt.compare()`).

### Pembuatan Token Otentikasi (JWT - JSON Web Tokens)

* Setelah login berhasil, backend akan membuat sebuah **JWT**. Token ini akan berfungsi sebagai kredensial pengguna untuk permintaan selanjutnya ke rute-rute yang dilindungi.
* JWT adalah string yang berisi informasi (`payload`) yang tidak sensitif tentang pengguna (misalnya, ID pengguna, peran) dan ditandatangani secara kriptografis menggunakan sebuah `secret key` yang hanya diketahui oleh server.

### Endpoint API Backend

1.  **`POST /api/register` (Pendaftaran Pengguna Baru)**
    * **Tujuan:** Mendaftarkan pengguna baru ke sistem.
    * **Request Body:**
        ```json
        {
          "email": "user@example.com",
          "password": "StrongPassword123!"
        }
        ```
    * **Validasi:**
        * Validasi format `email`.
        * Periksa apakah `email` sudah terdaftar (harus unik).
        * Validasi kekuatan `password` (misalnya, panjang minimum, mengandung huruf besar/kecil, angka, karakter khusus).
    * **Proses:**
        * Hash `password` menggunakan Bcrypt.
        * Buat catatan pengguna baru di basis data dengan sandi yang sudah di-hash.
    * **Respons:**
        * **Sukses (201 Created):**
            ```json
            {
              "message": "User registered successfully!",
              "user": { "id": "...", "email": "user@example.com" }
            }
            ```
        * **Gagal (400 Bad Request):** (e.g., email sudah terdaftar, sandi lemah)
            ```json
            { "error": "Email already registered" }
            ```

2.  **`POST /api/login` (Login Pengguna)**
    * **Tujuan:** Mengotentikasi pengguna dan memberikan token akses.
    * **Request Body:**
        ```json
        {
          "email": "user@example.com",
          "password": "StrongPassword123!"
        }
        ```
    * **Validasi:** Validasi keberadaan `email` dan `password`.
    * **Proses:**
        * Cari pengguna berdasarkan `email` di basis data.
        * Bandingkan `password` yang diberikan dengan hash sandi yang tersimpan menggunakan Bcrypt.
        * Jika kredensial valid, buat JWT yang berisi ID pengguna atau data relevan lainnya.
    * **Respons:**
        * **Sukses (200 OK):**
            ```json
            {
              "message": "Login successful!",
              "token": "your_json_web_token_here",
              "user": { "id": "...", "email": "user@example.com" }
            }
            ```
        * **Gagal (401 Unauthorized):** (e.g., kredensial tidak valid)
            ```json
            { "error": "Invalid email or password" }
            ```

3.  **Middleware Otentikasi (Untuk Rute yang Dilindungi)**
    * Ini adalah fungsi yang berjalan sebelum rute API Anda yang membutuhkan otentikasi (misalnya, `GET /api/profile`, `POST /api/create-post`).
    * **Fungsi:**
        * Memeriksa header `Authorization` di permintaan masuk (biasanya `Authorization: Bearer <token>`).
        * Mengekstrak JWT dari header.
        * Memverifikasi tanda tangan JWT menggunakan `secret key` Anda.
        * Memverifikasi apakah token belum kedaluwarsa.
        * Jika token valid, mendekode payload dan melampirkan informasi pengguna (misalnya, `userId`) ke objek `req` (misal `req.user = decodedToken;`).
        * Jika token tidak valid atau tidak ada, menghentikan pemrosesan permintaan dan mengirimkan respons `401 Unauthorized`.

## 2. Integrasi dengan Frontend

Frontend menyediakan antarmuka pengguna dan berkomunikasi dengan API backend.

### Pilihan Teknologi Frontend

* **Framework/Library:** React, Angular, Vue.js, Svelte, atau bahkan plain HTML/CSS/JavaScript.

### Komponen Antarmuka Pengguna

1.  **`RegisterForm` Component:**
    * Berisi bidang input untuk email, sandi, dan konfirmasi sandi.
    * Menerapkan validasi sisi klien (misalnya, format email dasar, kecocokan sandi, panjang minimum) untuk umpan balik instan kepada pengguna.
    * Memiliki tombol submit untuk mengirim data.
    * Area untuk menampilkan pesan kesalahan validasi atau pesan sukses.

2.  **`LoginForm` Component:**
    * Berisi bidang input untuk email dan sandi.
    * Menerapkan validasi sisi klien dasar.
    * Memiliki tombol submit.
    * Area untuk menampilkan pesan kesalahan login yang diterima dari backend.

3.  **Aplikasi Utama (`App` Component) & Pengaturan Routing:**
    * Menggunakan perpustakaan routing (misalnya, React Router Dom) untuk mengelola navigasi antara halaman (misalnya, `/login`, `/register`, `/dashboard`, `/profile`).
    * Menerapkan **proteksi rute (route guarding)**: Logika di frontend yang mencegah pengguna tidak terotentikasi mengakses halaman-halaman tertentu (misalnya, jika tidak ada token, arahkan ke halaman login).

### Interaksi API dari Frontend

* Gunakan `fetch` API bawaan browser atau perpustakaan HTTP pihak ketiga seperti **Axios** untuk membuat permintaan HTTP (terutama `POST`) ke endpoint backend (`/api/register`, `/api/login`).
* Kirim kredensial pengguna (email, sandi) dalam body permintaan sebagai JSON.
* Pastikan untuk menangani status respons HTTP (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized) dan pesan kesalahan yang dikembalikan oleh backend.

### Manajemen Token di Frontend

* Setelah login berhasil, frontend akan menerima JWT dari backend. **Simpan JWT ini dengan aman di browser.**
    * **`localStorage` atau `sessionStorage`:** Pilihan umum karena sederhana, tetapi rentan terhadap serangan XSS jika aplikasi Anda tidak menerapkan praktik keamanan yang ketat.
    * **`HTTP-only Cookies`:** Lebih aman terhadap XSS karena JavaScript tidak dapat mengaksesnya. Namun, memerlukan konfigurasi backend tambahan untuk mengatur cookie dan penanganan CORS yang tepat.
* Untuk setiap permintaan selanjutnya ke rute backend yang dilindungi, **lampirkan JWT** ke header `Authorization` dari permintaan: `Authorization: Bearer <token_anda_di_sini>`.
* Sediakan fungsionalitas "Logout" yang menghapus JWT dari penyimpanan browser dan mengarahkan pengguna kembali ke halaman login.

## 3. Alur Implementasi (Langkah-demi-Langkah)

Berikut adalah alur terperinci yang menggambarkan interaksi antara frontend dan backend untuk fitur otentikasi.

### A. Alur Pendaftaran Pengguna (Sign Up)

1.  **Frontend (FE):**
    * Pengguna membuka aplikasi dan menavigasi ke halaman `/register`.
    * Pengguna mengisi `email`, `password`, dan `confirm_password` pada formulir pendaftaran.
    * **Validasi Sisi Klien:** FE melakukan validasi dasar (misal: format email, sandi minimal 8 karakter, sandi dan konfirmasi sandi cocok).
    * Jika ada kesalahan validasi, FE menampilkan pesan error secara instan di UI.
2.  **FE → Backend (API Call):**
    * Jika validasi sisi klien berhasil, FE mengirimkan permintaan `POST` ke endpoint `/api/register` di backend.
    * Request Body berisi `email` dan `password` (belum di-hash).
3.  **Backend (BE):**
    * BE menerima permintaan `POST /api/register`.
    * **Validasi Sisi Server:** BE melakukan validasi ketat (format email, email belum terdaftar, kekuatan sandi).
    * Jika validasi gagal, BE mengirimkan respons `400 Bad Request` atau `409 Conflict` (jika email sudah ada) dengan pesan kesalahan yang relevan ke FE.
4.  **BE (Proses Pendaftaran):**
    * Jika semua validasi berhasil, BE melakukan **hashing** pada sandi yang diterima menggunakan Bcrypt.
    * BE menyimpan data pengguna baru (email, sandi yang di-hash, timestamp) ke basis data.
5.  **BE → Frontend (Response):**
    * BE mengirimkan respons `201 Created` atau `200 OK` dengan pesan sukses ke FE.
6.  **FE (Tampilan):**
    * FE menampilkan pesan sukses kepada pengguna.
    * FE mengarahkan pengguna secara otomatis ke halaman `/login`.

### B. Alur Login Pengguna (Sign In)

1.  **FE:**
    * Pengguna menavigasi ke halaman `/login`.
    * Pengguna mengisi `email` dan `password` pada formulir login.
    * **Validasi Sisi Klien:** FE melakukan validasi dasar (misal: format email).
2.  **FE → Backend (API Call):**
    * FE mengirimkan permintaan `POST` ke endpoint `/api/login` di backend dengan `email` dan `password`.
3.  **BE:**
    * BE menerima permintaan `POST /api/login`.
    * BE mencari pengguna berdasarkan `email` di basis data.
    * Jika pengguna tidak ditemukan, atau sandi yang diberikan tidak cocok dengan sandi yang di-hash (menggunakan `bcrypt.compare()`), BE mengirimkan respons `401 Unauthorized` dengan pesan "Invalid email or password" ke FE.
4.  **BE (Proses Login Sukses):**
    * Jika kredensial valid, BE membuat **JSON Web Token (JWT)** yang berisi informasi seperti ID pengguna, peran, dan masa berlaku.
    * BE menandatangani JWT dengan `secret key` server.
5.  **BE → Frontend (Response):**
    * BE mengirimkan respons `200 OK` ke FE, berisi JWT dan mungkin beberapa detail pengguna non-sensitif.
6.  **FE (Tampilan & Manajemen Token):**
    * FE menerima JWT dari respons backend.
    * FE **menyimpan JWT** ini di `localStorage`, `sessionStorage`, atau sebagai `HTTP-only cookie`.
    * FE mengarahkan pengguna ke halaman yang dilindungi (misalnya, `/dashboard`, `/profile`).

### C. Alur Mengakses Sumber Daya yang Dilindungi

1.  **FE:**
    * Pengguna mencoba menavigasi ke rute yang memerlukan otentikasi (misalnya, `/profile`, `/settings`).
    * **Proteksi Rute Frontend:** Router FE memeriksa apakah ada JWT yang valid dalam penyimpanan. Jika tidak ada, FE segera mengarahkan pengguna kembali ke halaman `/login`.
2.  **FE → Backend (API Call ke Rute Terlindungi):**
    * FE membuat permintaan API (misalnya, `GET /api/user/profile`) ke backend.
    * **Penting:** FE **melampirkan JWT** yang disimpan ke header `Authorization` dari permintaan, dengan format `Authorization: Bearer <JWT_ANDA>`.
3.  **Backend (BE):**
    * BE menerima permintaan.
    * **Middleware Otentikasi** yang telah Anda siapkan akan mencegat permintaan ini.
    * Middleware ini akan mengekstrak JWT dari header `Authorization`.
    * Middleware memverifikasi tanda tangan JWT menggunakan `secret key` server dan memeriksa apakah token belum kedaluwarsa.
4.  **BE (Verifikasi Token):**
    * Jika JWT **tidak valid** (misalnya, tanda tangan salah, kedaluwarsa, atau tidak ada), middleware akan menghentikan pemrosesan permintaan dan mengirimkan respons `401 Unauthorized` ke FE.
5.  **BE (Akses Terlindungi):**
    * Jika JWT **valid**, middleware mendekode payload token, mengekstrak informasi pengguna (misalnya, ID pengguna), dan melampirkannya ke objek `req` (misal `req.user = { id: '...' };`).
    * Middleware meneruskan kontrol ke pengendali rute (route handler) yang sebenarnya (`/api/user/profile`).
6.  **BE (Proses Data):**
    * Pengendali rute menggunakan informasi pengguna yang terotentikasi (dari `req.user.id`) untuk mengambil data yang relevan dari basis data (misalnya, data profil pengguna).
7.  **BE → Frontend (Response):**
    * BE mengirimkan data yang diminta (misalnya, data profil pengguna) dalam respons `200 OK` ke FE.
8.  **FE (Tampilan):**
    * FE menerima data dan menampilkannya di antarmuka pengguna.

---
