#

import socket
import requests
import time

# Server details
SERVER_HOST = '[REDACTED]'
SERVER_PORT = 6969  # The port your game server is running on

# Discord webhook details
DISCORD_WEBHOOK_URL = '[REDACTED]'

def check_port(host, port):
    """Checks if the specified port on the server is open."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(3)  # Set a timeout of 3 seconds
        result = sock.connect_ex((host, port))
        return result == 0  # Returns True if the port is open, False otherwise

def post_server_status(is_online):
    """Posts the server status to Discord."""
    status_message = "🟢 **Server is ONLINE**" if is_online else "🔴 **Server is OFFLINE**"

    data = {
        "content": status_message
    }

    response = requests.post(DISCORD_WEBHOOK_URL, json=data)
    if response.status_code == 200:
        print("Server status posted to Discord.")
    else:
        print(f"Failed to post status. Status code: {response.status_code}, response: {response.text}")

def main():
    while True:
        # Check if the server port is open (meaning the server is online)
        is_online = check_port(SERVER_HOST, SERVER_PORT)

        # Post the server status to Discord
        post_server_status(is_online)

        # Sleep for a while before checking again (e.g., every 5 minutes)
        time.sleep(300)

if __name__ == "__main__":
    main()
