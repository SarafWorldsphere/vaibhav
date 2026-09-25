from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.reports import get_reports_summary


router = APIRouter(
    prefix="/api/admin/reports",
    tags=["Reports & Analytics"],
)


@router.get("/summary")
def reports_summary(
    db: Session = Depends(get_db),
):
    return get_reports_summary(db)