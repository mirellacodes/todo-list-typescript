# 🚀 Deployment Guide

## Frontend Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `todo-list-typescript/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

### 3. Set Environment Variables
In Vercel dashboard:
- `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.vercel.app`)

## Backend Deployment (Vercel)

### 1. Deploy Backend
1. Go to [vercel.com](https://vercel.com)
2. Create another project
3. Import the same repository
4. Configure:
   - Framework Preset: Node.js
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click "Deploy"

### 2. Update Frontend Config
After backend deploys, update `frontend/src/config.ts`:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://your-backend-url.vercel.app' : 'http://localhost:5000');
```

### 3. Redeploy Frontend
The frontend will automatically redeploy when you push changes.

## Alternative: Render (Backend)

If you prefer Render over Vercel for backend:

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Deploy

## Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.vercel.app
```

### Backend
- `PORT`: Automatically set by hosting platform
- `NODE_ENV`: Automatically set to 'production'

## Testing Deployment

1. **Backend**: Test API endpoints at your backend URL
2. **Frontend**: Test the full app at your frontend URL
3. **Toast Notifications**: Should work exactly like local development

## Troubleshooting

- **CORS Issues**: Backend already has CORS enabled
- **Build Errors**: Check TypeScript compilation
- **API Connection**: Verify environment variables are set correctly
