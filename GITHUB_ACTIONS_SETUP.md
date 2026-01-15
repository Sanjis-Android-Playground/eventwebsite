# 🚀 GitHub Actions Auto-Deployment Setup Guide

This guide will help you set up automatic deployment to your VPS whenever you push to GitHub.

## 📋 Prerequisites

- GitHub repository with your code
- SSH access to your VPS
- VPS with Nginx already configured

## 🔐 Step 1: Generate SSH Key for GitHub Actions

On your **local machine** (not VPS), run:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
```

This creates two files:
- `~/.ssh/github_actions_deploy` (private key) - for GitHub Secrets
- `~/.ssh/github_actions_deploy.pub` (public key) - for VPS

## 🔑 Step 2: Add Public Key to VPS

Copy the public key to your VPS:

```bash
# Display the public key
cat ~/.ssh/github_actions_deploy.pub

# Copy it, then on your VPS:
ssh username@your_vps_ip
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key on a new line
# Save and exit (Ctrl+X, Y, Enter)

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## 🔒 Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

### SSH_PRIVATE_KEY
```bash
# Get the private key content:
cat ~/.ssh/github_actions_deploy
```
Copy the **entire output** (including `-----BEGIN ... KEY-----` and `-----END ... KEY-----`) and paste it as the value.

### VPS_HOST
```
144.24.140.245
```

### VPS_USER
```
ubuntu
```
(or your actual VPS username)

### DEPLOY_PATH
```
/var/www/bangladesh-events
```

## 📝 Summary of Secrets

| Secret Name | Value | Example |
|------------|-------|---------|
| `SSH_PRIVATE_KEY` | Your private SSH key | Copy from `~/.ssh/github_actions_deploy` |
| `VPS_HOST` | VPS IP address | `144.24.140.245` |
| `VPS_USER` | VPS username | `ubuntu` |
| `DEPLOY_PATH` | Website directory path | `/var/www/bangladesh-events` |

## ✅ Step 4: Test the Deployment

1. Make a small change to your website (e.g., edit `README.md`)
2. Commit and push:
```bash
git add .
git commit -m "Test auto-deployment"
git push origin main
```

3. Go to your GitHub repository → **Actions** tab
4. Watch the deployment workflow run
5. Check your website: `http://144.24.140.245:6969`

## 🎯 How It Works

Every time you push to the `main` branch:

1. ✅ GitHub Actions checks out your code
2. ✅ Connects to your VPS via SSH
3. ✅ Syncs all files using rsync
4. ✅ Sets proper permissions
5. ✅ Reloads Nginx
6. ✅ Your website is updated!

## 🔧 Manual Deployment Trigger

You can also trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to VPS** workflow
3. Click **Run workflow**
4. Choose the branch and click **Run workflow**

## 🐛 Troubleshooting

### Deployment fails with "Permission denied"
```bash
# On your VPS, check authorized_keys:
cat ~/.ssh/authorized_keys
# Ensure the public key is there

# Check permissions:
ls -la ~/.ssh/
# Should be: drwx------ (700) for .ssh
# Should be: -rw------- (600) for authorized_keys
```

### Nginx doesn't reload
```bash
# On your VPS:
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### rsync fails
```bash
# Make sure rsync is installed on VPS:
sudo apt install rsync -y
```

## 🎨 Customizing the Workflow

Edit `.github/workflows/deploy.yml` to:
- Change when deployment triggers
- Add additional build steps
- Send notifications (Slack, Discord, etc.)
- Run tests before deployment

## 🔄 Workflow File Location

The workflow file is at: `.github/workflows/deploy.yml`

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Action Documentation](https://github.com/webfactory/ssh-agent)
- [Rsync Documentation](https://rsync.samba.org/)

## 🎉 Success!

Once set up, you can simply:
```bash
git add .
git commit -m "Update website"
git push
```

And your website will automatically update! 🚀

---

**Security Tips:**
- ✅ Never commit private keys to your repository
- ✅ Use GitHub Secrets for sensitive data
- ✅ Regularly rotate your SSH keys
- ✅ Use dedicated SSH keys for deployments
- ✅ Limit SSH key permissions on VPS
