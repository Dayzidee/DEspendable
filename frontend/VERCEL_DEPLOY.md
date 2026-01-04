# Vercel Deployment Guide for DEspendables

Vercel is the native platform for Next.js. Deploying via the Web Dashboard is the most convenient way as it sets up **Automatic Continuous Deployment** (every time you push to GitHub, Vercel updates your site).

## Option 1: Deploy via Web Dashboard (Recommended)

### 1. Push Code to GitHub
Ensure your latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin <your-branch>
```

### 2. Connect to Vercel
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  Log in with your GitHub account.
3.  Click **Import** next to your `DEspendables` repository.

### 3. Configure Project
1.  **Root Directory**: Since your app is in a subfolder, click **Edit** and select the `/frontend` folder.
2.  **Environment Variables**: 
    - Open your local `.env.local` file.
    - Copy each key and value (like `NEXT_PUBLIC_FIREBASE_API_KEY`) into the "Environment Variables" section on Vercel.
3.  Click **Deploy**.

## Option 2: Deploy via CLI
If you prefer the command line, follow these steps:

### 1. Login
```bash
npx vercel login
```

### 2. Deploy
Run inside the `frontend` directory:
```bash
npx vercel
```
*Follow the prompts. Vercel will detect Next.js automatically.*

---

## Why Vercel?
- **Native Next.js Support**: Everything just works.
- **Automatic Backend**: Your `src/app/api` routes are automatically deployed as Serverless Functions.
- **Free Tier**: No "Blaze plan" or prepayment required for personal projects.
- **Previews**: Every time you push to GitHub, Vercel creates a unique preview link for you.
