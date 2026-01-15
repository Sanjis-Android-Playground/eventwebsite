#!/bin/bash

# Bangladesh Events Website Deployment Script
# This script automates the deployment process to your VPS

echo "🇧🇩 Bangladesh Events - Deployment Script"
echo "=========================================="

# Configuration
DEPLOY_USER="your_username"
DEPLOY_HOST="your_vps_ip"
DEPLOY_PATH="/var/www/bangladesh-events"
DOMAIN_NAME="example.com"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will deploy the website to your VPS${NC}"
echo ""
echo "Please ensure you have:"
echo "  1. SSH access to your VPS"
echo "  2. Nginx installed on your VPS"
echo "  3. Correct permissions for the deployment directory"
echo ""

# Prompt for confirmation
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ] && [ ! -f ~/.ssh/id_ed25519 ]; then
    echo -e "${YELLOW}Warning: No SSH key found. You may need to enter your password.${NC}"
fi

# Create deployment directory on VPS
echo -e "${GREEN}Creating deployment directory...${NC}"
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "sudo mkdir -p ${DEPLOY_PATH} && sudo chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_PATH}"

# Upload files to VPS
echo -e "${GREEN}Uploading files...${NC}"
rsync -avz --delete \
    --exclude='.git' \
    --exclude='.gitignore' \
    --exclude='deploy.sh' \
    --exclude='README.md' \
    --exclude='nginx.conf' \
    --exclude='tmp_*' \
    ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

# Set proper permissions
echo -e "${GREEN}Setting permissions...${NC}"
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "sudo chmod -R 755 ${DEPLOY_PATH}"

# Configure Nginx (if needed)
echo -e "${GREEN}Configuring Nginx...${NC}"
scp nginx.conf ${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/bangladesh-events.conf
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "sudo mv /tmp/bangladesh-events.conf /etc/nginx/sites-available/bangladesh-events && \
    sudo sed -i 's/example.com/${DOMAIN_NAME}/g' /etc/nginx/sites-available/bangladesh-events && \
    sudo sed -i 's|/var/www/bangladesh-events|${DEPLOY_PATH}|g' /etc/nginx/sites-available/bangladesh-events && \
    sudo ln -sf /etc/nginx/sites-available/bangladesh-events /etc/nginx/sites-enabled/ && \
    sudo nginx -t && sudo systemctl reload nginx"

echo ""
echo -e "${GREEN}=========================================="
echo -e "✅ Deployment completed successfully!"
echo -e "==========================================${NC}"
echo ""
echo "Your website should now be accessible at: http://${DOMAIN_NAME}"
echo ""
echo "Next steps:"
echo "  1. Configure DNS to point to your VPS IP"
echo "  2. Set up SSL certificate with Let's Encrypt (see README.md)"
echo "  3. Test your website"

exit 0
