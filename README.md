# GymTrack 🏋️

Beginner-friendly workout tracker built with React, Vite, Tailwind CSS and Recharts.

## Features
- Dashboard with total workouts, sets and lifting volume
- Add workouts with exercise, date, sets, reps and weight
- Searchable exercise library
- Workout history and deletion
- Weekly progress charts
- Browser localStorage persistence (no account required)

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build

```bash
npm run build
```

## Deploy

Push this folder to GitHub, then import the repository in Vercel. Build command: `npm run build`. Output directory: `dist`.

## Note

Data is saved in the current browser only. Clearing site data or using another device will not preserve workouts. A future version can add Supabase authentication and database sync.
