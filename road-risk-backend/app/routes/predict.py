from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.prediction import Prediction
from app.services.ml_model import predict, get_dropdown_options

router = APIRouter()

class PredictRequest(BaseModel):
    Day_of_week: str
    Age_band_of_driver: str
    Sex_of_driver: str
    Driving_experience: str
    Type_of_vehicle: str
    Area_accident_occured: str
    Lanes_or_Medians: str
    Road_allignment: str
    Types_of_Junction: str
    Road_surface_type: str
    Road_surface_conditions: str
    Light_conditions: str
    Weather_conditions: str
    Type_of_collision: str
    Cause_of_accident: str
    Number_of_vehicles_involved: int
    Number_of_casualties: int
    Hour: int

@router.post("/predict")
def make_prediction(request: PredictRequest, db: Session = Depends(get_db)):
    input_data = request.dict()
    result = predict(input_data)

    # Save to database
    db_prediction = Prediction(
        day_of_week=request.Day_of_week,
        age_band_of_driver=request.Age_band_of_driver,
        sex_of_driver=request.Sex_of_driver,
        driving_experience=request.Driving_experience,
        type_of_vehicle=request.Type_of_vehicle,
        area_accident_occured=request.Area_accident_occured,
        lanes_or_medians=request.Lanes_or_Medians,
        road_allignment=request.Road_allignment,
        types_of_junction=request.Types_of_Junction,
        road_surface_type=request.Road_surface_type,
        road_surface_conditions=request.Road_surface_conditions,
        light_conditions=request.Light_conditions,
        weather_conditions=request.Weather_conditions,
        type_of_collision=request.Type_of_collision,
        cause_of_accident=request.Cause_of_accident,
        number_of_vehicles_involved=request.Number_of_vehicles_involved,
        number_of_casualties=request.Number_of_casualties,
        hour=request.Hour,
        is_peak_hour=1 if request.Hour in [8, 15, 16, 17, 18] else 0,
        predicted_severity=result["predicted_severity"],
        severity_label=result["severity_label"],
        probability_slight=result["probability_slight"],
        probability_serious=result["probability_serious"],
        probability_fatal=result["probability_fatal"],
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return {
        "id": db_prediction.id,
        "predicted_severity": result["severity_label"],
        "probabilities": {
            "slight": result["probability_slight"],
            "serious": result["probability_serious"],
            "fatal": result["probability_fatal"],
        },
        "is_peak_hour": db_prediction.is_peak_hour == 1,
        "saved_to_db": True
    }

@router.get("/predict/options")
def get_options():
    return get_dropdown_options()

@router.get("/predict/history")
def get_history(limit: int = 20, db: Session = Depends(get_db)):
    predictions = db.query(Prediction)\
        .order_by(Prediction.created_at.desc())\
        .limit(limit)\
        .all()
    return predictions