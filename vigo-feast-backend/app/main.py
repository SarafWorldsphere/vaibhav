from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.customer import router as customer_router
from app.routes.delivery_partner import router as delivery_partner_router
from app.routes.restaurant import router as restaurant_router
from app.routes.order import router as order_router
from app.routes.dashboard import router as dashboard_router
from app.routes.reports import router as reports_router
from app.routes.settings import router as settings_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="VIGO FEAST Admin Management API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Admin Management APIs
app.include_router(delivery_partner_router)
app.include_router(customer_router)
app.include_router(restaurant_router)
app.include_router(order_router)
app.include_router(dashboard_router)
app.include_router(reports_router)
app.include_router(settings_router)



@app.get("/")
def root():
    return {
        "message": "VIGO FEAST Backend is running",
        "version": settings.app_version,
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
