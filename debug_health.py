import paramiko
import json

key_path = "/home/johny/Documentos/projetos/digital-dog/vps_key"
host = "46.202.147.75"
user = "root"

try:
    key = paramiko.Ed25519Key.from_private_key_file(key_path)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    client.connect(host, username=user, pkey=key)
    
    # Get ID
    cmd_id = "docker ps -q --filter name=nextjs"
    stdin, stdout, stderr = client.exec_command(cmd_id)
    cid = stdout.read().decode().strip().split('\n')[0]
    
    if cid:
        print(f"--- Health Status for {cid} ---")
        cmd_inspect = f"docker inspect {cid} --format '{{{{json .State.Health}}}}'"
        stdin, stdout, stderr = client.exec_command(cmd_inspect)
        health_json = stdout.read().decode()
        try:
            health = json.loads(health_json)
            print(json.dumps(health, indent=2))
        except:
            print(health_json)

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
