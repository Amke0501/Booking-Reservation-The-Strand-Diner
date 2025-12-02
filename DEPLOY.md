# Vercel Deployment Guide

## Deploy Backend

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy backend**:
   ```bash
   cd backend
   vercel
   ```
   - Follow prompts
   - Note the deployment URL (e.g., `https://your-backend-xyz.vercel.app`)

## Deploy Frontend

1. **Update frontend configuration**:
   - Edit `frontend/vercel.json`
   - Replace `your-backend-url.vercel.app` with your actual backend URL

2. **Set environment variable**:
   ```bash
   cd frontend
   vercel env add VITE_API_URL
   ```
   - Enter your backend URL (e.g., `https://your-backend-xyz.vercel.app`)

3. **Deploy frontend**:
   ```bash
   vercel
   ```

## Alternative: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Deploy backend:
   - Root Directory: `backend`
   - Framework Preset: Other
4. Deploy frontend:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Add Environment Variable: `VITE_API_URL` = your backend URL

## Important Notes

- Backend needs CORS configured for your frontend domain
- In-memory storage will reset on each deployment
- Consider upgrading to a database for production
