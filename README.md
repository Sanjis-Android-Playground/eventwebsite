# 🇧🇩 Bangladesh Events Chronicle

A responsive, modern website documenting recent events and developments in Bangladesh, including the 2024 political transformation, student-led movements, and ongoing reforms.

![Website Preview](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Deployment Guide](#deployment-guide)
  - [Prerequisites](#prerequisites)
  - [Method 1: Manual Deployment](#method-1-manual-deployment)
  - [Method 2: Automated Deployment Script](#method-2-automated-deployment-script)
- [GitHub Setup](#github-setup)
- [VPS Configuration](#vps-configuration)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Domain Configuration](#domain-configuration)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 📱 **Fully Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast Loading** - Optimized HTML, CSS, and JavaScript for quick page loads
- 🎨 **Modern UI/UX** - Clean, professional design with smooth animations
- 📅 **Interactive Timeline** - Visual representation of key events
- 🔍 **SEO Optimized** - Meta tags and semantic HTML for better search visibility
- 🌐 **Cross-browser Compatible** - Works on all modern browsers
- ♿ **Accessible** - WCAG compliant for better accessibility
- 🚀 **Easy to Deploy** - Simple deployment process with included scripts

## 📁 Project Structure

```
bangladesh-events/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Stylesheet with responsive design
├── js/
│   └── script.js       # JavaScript for interactivity
├── nginx.conf          # Nginx configuration file
├── deploy.sh           # Automated deployment script
├── .gitignore          # Git ignore file
├── LICENSE             # MIT License
└── README.md           # This file
```

## 💻 Local Development

### Quick Start

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/bangladesh-events.git
   cd bangladesh-events
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Visit** `http://localhost:8000` in your browser

## 🚀 Deployment Guide

### Prerequisites

Before deploying, ensure you have:

- ✅ A VPS (Virtual Private Server) running Ubuntu/Debian
- ✅ SSH access to your VPS
- ✅ A domain name (optional, but recommended)
- ✅ Basic command line knowledge

### Method 1: Manual Deployment

#### Step 1: Prepare Your VPS

1. **Connect to your VPS via SSH:**
   ```bash
   ssh username@your_vps_ip
   ```

2. **Update system packages:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Nginx:**
   ```bash
   sudo apt install nginx -y
   ```

4. **Install Git (if needed):**
   ```bash
   sudo apt install git -y
   ```

#### Step 2: Upload Website Files

**Option A: Using Git (Recommended)**

```bash
# On your VPS
cd /var/www
sudo git clone https://github.com/yourusername/bangladesh-events.git
sudo chown -R www-data:www-data bangladesh-events
sudo chmod -R 755 bangladesh-events
```

**Option B: Using SCP from your local machine**

```bash
# From your local machine
scp -r ./* username@your_vps_ip:/tmp/bangladesh-events
```

Then on your VPS:
```bash
sudo mv /tmp/bangladesh-events /var/www/
sudo chown -R www-data:www-data /var/www/bangladesh-events
sudo chmod -R 755 /var/www/bangladesh-events
```

**Option C: Using SFTP**

Use an SFTP client like FileZilla:
- Host: your_vps_ip
- Username: your_username
- Password: your_password
- Upload all files to `/var/www/bangladesh-events`

#### Step 3: Configure Nginx

1. **Create Nginx configuration file:**
   ```bash
   sudo nano /etc/nginx/sites-available/bangladesh-events
   ```

2. **Copy the contents from `nginx.conf` in this repository**

3. **Update the configuration:**
   - Replace `example.com` with your domain name
   - Verify the path `/var/www/bangladesh-events` is correct

4. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/bangladesh-events /etc/nginx/sites-enabled/
   ```

5. **Test Nginx configuration:**
   ```bash
   sudo nginx -t
   ```

6. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

7. **Enable Nginx to start on boot:**
   ```bash
   sudo systemctl enable nginx
   ```

#### Step 4: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Method 2: Automated Deployment Script

1. **Edit the `deploy.sh` file:**
   ```bash
   nano deploy.sh
   ```

2. **Update these variables:**
   ```bash
   DEPLOY_USER="your_username"        # Your VPS username
   DEPLOY_HOST="your_vps_ip"         # Your VPS IP address
   DEPLOY_PATH="/var/www/bangladesh-events"
   DOMAIN_NAME="example.com"          # Your domain name
   ```

3. **Make the script executable:**
   ```bash
   chmod +x deploy.sh
   ```

4. **Run the deployment:**
   ```bash
   ./deploy.sh
   ```

The script will:
- Create necessary directories
- Upload all files via rsync
- Set proper permissions
- Configure Nginx
- Reload the web server

## 📦 GitHub Setup

### Initial Repository Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `bangladesh-events` or your preferred name
   - Choose public or private
   - Don't initialize with README (we already have one)

2. **Initialize local repository and push:**
   ```bash
   # In your project directory
   git init
   git add .
   git commit -m "Initial commit: Bangladesh Events website"
   git branch -M main
   git remote add origin https://github.com/yourusername/bangladesh-events.git
   git push -u origin main
   ```

### Updating Your Website

After making changes:

```bash
git add .
git commit -m "Description of your changes"
git push origin main
```

Then redeploy to your VPS:
```bash
# On your VPS
cd /var/www/bangladesh-events
sudo git pull origin main
```

Or use the deployment script from your local machine.

## 🔧 VPS Configuration

### Recommended VPS Providers

- **DigitalOcean** - Starting at $4/month
- **Linode** - Starting at $5/month
- **Vultr** - Starting at $2.50/month
- **AWS Lightsail** - Starting at $3.50/month
- **Hetzner** - Starting at €4/month

### Minimum Requirements

- 1 CPU core
- 512 MB RAM
- 10 GB storage
- Ubuntu 20.04 LTS or newer (recommended)

### Initial VPS Security Setup

```bash
# Create a new sudo user (replace 'username' with your desired username)
adduser username
usermod -aG sudo username

# Set up SSH key authentication (from your local machine)
ssh-copy-id username@your_vps_ip

# Disable root login (on VPS)
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no
sudo systemctl restart sshd

# Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 🔒 SSL Certificate Setup

### Using Let's Encrypt (Free SSL)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d example.com -d www.example.com
   ```

3. **Follow the prompts:**
   - Enter your email address
   - Agree to terms of service
   - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

4. **Test automatic renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

The certificate will auto-renew before expiration.

### Manual SSL Setup

If you have your own SSL certificate:

1. **Copy certificate files to VPS:**
   ```bash
   sudo mkdir -p /etc/ssl/certs
   sudo mkdir -p /etc/ssl/private
   ```

2. **Update Nginx configuration:**
   ```nginx
   ssl_certificate /etc/ssl/certs/your_certificate.crt;
   ssl_certificate_key /etc/ssl/private/your_private.key;
   ```

## 🌐 Domain Configuration

### Point Domain to Your VPS

1. **Log in to your domain registrar** (GoDaddy, Namecheap, Cloudflare, etc.)

2. **Add A records:**
   ```
   Type: A
   Name: @
   Value: your_vps_ip
   TTL: 3600 (or automatic)

   Type: A
   Name: www
   Value: your_vps_ip
   TTL: 3600 (or automatic)
   ```

3. **Wait for DNS propagation** (can take 1-48 hours)

4. **Check DNS propagation:**
   ```bash
   # On your local machine
   nslookup example.com
   # Or use: https://www.whatsmydns.net/
   ```

### Using Cloudflare (Recommended)

Benefits: Free CDN, DDoS protection, faster loading times

1. **Add your site to Cloudflare**
2. **Update nameservers at your registrar**
3. **Configure SSL/TLS mode to "Full"**
4. **Enable "Always Use HTTPS"**

## 🔄 Maintenance

### Regular Updates

```bash
# Update website content
cd /var/www/bangladesh-events
sudo git pull origin main

# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart Nginx if needed
sudo systemctl restart nginx
```

### Monitoring

**Check Nginx status:**
```bash
sudo systemctl status nginx
```

**View access logs:**
```bash
sudo tail -f /var/log/nginx/bangladesh-events-access.log
```

**View error logs:**
```bash
sudo tail -f /var/log/nginx/bangladesh-events-error.log
```

### Backup

**Create a backup script:**
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/home/username/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/website_$DATE.tar.gz /var/www/bangladesh-events
# Keep only last 7 backups
find $BACKUP_DIR -name "website_*.tar.gz" -mtime +7 -delete
```

**Set up automatic backups with cron:**
```bash
crontab -e
# Add: 0 2 * * * /home/username/backup.sh
```

## 🐛 Troubleshooting

### Common Issues

**1. Website not loading**
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# Check firewall
sudo ufw status

# Check DNS
nslookup your-domain.com
```

**2. Permission denied errors**
```bash
sudo chown -R www-data:www-data /var/www/bangladesh-events
sudo chmod -R 755 /var/www/bangladesh-events
```

**3. CSS/JS not loading**
- Check browser console for errors
- Verify file paths in index.html
- Clear browser cache
- Check Nginx error logs

**4. 502 Bad Gateway**
```bash
# Restart Nginx
sudo systemctl restart nginx

# Check for configuration errors
sudo nginx -t
```

**5. SSL certificate issues**
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Getting Help

- Check Nginx error logs: `/var/log/nginx/error.log`
- Check system logs: `sudo journalctl -xe`
- Test website: https://www.webpagetest.org/
- Validate HTML: https://validator.w3.org/
- Check SSL: https://www.ssllabs.com/ssltest/

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bangladesh's brave students and citizens who made history
- All those working toward positive change in Bangladesh
- The open-source community for tools and resources

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note:** This website is for educational and informational purposes. Please verify information with official sources and reputable news organizations.

**Last Updated:** January 2025

---

Made with ❤️ for Bangladesh 🇧🇩
