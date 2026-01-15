# ✅ Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

- [ ] Test website locally (open `index.html` in browser)
- [ ] Verify all links work correctly
- [ ] Test on mobile device or responsive mode
- [ ] Check browser console for errors
- [ ] Review content for accuracy

## GitHub Setup

- [ ] Create GitHub repository
- [ ] Update `deploy.sh` with your details
- [ ] Update `nginx.conf` with your domain name
- [ ] Update `README.md` with your GitHub username
- [ ] Initialize git repository
- [ ] Push to GitHub main branch

## VPS Preparation

- [ ] Purchase/set up VPS
- [ ] Get VPS IP address
- [ ] Set up SSH access
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Install Nginx: `sudo apt install nginx -y`
- [ ] Configure firewall: `sudo ufw allow 'Nginx Full'`
- [ ] Create deployment directory: `/var/www/bangladesh-events`

## Domain Configuration

- [ ] Purchase domain (or use existing)
- [ ] Add A record: `@` → `your_vps_ip`
- [ ] Add A record: `www` → `your_vps_ip`
- [ ] Wait for DNS propagation (check with `nslookup`)
- [ ] Test domain access: `http://yourdomain.com`

## Deployment

- [ ] Edit `deploy.sh` with correct credentials
- [ ] Make script executable: `chmod +x deploy.sh`
- [ ] Run deployment: `./deploy.sh`
- [ ] Verify files uploaded to VPS
- [ ] Check Nginx configuration: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Test website in browser

## SSL Setup

- [ ] Install Certbot: `sudo apt install certbot python3-certbot-nginx -y`
- [ ] Obtain certificate: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`
- [ ] Enable HTTPS redirect (Certbot will ask)
- [ ] Test auto-renewal: `sudo certbot renew --dry-run`
- [ ] Visit `https://yourdomain.com` to verify SSL

## Post-Deployment

- [ ] Test website on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Check page loading speed: https://pagespeed.web.dev/
- [ ] Verify SSL certificate: https://www.ssllabs.com/ssltest/
- [ ] Set up monitoring/analytics (optional)
- [ ] Create backup script
- [ ] Document any custom configurations

## Optional Enhancements

- [ ] Set up Cloudflare CDN
- [ ] Configure automatic backups
- [ ] Add Google Analytics or similar
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Enable Gzip compression (already in nginx.conf)
- [ ] Configure fail2ban for security
- [ ] Set up automatic security updates

## Regular Maintenance

- [ ] Check error logs weekly: `/var/log/nginx/bangladesh-events-error.log`
- [ ] Update system packages monthly: `sudo apt update && apt upgrade`
- [ ] Verify SSL certificate renewal (auto-renews)
- [ ] Update website content as needed
- [ ] Review and respond to user feedback

---

## Quick Reference Commands

### Check Website Status
```bash
sudo systemctl status nginx
curl -I http://yourdomain.com
```

### View Logs
```bash
sudo tail -f /var/log/nginx/bangladesh-events-access.log
sudo tail -f /var/log/nginx/bangladesh-events-error.log
```

### Update Website
```bash
cd /var/www/bangladesh-events
sudo git pull origin main
sudo systemctl reload nginx
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

---

**Need help?** See [README.md](README.md) for detailed instructions.
