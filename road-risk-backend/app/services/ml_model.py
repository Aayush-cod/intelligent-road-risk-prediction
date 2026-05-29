import joblib
import numpy as np
import json
import os

# Load everything once when server starts
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

model = joblib.load(os.path.join(BASE_DIR, "accident_severity_model.pkl"))
label_encoders = joblib.load(os.path.join(BASE_DIR, "label_encoders.pkl"))
feature_cols = joblib.load(os.path.join(BASE_DIR, "feature_cols.pkl"))
severity_mapping = joblib.load(os.path.join(BASE_DIR, "severity_mapping.pkl"))

with open(os.path.join(BASE_DIR, "dropdown_options.json")) as f:
    dropdown_options = json.load(f)

# Reverse mapping — 0=Slight, 1=Serious, 2=Fatal
reverse_severity = {v: k for k, v in severity_mapping.items()}

categorical_cols = [
    'Day_of_week', 'Age_band_of_driver', 'Sex_of_driver',
    'Driving_experience', 'Type_of_vehicle', 'Area_accident_occured',
    'Lanes_or_Medians', 'Road_allignment', 'Types_of_Junction',
    'Road_surface_type', 'Road_surface_conditions', 'Light_conditions',
    'Weather_conditions', 'Type_of_collision', 'Cause_of_accident'
]

def predict(input_data: dict):
    # Encode categorical inputs
    encoded = {}
    for col in categorical_cols:
        val = input_data.get(col, dropdown_options[col][0])
        le = label_encoders[col]
        if val in le.classes_:
            encoded[col + '_encoded'] = le.transform([val])[0]
        else:
            encoded[col + '_encoded'] = 0

    # Add numeric inputs
    hour = input_data.get('Hour', 12)
    encoded['Number_of_vehicles_involved'] = input_data.get('Number_of_vehicles_involved', 1)
    encoded['Number_of_casualties'] = input_data.get('Number_of_casualties', 1)
    encoded['Hour'] = hour
    encoded['Is_Peak_Hour'] = 1 if hour in [8, 15, 16, 17, 18] else 0

    # Build feature array in correct order
    features = np.array([[encoded[col] for col in feature_cols]])

    # Predict
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    return {
        "predicted_severity": int(prediction),
        "severity_label": reverse_severity[prediction],
        "probability_slight": round(float(probabilities[0]), 4),
        "probability_serious": round(float(probabilities[1]), 4),
        "probability_fatal": round(float(probabilities[2]), 4),
    }

def get_dropdown_options():
    return dropdown_options