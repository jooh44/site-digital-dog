import paramiko
import json

key_path = "/home/johny/Documentos/projetos/digital-dog/vps_key"
host = "46.202.147.75"
user = "root"

try:
    key = paramiko.Ed25519Key.from_private_key_file(key_path)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print("Connecting...")
    client.connect(host, username=user, pkey=key)
    
    # Get ID of nextjs container
    cmd_id = "docker ps --format '{{.ID}}' --filter name=nextjs"
    stdin, stdout, stderr = client.exec_command(cmd_id)
    app_id = stdout.read().decode().strip()
    
    if not app_id:
        print("App container not found.")
        exit(1)
        
    print(f"App ID: {app_id}")
    
    # Inspect App Networks
    cmd_app = f"docker inspect {app_id} --format '{{{{json .NetworkSettings.Networks}}}}'"
    stdin, stdout, stderr = client.exec_command(cmd_app)
    app_nets = json.loads(stdout.read().decode())
    print(f"App Networks: {list(app_nets.keys())}")
    
    # Inspect Proxy Networks
    cmd_proxy = "docker inspect coolify-proxy --format '{{json .NetworkSettings.Networks}}'"
    stdin, stdout, stderr = client.exec_command(cmd_proxy)
    proxy_nets_raw = stdout.read().decode().strip()
    if proxy_nets_raw:
        proxy_nets = json.loads(proxy_nets_raw)
        print(f"Proxy Networks: {list(proxy_nets.keys())}")
    else:
        print("Proxy container not found or no networks.")

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
