from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.prediction import Prediction

router = APIRouter()

@router.get("/analytics/summary")
def get_summary(db: Session = Depends(get_db)):
    total = db.query(Prediction).count()
    slight = db.query(Prediction).filter(Prediction.severity_label == "Slight Injury").count()
    serious = db.query(Prediction).filter(Prediction.severity_label == "Serious Injury").count()
    fatal = db.query(Prediction).filter(Prediction.severity_label == "Fatal injury").count()

    return {
        "total_predictions": total,
        "slight_injury": slight,
        "serious_injury": serious,
        "fatal_injury": fatal,
    }

@router.get("/analytics/peak-hours")
def get_peak_hours(db: Session = Depends(get_db)):
    results = db.query(
        Prediction.hour,
        func.count(Prediction.id).label("total"),
        func.sum(func.cast(Prediction.severity_label == "Fatal injury", int)).label("fatal"),
        func.sum(func.cast(Prediction.severity_label == "Serious Injury", int)).label("serious"),
    ).group_by(Prediction.hour).order_by(Prediction.hour).all()

    return [
        {
            "hour": r.hour,
            "total": r.total,
            "fatal": r.fatal,
            "serious": r.serious,
        }
        for r in results
    ]

@router.get("/analytics/by-weather")
def get_by_weather(db: Session = Depends(get_db)):
    results = db.query(
        Prediction.weather_conditions,
        func.count(Prediction.id).label("total"),
        func.avg(Prediction.probability_fatal).label("avg_fatal_prob")
    ).group_by(Prediction.weather_conditions).all()

    return [
        {
            "weather": r.weather_conditions,
            "total": r.total,
            "avg_fatal_probability": round(float(r.avg_fatal_prob or 0), 4)
        }
        for r in results
    ]

@router.get("/analytics/by-vehicle")
def get_by_vehicle(db: Session = Depends(get_db)):
    results = db.query(
        Prediction.type_of_vehicle,
        func.count(Prediction.id).label("total"),
        func.avg(Prediction.probability_serious).label("avg_serious_prob")
    ).group_by(Prediction.type_of_vehicle).all()

    return [
        {
            "vehicle_type": r.type_of_vehicle,
            "total": r.total,
            "avg_serious_probability": round(float(r.avg_serious_prob or 0), 4)
        }
        for r in results
    ]