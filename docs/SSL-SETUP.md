# SSL Certificate Setup Guide

## Let's Encrypt with Certbot

### Prerequisites

- Domain DNS pointing to VPS IP (46.202.147.75)
- Nginx running and accessible
- Ports 80 and 443 open in firewall

### Installation Steps

1. **Install Certbot:**
   ```bash
   ssh root@46.202.147.75
   apt-get update
   apt-get install -y certbot python3-certbot-nginx
   ```

2. **Generate SSL Certificate:**
   ```bash
   certbot --nginx -d digitaldog.pet -d www.digitaldog.pet
   ```

3. **Verify Auto-Renewal:**
   ```bash
   certbot renew --dry-run
   ```

### Certificate Location

Certificates are stored at:
- `/etc/letsencrypt/live/digitaldog.pet/fullchain.pem`
- `/etc/letsencrypt/live/digitaldog.pet/privkey.pem`

### Update Nginx Configuration

After certificates are generated, update `nginx.conf`:

```nginx
ssl_certificate /etc/letsencrypt/live/digitaldog.pet/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/digitaldog.pet/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
```

### Docker Volume Mount

Update `docker-compose.yml` to mount Let's Encrypt certificates:

```yaml
nginx:
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

### Testing SSL

```bash
# Test SSL certificate
openssl s_client -connect digitaldog.pet:443 -servername digitaldog.pet

# Check certificate expiration
certbot certificates
```

### Troubleshooting

**Certificate generation fails:**
- Verify DNS is pointing to VPS IP
- Ensure port 80 is accessible
- Check Nginx is running

**Auto-renewal not working:**
- Verify cron job: `systemctl status certbot.timer`
- Test renewal: `certbot renew --dry-run`

