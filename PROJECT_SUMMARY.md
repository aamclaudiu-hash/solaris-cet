# SOLARIS CET - Deployment Guide

## GitHub Pages Deployment

### Method 1: Deploy from docs folder (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Configure GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select **main** branch and **/docs** folder
   - Click **Save**

3. **Wait for deployment**
   - GitHub will build and deploy your site
   - This usually takes 1-2 minutes
   - Your site will be available at: `https://aamclaudiu-hash.github.io/solaris-cet/`

### Method 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Copy to docs
        run: |
          rm -rf docs
          cp -r dist docs
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Custom Domain Setup

1. **Add CNAME file**
   Create `docs/CNAME` with your domain:
   ```
   solariscet.io
   ```

2. **Configure DNS**
   Add these records to your DNS provider:
   
   | Type | Name | Value |
   |------|------|-------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | aamclaudiu-hash.github.io |

3. **Enable HTTPS**
   - In GitHub Pages settings, check "Enforce HTTPS"

## Verification

After deployment, verify:

1. **Site is accessible**: Visit `https://aamclaudiu-hash.github.io/solaris-cet/`
2. **Meta tags**: Check with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
3. **SEO**: Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
4. **Performance**: Analyze with [PageSpeed Insights](https://pagespeed.web.dev/)

## Troubleshooting

### 404 Errors
- Ensure `index.html` exists in docs folder
- Check GitHub Pages source is set to `/docs`

### Assets not loading
- Verify `base` in `vite.config.ts` matches your repo name:
  ```typescript
  base: '/solaris-cet/'
  ```

### Cache issues
- Clear browser cache
- Add cache-busting to assets
- Use `?v=2` query parameter

## Updates

To update the site:

```bash
# Make changes
npm run build

# Copy to docs
rm -rf docs
cp -r dist docs

# Commit and push
git add .
git commit -m "Update site"
git push origin main
```

GitHub Pages will automatically redeploy.
