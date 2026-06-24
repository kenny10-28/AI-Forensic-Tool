import pandas as pd
import json
import os
from typing import List, Dict

class LogParser:
    def parse(self, file_path: str) -> pd.DataFrame:
        extension = os.path.splitext(file_path)[1].lower()
        
        if extension == '.csv':
            return pd.read_csv(file_path)
        elif extension == '.json':
            with open(file_path, 'r') as f:
                data = json.load(f)
            return pd.DataFrame(data)
        elif extension == '.log':
            # Basic fallback for linux auth-style logs or similar
            return self._parse_raw_log(file_path)
        else:
            raise ValueError(f"Unsupported file format: {extension}")

    def _parse_raw_log(self, file_path: str) -> pd.DataFrame:
        # Simple heuristic parser for text logs
        lines = []
        with open(file_path, 'r') as f:
            for line in f:
                # Basic space-separated splitting as a starting point
                parts = line.split()
                if len(parts) >= 3:
                    lines.append({
                        "timestamp": " ".join(parts[:3]),
                        "host": parts[3] if len(parts) > 3 else "unknown",
                        "message": " ".join(parts[4:]) if len(parts) > 4 else ""
                    })
        return pd.DataFrame(lines)
