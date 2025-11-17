# Deployment Guide

## GitHub Actions CI/CD Pipeline

### Required GitHub Secrets

Configure the following secrets in your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

1. **VPS_SSH_KEY**
   - Private SSH key for VPS access
   - Generate with: `ssh-keygen -t rsa -b 4096 -C "github-actions"`
   - Copy private key content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

2. **VPS_USER**
   - SSH user for VPS (typically `root` or `deploy`)
   - Value: `root`

3. **VPS_HOST**
   - VPS IP address
   - Value: `46.202.147.75`

### SSH Key Setup on VPS

1. Generate SSH key pair (if not already done):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   ```

2. Copy public key to VPS:
   ```bash
   ssh-copy-id -i ~/.ssh/id_rsa.pub root@46.202.147.75
   ```

3. Test SSH connection:
   ```bash
   ssh root@46.202.147.75
   ```

### Deployment Process

The GitHub Actions workflow automatically:
1. Triggers on push to `main` branch
2. Checks out the code
3. Sets up SSH access
4. Connects to VPS
5. Pulls latest code from GitHub
6. Stops running containers
7. Builds new Docker images
8. Starts containers
9. Runs database migrations

### Manual Deployment

If you need to deploy manually:

```bash
# SSH into VPS
ssh root@46.202.147.75

# Navigate to project directory
cd /var/www/digitaldog-website

# Pull latest code
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations
docker-compose exec -T nextjs npx prisma migrate deploy
```

### Troubleshooting

**Deployment fails:**
- Check GitHub Actions logs for errors
- Verify SSH key is correctly configured
- Ensure VPS has Docker and docker-compose installed
- Verify project directory exists on VPS

**Containers not starting:**
- Check logs: `docker-compose logs`
- Verify environment variables are set
- Check database connection

**Migrations failing:**
- Verify DATABASE_URL is correct
- Check database is accessible
- Review migration files

