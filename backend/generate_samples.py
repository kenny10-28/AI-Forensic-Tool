import pandas as pd
import numpy as np
import os
import json

def generate_sample_logs(filename="clean_logs.csv", num_entries=1000, anomalous=False):
    timestamps = pd.date_range(start="2024-01-01", periods=num_entries, freq='min')
    users = ["admin", "guest", "user1", "user2", "backup_svc"]
    events = ["login_success", "file_read", "file_write", "connection_established", "logout"]
    ip_addresses = ["192.168.1.10", "192.168.1.11", "10.0.0.5", "172.16.0.2"]
    
    data = []
    for i in range(num_entries):
        entry = {
            "timestamp": timestamps[i].isoformat(),
            "user": np.random.choice(users),
            "event": np.random.choice(events),
            "ip": np.random.choice(ip_addresses),
            "file_access": f"/var/www/html/index_{np.random.randint(1, 10)}.html",
            "bytes_transferred": np.random.randint(100, 5000)
        }
        
        if anomalous and i % 50 == 0:
            # Inject anomalies
            entry["user"] = "unknown_attacker"
            entry["event"] = "login_failure"
            entry["bytes_transferred"] = np.random.randint(50000, 100000)
            entry["ip"] = "8.8.8.8"
            
        data.append(entry)
        
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False)
    print(f"Generated {filename}")

if __name__ == "__main__":
    os.makedirs("sample_data", exist_ok=True)
    generate_sample_logs("sample_data/clean_logs.csv", num_entries=500, anomalous=False)
    generate_sample_logs("sample_data/evidence_logs.csv", num_entries=500, anomalous=True)
