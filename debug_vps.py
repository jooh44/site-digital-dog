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
    
    # Check docker ps to see if it's restarting or healthy
    print("--- Docker PS ---")
    cmd_ps = "docker ps --filter name=nextjs --format '{{.ID}} | {{.Names}} | {{.Status}} | {{.Ports}}'"
    stdin, stdout, stderr = client.exec_command(cmd_ps)
    print(stdout.read().decode())
    
    # Get ID
    cmd_id = "docker ps -q --filter name=nextjs"
    stdin, stdout, stderr = client.exec_command(cmd_id)
    cid = stdout.read().decode().strip().split('\n')[0] # get first one if multiple (shouldn't be)
    
    if cid:
        print(f"--- Labels for {cid} ---")
        cmd_inspect = f"docker inspect {cid} --format '{{{{json .Config.Labels}}}}'"
        stdin, stdout, stderr = client.exec_command(cmd_inspect)
        labels_json = stdout.read().decode()
        try:
            labels = json.loads(labels_json)
            # formatted print
            print(json.dumps(labels, indent=2))
        except:
            print(labels_json)

        print("\n--- Recent Logs ---")
        cmd_logs = f"docker logs {cid} --tail 20"
        stdin, stdout, stderr = client.exec_command(cmd_logs)
        print(stdout.read().decode())
        print(stderr.read().decode())

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
