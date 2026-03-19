import os
import sys
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

CSV_CANDIDATES = ["crop.csv", "Crop_recommendation.csv", "crop_recommendation.csv"]

def find_csv():
    for name in CSV_CANDIDATES:
        if os.path.exists(name):
            return name
    return None

def main():
    csv_file = find_csv()
    if csv_file is None:
        print("No CSV found. Put 'crop.csv' or 'Crop_recommendation.csv' in this folder.")
        sys.exit(1)

    print("Using:", csv_file)
    df = pd.read_csv(csv_file)

    # drop unnamed columns if present
    df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

    if "label" not in df.columns:
        print("Dataset must contain a 'label' column. Found:", list(df.columns))
        sys.exit(1)

    X = df.drop("label", axis=1)
    y = df["label"]

    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    rf = RandomForestClassifier(n_estimators=10, random_state=42)
    rf.fit(X, y_enc)

    payload = {"model": rf, "label_encoder": le}
    out_path = os.path.join(os.path.dirname(__file__), "crop_model.pkl")
    joblib.dump(payload, out_path)
    print("Saved model to:", out_path)

if __name__ == "__main__":
    main()
