from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import predict, analytics

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kathmandu Road Risk Intelligence API",
    description="Predicts accident severity using ML — Data For Good Nepal",
    version="1.0.0"
)

# Allow React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(predict.router, prefix="/api", tags=["Predictions"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])

@app.get("/")
def root():
    return {
        "message": "Kathmandu Road Risk Intelligence API",
        "status": "running",
        "docs": "/docs"
    }