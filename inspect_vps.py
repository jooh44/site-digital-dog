import paramiko
import os

key_content = """-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZWQy
NTUxOQAAACCyh9AF7NROg9CKCeV2zmOxB7e2vAAYBNF+LFV/se/SKwAAAJCMOf4SjDn+EgAA
AAtzc2gtZWQyNTUxOQAAACCyh9AF7NROg9CKCeV2zmOxB7e2vAAYBNF+LFV/se/SKwAAAEBT
n9sKcfe0wgJk+3deC7Bc1xBGhk7DO4OMBagGHftNTrKH0AXs1E6D0IoJ5XbOY7EHt7a8ABgE
0X4sVX+x79IrAAAAB2Nvb2xpZnkBAgMEBQY=
-----END OPENSSH PRIVATE KEY-----"""

key_path = "/home/johny/Documentos/projetos/digital-dog/vps_key"
with open(key_path, "w") as f:
    f.write(key_content)

os.chmod(key_path, 0o600)

host = "46.202.147.75"
user = "root"

try:
    key = paramiko.Ed25519Key.from_private_key_file(key_path)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print("Connecting with provided key...")
    client.connect(host, username=user, pkey=key)
    
    # Inspect labels to find the configured port
    cmd = "docker ps --format '{{.ID}}' --filter name=nextjs | xargs docker inspect --format '{{json .Config.Labels}}'"
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode()
    print(f"--- Container Labels ---\n{out}")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
