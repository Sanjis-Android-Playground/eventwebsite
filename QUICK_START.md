# 🚀 Quick Start Guide

## Fastest Way to Get Your Website Live

### 1️⃣ Test Locally (30 seconds)

```bash
# Open index.html in your browser
# OR use Python to run a local server:
python -m http.server 8000
```

Then visit: `http://localhost:8000`

### 2️⃣ Push to GitHub (2 minutes)

```bash
# Initialize and push
git init
git add .
git commit -m "Initial commit: Bangladesh Events website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bangladesh-events.git
git push -u origin main
```

### 3️⃣ Deploy to VPS (5 minutes)

**Edit deploy.sh first:**
- Line 7: `DEPLOY_USER="your_username"`
- Line 8: `DEPLOY_HOST="your_vps_ip"`
- Line 10: `DOMAIN_NAME="example.com"`

**Then deploy:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4️⃣ Set Up SSL (2 minutes)

```bash
# On your VPS:
ssh username@your_vps_ip
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com
```

**Done! 🎉**

---

## Don't Have a VPS Yet?

### Recommended Providers:

1. **DigitalOcean** ($4/mo) - https://digitalocean.com
2. **Vultr** ($2.50/mo) - https://vultr.com
3. **Linode** ($5/mo) - https://linode.com

### What to Choose:
- **OS:** Ubuntu 22.04 LTS
- **Plan:** Basic/Shared CPU
- **Size:** 1GB RAM (enough for this site)

---

## Alternative: Free Hosting Options

### GitHub Pages (Free, but static only)
```bash
# Create gh-pages branch
git checkout -b gh-pages
git push origin gh-pages

# Enable in GitHub repo settings
# Your site will be at: https://USERNAME.github.io/bangladesh-events
```

### Netlify (Free)
1. Sign up at https://netlify.com
2. Connect your GitHub repo
3. Deploy automatically on every push

### Vercel (Free)
1. Sign up at https://vercel.com
2. Import your GitHub repo
3. Auto-deploys on commit

---

## Need Help?

📖 Full documentation: See [README.md](README.md)

🐛 Issues? Check [Troubleshooting section](README.md#troubleshooting)

💬 Questions? Open an issue on GitHub
