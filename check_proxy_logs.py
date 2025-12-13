import paramiko

key_path = "/home/johny/Documentos/projetos/digital-dog/vps_key"
host = "46.202.147.75"
user = "root"

try:
    key = paramiko.Ed25519Key.from_private_key_file(key_path)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print("Connecting...")
    client.connect(host, username=user, pkey=key)
    
    cmd = "docker logs coolify-proxy --tail 50"
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print(f"--- Traefik Logs ---\n{out}")
    if err:
        print(f"--- Stderr ---\n{err}")

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
