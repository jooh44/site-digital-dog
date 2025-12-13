import paramiko

host = "46.202.147.75"
user = "root"
password = "l0NNEhmoI#Guvtr0Eb5."

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, username=user, password=password)
    print("Connected successfully.")
    
    commands = [
        "docker ps --format '{{.Names}} | {{.Image}} | {{.Ports}}'",
        "netstat -tulpn | grep :80",
        "curl -I localhost:80 || echo 'Curl failed'"
    ]
    
    for cmd in commands:
        print(f"\n--- Output of: {cmd} ---")
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        err = stderr.read().decode()
        if err:
            print(f"Error output: {err}")

except Exception as e:
    print(f"Connection Error: {e}")
finally:
    client.close()
