import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
from typing import List, Dict, Any

class ForensicAnalyzer:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.label_encoders = {}

    def _preprocess(self, df: pd.DataFrame) -> pd.DataFrame:
        # Create a copy for processing
        processed_df = df.copy()
        
        # Categorical columns to encode
        categorical_cols = processed_df.select_dtypes(include=['object']).columns
        
        for col in categorical_cols:
            le = LabelEncoder()
            # Handle missing values by converting to string
            processed_df[col] = processed_df[col].fillna('None').astype(str)
            processed_df[col] = le.fit_transform(processed_df[col])
            self.label_encoders[col] = le
            
        # Drop columns that are likely timestamps or IDs if they are still non-numeric
        # (Usually handled by dropping non-numeric after encoding)
        return processed_df.select_dtypes(include=[np.number])

    def analyze(self, df: pd.DataFrame) -> Dict[str, Any]:
        if df.empty:
            return {"threat_score": 0, "anomalies": [], "total_entries": 0}

        # Preprocess data
        features = self._preprocess(df)
        
        if features.empty or features.shape[1] == 0:
            # Fallback if no numeric features can be extracted
            return {"threat_score": 0, "anomalies": [], "total_entries": len(df)}

        # Fit and predict
        self.model.fit(features)
        predictions = self.model.predict(features) # -1 for anomaly, 1 for normal
        scores = self.model.decision_function(features) # Lower score = more anomalous
        
        # Invert scores for "threat level" (0 to 1)
        # decision_function output is roughly [-0.5, 0.5]
        # We want to map this so lower decision scores (anomalies) are higher threat
        threat_levels = 1.0 - (scores - scores.min()) / (scores.max() - scores.min() + 1e-6)
        
        anomalies = []
        for i, pred in enumerate(predictions):
            if pred == -1:
                # Basic explanation: find features that deviate most from mean
                # (Simple LIME-like proxy for now)
                diff = np.abs(features.iloc[i] - features.mean())
                top_feature = diff.idxmax()
                
                anomaly_entry = df.iloc[i].to_dict()
                anomaly_entry["threat_score"] = float(threat_levels[i])
                anomaly_entry["explanation"] = f"Anomalous pattern detected in feature: {top_feature}"
                anomalies.append(anomaly_entry)

        avg_threat = float(np.mean(threat_levels)) if len(threat_levels) > 0 else 0
        
        return {
            "threat_score": round(avg_threat * 100, 2),
            "anomalies": anomalies[:100],  # Limit to top 100 for response
            "total_entries": len(df),
            "anomalies_count": len(anomalies)
        }
