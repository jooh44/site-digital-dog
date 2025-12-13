import paramiko

host = "46.202.147.75"
user = "root"
password = "l0NNEhmoI#Guvtr0Eb5."

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, username=user, password=password)
    print("Connected. Stopping 'digitaldog-nextjs'...")
    
    cmd = "docker stop digitaldog-nextjs && docker rm digitaldog-nextjs"
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print(f"Output: {out}")
    if err:
        print(f"Error (or warning): {err}")
    
    print("Container stopped/removed successfully.")

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
