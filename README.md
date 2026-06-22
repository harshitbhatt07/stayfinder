# StayFinder Complete Working MERN

## Updated Features
- Fixed uploaded image serving from backend `/uploads`.
- Multiple images are saved in one room/property upload. First image appears on home page.
- Room details page shows all uploaded images in a slider/thumbnail gallery.
- Price filter works with `maxPrice`, e.g. 2000 shows rooms priced 2000 or below.
- Tourist booking form includes check-in/check-out, guests, room count, food requirement, food items, special request, online/offline payment.
- Online payment shows owner QR/UPI and allows payment screenshot upload.
- Full booking details go to owner pending booking panel.
- Owner can accept/reject booking. Accept creates notification for tourist and marks room booked.
- Tourist can see booking notifications in My Bookings.
- Super Admin dashboard sidebar is improved and menu sections are active.

## Run Backend
```bash
cd backend
npm install
npm run dev
```

Backend `.env` example:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/stayfinder
JWT_SECRET=stayfinder_secret_key
CLIENT_URL=http://localhost:5173
```

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## Default Super Admin
Email: admin@stayfinder.com
Password: admin123
