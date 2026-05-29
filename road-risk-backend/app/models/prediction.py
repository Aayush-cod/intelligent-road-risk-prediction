from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Input features
    day_of_week = Column(String)
    age_band_of_driver = Column(String)
    sex_of_driver = Column(String)
    driving_experience = Column(String)
    type_of_vehicle = Column(String)
    area_accident_occured = Column(String)
    lanes_or_medians = Column(String)
    road_allignment = Column(String)
    types_of_junction = Column(String)
    road_surface_type = Column(String)
    road_surface_conditions = Column(String)
    light_conditions = Column(String)
    weather_conditions = Column(String)
    type_of_collision = Column(String)
    cause_of_accident = Column(String)
    number_of_vehicles_involved = Column(Integer)
    number_of_casualties = Column(Integer)
    hour = Column(Integer)
    is_peak_hour = Column(Integer)

    # Prediction output
    predicted_severity = Column(String)
    severity_label = Column(String)
    probability_slight = Column(Float)
    probability_serious = Column(Float)
    probability_fatal = Column(Float)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())