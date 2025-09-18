# WSL2 Port Forwarding Setup Script
# Run this in Windows PowerShell as Administrator

# Add port forwarding rule
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.28.45.232

# Show current port forwarding rules
netsh interface portproxy show v4tov4

# Alternative: Reset Windows networking (if needed)
# netsh int ip reset
# netsh winsock reset