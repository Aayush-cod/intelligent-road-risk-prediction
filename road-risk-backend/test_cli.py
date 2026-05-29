import requests
import random
import json

BASE_URL = "http://127.0.0.1:8000/api"

# Get dropdown options from API
options = requests.get(f"{BASE_URL}/predict/options").json()

def generate_random_input():
    return {
        "Day_of_week": random.choice(options["Day_of_week"]),
        "Age_band_of_driver": random.choice(options["Age_band_of_driver"]),
        "Sex_of_driver": random.choice(options["Sex_of_driver"]),
        "Driving_experience": random.choice(options["Driving_experience"]),
        "Type_of_vehicle": random.choice(options["Type_of_vehicle"]),
        "Area_accident_occured": random.choice(options["Area_accident_occured"]),
        "Lanes_or_Medians": random.choice(options["Lanes_or_Medians"]),
        "Road_allignment": random.choice(options["Road_allignment"]),
        "Types_of_Junction": random.choice(options["Types_of_Junction"]),
        "Road_surface_type": random.choice(options["Road_surface_type"]),
        "Road_surface_conditions": random.choice(options["Road_surface_conditions"]),
        "Light_conditions": random.choice(options["Light_conditions"]),
        "Weather_conditions": random.choice(options["Weather_conditions"]),
        "Type_of_collision": random.choice(options["Type_of_collision"]),
        "Cause_of_accident": random.choice(options["Cause_of_accident"]),
        "Number_of_vehicles_involved": random.randint(1, 6),
        "Number_of_casualties": random.randint(1, 4),
        "Hour": random.randint(0, 23),
    }

def run_tests(n=10):
    print("="*60)
    print("  Kathmandu Road Risk — CLI Prediction Tester")
    print("="*60)

    results = {"Slight Injury": 0, "Serious Injury": 0, "Fatal injury": 0}

    for i in range(1, n+1):
        data = generate_random_input()
        response = requests.post(f"{BASE_URL}/predict", json=data)
        result = response.json()

        severity = result["predicted_severity"]
        probs = result["probabilities"]
        peak = "⚠️  PEAK HOUR" if result["is_peak_hour"] else ""
        results[severity] += 1

        print(f"\n[{i:02d}] Hour: {data['Hour']:02d}h | "
              f"{data['Weather_conditions']:<20} | "
              f"{data['Type_of_vehicle']:<25} | "
              f"{data['Day_of_week']:<10}")
        print(f"     Cause: {data['Cause_of_accident']:<30} | Road: {data['Road_surface_type']}")
        print(f"     → Severity: {severity:<20} "
              f"Slight:{probs['slight']:.2f} "
              f"Serious:{probs['serious']:.2f} "
              f"Fatal:{probs['fatal']:.2f} {peak}")

    print("\n" + "="*60)
    print("  SUMMARY")
    print("="*60)
    for k, v in results.items():
        bar = "█" * v
        print(f"  {k:<20} {bar} ({v})")

    # Show analytics
    print("\n" + "="*60)
    print("  DATABASE SUMMARY")
    print("="*60)
    summary = requests.get(f"{BASE_URL}/analytics/summary").json()
    print(f"  Total predictions in DB : {summary['total_predictions']}")
    print(f"  Slight Injury           : {summary['slight_injury']}")
    print(f"  Serious Injury          : {summary['serious_injury']}")
    print(f"  Fatal Injury            : {summary['fatal_injury']}")
    print("="*60)

if __name__ == "__main__":
    run_tests(n=10)