import paramiko

host = "46.202.147.75"
user = "root"
password = "l0NNEhmoI#Guvtr0Eb5."

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, username=user, password=password)
    # Get the container ID for the nextjs app from the previous output logic or just grep it dynamically
    # The name observed was nextjs-gk4kgsokwccgkwogcko0ggck-160557470568
    cmd = "docker logs nextjs-gk4kgsokwccgkwogcko0ggck-160557470568 --tail 50"
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    print(f"--- Application Logs ---\n{out}")
    if err:
        print(f"--- Stderr ---\n{err}")

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
