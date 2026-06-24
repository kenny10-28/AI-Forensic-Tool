import pandas as pd
import joblib
import os
from app.services.forensic_analyzer import ForensicAnalyzer

def train_baseline_model(clean_data_path: str, model_save_path: str):
    print(f"Training baseline model on {clean_data_path}...")
    df = pd.read_csv(clean_data_path)
    
    analyzer = ForensicAnalyzer()
    features = analyzer._preprocess(df)
    
    # Fit the model on "clean" data
    analyzer.model.fit(features)
    
    # Save the trained model and encoders
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    joblib.dump({
        "model": analyzer.model,
        "encoders": analyzer.label_encoders
    }, model_save_path)
    
    print(f"Model saved to {model_save_path}")

if __name__ == "__main__":
    train_baseline_model("sample_data/clean_logs.csv", "backend/app/models/baseline_model.joblib")
