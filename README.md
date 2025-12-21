# Baitul Aman — Preview App

A minimal Vite + React preview of the `BaitulAmanApp` UI for local development and testing.

## Quick start

1. Install dependencies

   - On Windows PowerShell (if PowerShell script execution is restricted use `npm.cmd`):
     ```powershell
     cd preview-app
     npm.cmd install
     npm.cmd run dev
     ```

   - Or using `npm` in a normal shell:
     ```bash
     cd preview-app
     npm install
     npm run dev
     ```

2. Open the app in your browser: http://localhost:5174/ (Vite may try 5173 then fallback to 5174 if 5173 is busy).

3. Debugging

   - VS Code "Launch Chrome against localhost" config was updated to open http://localhost:5174.
   - Press F5 (or run the launch configuration) after starting the dev server.


## Production build & deploy

1. Build for production

```bash
cd preview-app
npm run build
```

2. Preview the built site locally

```bash
npm run preview
# then open the printed URL (default: http://localhost:5174)
```

3. Deploying

- Vercel (recommended): push the repo to GitHub and connect the project in Vercel; set **Build Command** to `npm run build` and **Output Directory** to `dist`.
- Netlify: same as above — set the build command to `npm run build` and publish directory to `dist`.

Notes:
- Tailwind is now configured as a build-time dependency (Tailwind + PostCSS). The app no longer relies on the CDN for Tailwind in production.
- If you need to serve on a different port or CI, adjust the preview/server settings in your hosting service.

## Admin login

- Password (local/dev): `admin123`
- After login, go to **Admin Dashboard** to edit prayer times, answer submitted questions, and manage announcements.

## Features implemented

- Home, Prayer Times, Ask Imam, Donate, Login, Admin Dashboard
- Simple rule-based chat assistant in a floating FAB
- Local persistence using `localStorage` (prayer times, announcements, questions, donations, session)
- Donation flow updates totals and persists

## Troubleshooting

- If you see `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system`, run npm commands using `npm.cmd` or adjust PowerShell execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` (requires admin awareness).

- If port 5173 is in use, Vite will pick a free port (e.g., 5174). Use the console output to confirm the actual URL.

## Next steps (optional)

- Wire a real backend API for persistence and payments
- Add tests and CI, and create a deployable build

---
Saved for local preview.
