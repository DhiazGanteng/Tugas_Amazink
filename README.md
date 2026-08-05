# WSS Ticketing Frontend

Frontend aplikasi WSS Ticketing yang dibangun menggunakan React dan Vite.

## Fitur utama

- Halaman login dan proteksi route dengan `react-router-dom`
- Dashboard ringkasan ticket dengan grafik status dan prioritas
- Halaman Ticket List dengan tampilan table, kanban, dan kalender
- Halaman pembuatan ticket dengan preview dan upload lampiran
- Halaman detail ticket dengan komentar dan status ticket
- Mode gelap dan terang yang tersimpan di `localStorage`
- Sidebar responsive dengan menu mobile

## Struktur project

- `src/components` - komponen UI umum seperti `Navbar`, `Sidebar`, `Card`, `TicketCard`, `StatusBadge`, `ChartCard`, `ProtectedRoute`
- `src/pages` - halaman aplikasi seperti `Dashboard`, `TicketList`, `TicketDetail`, `CreateTicket`, `Profile`, `Bantuan`, `Login`
- `src/services` - panggilan API dan logika service seperti `authService`, `apiClient`, `ticketService`, `dashboardService`
- `src/styles` - file CSS untuk setiap halaman dan komponen
- `src/utils` - utilitas seperti role helper

## Persyaratan

- Node.js 18+ atau versi terbaru yang kompatibel dengan Vite
- NPM atau Yarn

## Cara menjalankan

Sebelum menjalankan, pastikan berada di folder project:

```bash
cd D:\tugas-amazing\tugas-amazing
```

Install dependensi:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Lalu buka alamat yang ditampilkan, biasanya `http://localhost:5173`.

## Build produksi

```bash
npm run build
```

Untuk melihat hasil build lokal:

```bash
npm run preview
```

## Catatan

- Pastikan backend API sudah berjalan dan `VITE_API_BASE_URL` diatur jika diperlukan.
- Tema dark mode menyimpan preferensi ke `localStorage` dan akan dipakai saat reload.
- Menu responsive menggunakan tombol hamburger di kiri atas ketika layar mobile.



