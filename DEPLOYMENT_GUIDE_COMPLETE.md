# 🚀 Complete Deployment Guide - Bangladesh Events Website

## 📑 Table of Contents
1. [Quick Overview](#quick-overview)
2. [Manual Deployment](#manual-deployment)
3. [Auto-Deployment with GitHub Actions](#auto-deployment-with-github-actions)
4. [Adding Placeholder Images](#adding-placeholder-images)
5. [Testing](#testing)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Overview

Your website is already LIVE at: **http://144.24.140.245:6969**

### What's New? ✨
- 🎨 **Professional UI** with modern design
- 🌙 **Dark Mode** toggle
- 📸 **Image Gallery** with filters and modal
- 📧 **Contact Form** with validation
- 📊 **Animated Counters** in hero section
- 📱 **Fully Responsive** design
- 🚀 **GitHub Actions** for auto-deployment
- ⚡ **Performance Optimized**

---

## 🔧 Manual Deployment

If you need to deploy manually:

```bash
# Connect to your VPS
ssh ubuntu@144.24.140.245

# Navigate to your project
cd /var/www/bangladesh-events

# Pull latest changes
sudo git pull origin main

# Set permissions
sudo chmod -R 755 /var/www/bangladesh-events

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🤖 Auto-Deployment with GitHub Actions

### Current Status
✅ GitHub Actions workflow is configured in `.github/workflows/deploy.yml`

### Setup Steps

#### 1️⃣ Generate SSH Key (Local Machine)
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_bd
```

#### 2️⃣ Add Public Key to VPS
```bash
# Display public key
cat ~/.ssh/github_actions_bd.pub

# Copy it, then on VPS:
ssh ubuntu@144.24.140.245
nano ~/.ssh/authorized_keys
# Paste the public key on a new line
# Save (Ctrl+X, Y, Enter)

# Set permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

#### 3️⃣ Add GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `SSH_PRIVATE_KEY` | Content of `~/.ssh/github_actions_bd` (entire file) |
| `VPS_HOST` | `144.24.140.245` |
| `VPS_USER` | `ubuntu` |
| `DEPLOY_PATH` | `/var/www/bangladesh-events` |

To get private key content:
```bash
cat ~/.ssh/github_actions_bd
# Copy EVERYTHING including -----BEGIN and -----END lines
```

#### 4️⃣ Test Auto-Deployment
```bash
# Make a change
echo "Test deployment" >> README.md

# Commit and push
git add .
git commit -m "Test: GitHub Actions auto-deployment"
git push origin main

# Watch deployment:
# Go to GitHub → Actions tab
# Monitor the "Deploy to VPS" workflow
```

### How It Works 🔄

1. You push code to `main` branch
2. GitHub Actions triggers automatically
3. Connects to your VPS via SSH
4. Syncs files using rsync
5. Reloads Nginx
6. Website is updated! ✅

---

## 📸 Adding Placeholder Images

Your gallery needs 6 images. Here are your options:

### Option 1: Generate Placeholder Images (Quick)

1. **Open your website** in a browser
2. **Open Developer Console** (F12)
3. **Paste this code** and press Enter:

```javascript
const images = [
    { name: 'protest-1.jpg', text: 'Student Protests', color: '#006A4E' },
    { name: 'protest-2.jpg', text: 'University March', color: '#004d38' },
    { name: 'yunus.jpg', text: 'Dr. Muhammad Yunus', color: '#0066cc' },
    { name: 'celebration.jpg', text: 'Victory', color: '#F42A41' },
    { name: 'youth.jpg', text: 'Youth Power', color: '#9932CC' },
    { name: 'interim-govt.jpg', text: 'New Government', color: '#8B4513' }
];

images.forEach(img => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = img.color;
    ctx.fillRect(0, 0, 800, 600);
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(img.text, 400, 300);
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = img.name;
        a.click();
    });
});
console.log('✅ 6 placeholder images generated!');
```

4. **6 images will download** automatically
5. **Upload them to VPS:**

```bash
# On your local machine
scp *.jpg ubuntu@144.24.140.245:/tmp/

# On VPS
ssh ubuntu@144.24.140.245
sudo mv /tmp/*.jpg /var/www/bangladesh-events/images/
sudo chmod 644 /var/www/bangladesh-events/images/*.jpg
```

### Option 2: Use Real Images

1. Find relevant images (ensure you have rights to use them)
2. Resize to 800x600px for optimal performance
3. Name them exactly:
   - `protest-1.jpg`
   - `protest-2.jpg`
   - `yunus.jpg`
   - `celebration.jpg`
   - `youth.jpg`
   - `interim-govt.jpg`

4. Upload to VPS:
```bash
scp images/*.jpg ubuntu@144.24.140.245:/var/www/bangladesh-events/images/
```

### Option 3: Use Free Stock Photos

Visit these sites:
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)

Search for: "protest", "bangladesh", "youth activism", "government"

---

## 🧪 Testing

### Test Checklist

#### Desktop
- [ ] Homepage loads correctly
- [ ] Navigation works (smooth scroll)
- [ ] Dark mode toggle works
- [ ] Gallery filters work
- [ ] Gallery modal opens/closes
- [ ] Contact form submits
- [ ] All external links work
- [ ] Counter animation triggers
- [ ] Timeline displays correctly

#### Mobile
- [ ] Hamburger menu works
- [ ] All sections responsive
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] Gallery works on mobile

#### Performance
```bash
# Test loading speed
curl -o /dev/null -s -w "Time: %{time_total}s\n" http://144.24.140.245:6969

# Should be under 2 seconds
```

#### Browser Compatibility
Test on:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## 🔄 Maintenance

### Regular Updates

```bash
# Update content
vim index.html  # Edit content

# Commit changes
git add .
git commit -m "Update: [description]"
git push origin main

# If auto-deployment is set up, it updates automatically!
# Otherwise, pull on VPS:
ssh ubuntu@144.24.140.245 "cd /var/www/bangladesh-events && sudo git pull && sudo systemctl reload nginx"
```

### Check Logs
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/bangladesh-events-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/bangladesh-events-error.log

# System logs
sudo journalctl -u nginx -f
```

### Backup
```bash
# Create backup
ssh ubuntu@144.24.140.245 "sudo tar -czf ~/backup-$(date +%Y%m%d).tar.gz /var/www/bangladesh-events"

# Download backup
scp ubuntu@144.24.140.245:~/backup-*.tar.gz ./backups/
```

---

## 🐛 Troubleshooting

### Website Not Loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Check if port 6969 is listening
sudo netstat -tlnp | grep 6969
```

### Images Not Showing
```bash
# Check image permissions
ls -la /var/www/bangladesh-events/images/

# Fix permissions
sudo chmod 755 /var/www/bangladesh-events/images/
sudo chmod 644 /var/www/bangladesh-events/images/*
```

### Dark Mode Not Working
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Verify script.js loaded correctly

### Contact Form Not Submitting
- Check browser console for JavaScript errors
- Form currently shows success message (no backend yet)
- To connect to real backend, edit `js/script.js` (see comments in code)

### GitHub Actions Failing
```bash
# Check workflow status
# Go to: GitHub Repo → Actions tab

# Common issues:
# 1. SSH key not added correctly
# 2. Secrets not set properly
# 3. VPS firewall blocking SSH
# 4. Wrong file permissions
```

### Port 6969 Issues
```bash
# Check firewall
sudo ufw status

# Allow port 6969
sudo ufw allow 6969/tcp

# Check what's using the port
sudo lsof -i :6969
```

---

## 📊 Performance Optimization

Already implemented:
- ✅ Lazy loading images
- ✅ CSS/JS minification ready
- ✅ Gzip compression in Nginx
- ✅ Browser caching headers
- ✅ Optimized animations
- ✅ Debounced scroll events

### Optional: Add Cloudflare
1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers
4. Enable CDN and DDoS protection

---

## 🎨 Customization

### Change Colors
Edit `css/style.css`:
```css
:root {
    --primary-color: #006A4E;    /* Main green */
    --secondary-color: #F42A41;   /* Red accent */
    --accent-color: #FFD700;      /* Gold */
}
```

### Change Content
Edit `index.html`:
- Update text in sections
- Modify timeline events
- Change statistics

### Add New Features
1. Edit relevant files
2. Test locally
3. Push to GitHub
4. Auto-deploys to VPS!

---

## 📚 File Structure

```
bangladesh-events/
├── index.html                      # Main HTML file
├── css/
│   └── style.css                   # All styles + dark mode
├── js/
│   └── script.js                   # All JavaScript features
├── images/
│   ├── bd-flag.svg                 # Bangladesh flag icon
│   ├── protest-1.jpg               # Gallery images
│   ├── protest-2.jpg
│   ├── yunus.jpg
│   ├── celebration.jpg
│   ├── youth.jpg
│   └── interim-govt.jpg
├── .github/
│   └── workflows/
│       └── deploy.yml              # Auto-deployment config
├── README.md                       # Project documentation
├── GITHUB_ACTIONS_SETUP.md        # Detailed Actions guide
└── DEPLOYMENT_GUIDE_COMPLETE.md   # This file
```

---

## 🎯 Quick Commands Reference

```bash
# Connect to VPS
ssh ubuntu@144.24.140.245

# Navigate to project
cd /var/www/bangladesh-events

# Pull updates
sudo git pull origin main

# Reload Nginx
sudo systemctl reload nginx

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# View website
curl http://144.24.140.245:6969
```

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at http://144.24.140.245:6969
- [ ] All sections visible and working
- [ ] Navigation smooth scrolling works
- [ ] Dark mode toggle functional
- [ ] Gallery displays (with or without real images)
- [ ] Contact form shows success message
- [ ] Mobile responsive (test on phone)
- [ ] GitHub Actions configured (if desired)
- [ ] SSH keys set up for auto-deployment
- [ ] Backup created

---

## 🎉 Success!

Your Bangladesh Events Chronicle is now:
- ✅ Live and accessible
- ✅ Professional and modern
- ✅ Feature-rich
- ✅ Ready for auto-deployment
- ✅ Mobile-friendly
- ✅ Performance optimized

### Current Status
🌐 **Live URL:** http://144.24.140.245:6969
📦 **GitHub:** https://github.com/Sanjis-Android-Playground/eventwebsite
🚀 **Deployment:** Manual (Auto-deployment ready to enable)

---

## 📞 Need Help?

Common resources:
- [Nginx Documentation](https://nginx.org/en/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Made with ❤️ for Bangladesh 🇧🇩**

Last Updated: January 2025
