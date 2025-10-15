# 🚀 Deploy Vegas Insider Sports App to Netlify

## Quick Deploy Options

### Option 1: Direct Netlify Deploy (Recommended)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/vegas-insider-sports-app)

### Option 2: Manual Deployment Steps

#### Step 1: Prepare Your Repository
1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Vegas Insider Sports App"
   git branch -M main
   git remote add origin https://github.com/yourusername/vegas-insider-sports-app.git
   git push -u origin main
   ```

#### Step 2: Deploy to Netlify

**Method A: GitHub Integration (Recommended)**
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose "GitHub" and authorize Netlify
4. Select your `vegas-insider-sports-app` repository
5. Configure build settings:
   - **Build command**: `npm run build:simple`
   - **Publish directory**: `dist`
   - **Node version**: `18`
6. Click "Deploy site"

**Method B: Drag & Drop Deploy**
1. Run locally: `npm install && npm run build:simple`
2. Go to [Netlify](https://netlify.com)
3. Drag the `dist` folder to the deploy area
4. Your site will be live instantly!

**Method C: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Step 3: Configure Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain
3. Configure DNS settings as shown

## 📋 Pre-Deployment Checklist

- ✅ All files are committed to Git
- ✅ `netlify.toml` configuration is present
- ✅ Build command is set to `npm run build:simple`
- ✅ Publish directory is set to `dist`
- ✅ Node version is 18 or higher

## 🔧 Build Configuration

The app uses these key files for deployment:

### `netlify.toml`
```toml
[build]
  publish = "dist"
  command = "npm run build:simple"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `package.json` scripts
```json
{
  "scripts": {
    "build:simple": "webpack --config simple-webpack.config.js --mode production"
  }
}
```

## 🌐 Expected Result

After deployment, you'll have:
- **Live URL**: `https://your-app-name.netlify.app`
- **Custom Domain**: Configure your own domain
- **HTTPS**: Automatic SSL certificate
- **CDN**: Global content delivery
- **Auto-deploys**: Updates on every Git push

## 🎯 Features Showcased

Your deployed site will showcase:
- 🔥 Hot Streaks Tracker
- 📈 Line Watch Tool
- 📊 Odds Analyzer Dashboard
- 💰 My Bet Vault
- 📱 Team Pulse Widget
- 🍎 Apple Wallet Integration

## 🔍 Troubleshooting

### Build Fails?
```bash
# Test build locally first
npm install
npm run build:simple

# Check for errors in dist folder
ls -la dist/
```

### Site Not Loading?
- Check publish directory is set to `dist`
- Verify `_redirects` file exists
- Check build logs in Netlify dashboard

### Need Help?
- Check Netlify build logs
- Verify all dependencies are in `package.json`
- Ensure Node version compatibility

## 📱 Mobile App Development

The web version showcases the app features. For full mobile development:

```bash
# iOS Development
npm run ios

# Android Development  
npm run android

# Web Development
npm run web
```

## 🎉 Success!

Once deployed, share your app:
- **Live Demo**: Your Netlify URL
- **GitHub Repo**: Source code link
- **Features**: Comprehensive sports betting analytics
- **Design**: Beautiful iOS-style interface

---

**Ready to deploy? Choose your preferred method above and get your Vegas Insider Sports App live in minutes!** 🚀