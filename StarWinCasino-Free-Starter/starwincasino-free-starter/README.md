# StarWinCasino – Free Starter (Vercel + Render + Freenom)

This is a minimal, working starter you can deploy free:
- Frontend: Vite + React + Tailwind (use Vercel Free)
- Backend: Node + Express + Socket.io (use Render Free)
- Demo game: Spin Wheel with token balance (in-memory)

## Quick Start (Local)
```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev
```

## Deploy Free
1) Push this repo to GitHub.
2) **Backend on Render**: Create new web service from `backend` folder (or use `render.yaml`).
3) **Frontend on Vercel**: Import the repo and select `frontend` as the project root.
   - Set `VITE_API_BASE` in Vercel env to your Render URL (e.g. https://your-backend.onrender.com).
4) **Domain (Freenom)**: Point your Freenom domain to Vercel project (add domain in Vercel → then set nameservers).

## Env
- `frontend/.env` example:
```
VITE_API_BASE=https://your-backend.onrender.com
```
- `backend/.env` example:
```
CORS_ORIGIN=*
PORT=4000
```

## Next Steps
- Add Firebase Auth & Firestore for real balances.
- Add Teen Patti / Ludo rooms with Socket.io rooms.
- Integrate NowPayments for crypto deposits.
