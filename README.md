# MindEase

MindEase is a portfolio-grade full-stack mental health tracker and therapy booking system built with a modern wellness-focused product experience. It combines daily mood tracking, private journaling, therapist discovery, appointment management, analytics, resources, and admin operations in one deployable project.

## Stack

- Frontend: HTML5, Tailwind CSS CDN, modern vanilla JavaScript modules
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Auth: JWT + bcrypt
- Deployment: Netlify frontend + Render backend + MongoDB Atlas

## Product Features

- Account registration and login
- Mood tracker with stress, anxiety, sleep, and notes
- Rule-based wellness suggestions
- Private journal with mood tags and search
- Therapist browsing and booking flow
- Appointment reschedule and cancel actions
- Analytics dashboard with Chart.js
- Self-care resources and emergency help banner
- Profile settings and dark mode toggle
- Admin dashboard for users, bookings, therapists, and analytics

## Folder Structure

```text
project-root/
├── frontend/
│   ├── index.html
│   ├── pages/
│   ├── js/
│   └── css/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── render.yaml
```

## Backend Setup

1. Open [backend/.env.example](C:/Users/VINAY%20RANA/Documents/Codex/2026-04-23-create-a-complete-full-stack-web-2/backend/.env.example) and copy it to `.env`.
2. Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Seed sample data:

```bash
npm run seed
```

5. Start the API:

```bash
npm run dev
```

The API exposes routes under `/api`, including:

- `/api/auth`
- `/api/moods`
- `/api/journal`
- `/api/therapists`
- `/api/bookings`
- `/api/resources`
- `/api/admin`

## Frontend Setup

The frontend is static and can be opened directly or served with any static server.

```bash
cd frontend
npx serve .
```

If your backend is not hosted at `http://localhost:5000/api`, set a custom API base URL in the browser console:

```js
localStorage.setItem('mindease_api_url', 'https://your-render-url.onrender.com/api');
```

## Demo Accounts

After seeding:

- Admin: `admin@mindease.com`
- Password: `Admin123!`

If the backend is unavailable, the frontend gracefully falls back to local demo mode so the product can still be reviewed visually.

## Deployment

### Netlify

- Deploy the `frontend` folder as the publish directory.
- `frontend/netlify.toml` is included.

### Render

- Deploy from the repo root with [render.yaml](C:/Users/VINAY%20RANA/Documents/Codex/2026-04-23-create-a-complete-full-stack-web-2/render.yaml), or create a Node web service pointed at `backend`.
- Set `CLIENT_URL`, `MONGODB_URI`, and `JWT_SECRET` in Render environment variables.

### MongoDB Atlas

- Create a cluster and whitelist your deployment IPs.
- Add the Atlas connection string to `MONGODB_URI`.

## Notes

- This project uses frontend local fallback data for presentation continuity when the API is unreachable.
- The emergency help banner is a non-crisis disclaimer and not a substitute for emergency support.
- Email reminders are represented in the product design and settings flow; real email sending can be added with a provider like Resend, SendGrid, or Nodemailer.
