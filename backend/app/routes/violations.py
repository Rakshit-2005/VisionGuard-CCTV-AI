from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.database import db
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter(prefix="/violations")

class ViolationCreate(BaseModel):
    company_name: str
    employeeId: str
    employeeName: str
    cameraId: str
    cameraLocation: str
    missingPPE: list[str]
    severity: str
    imageBase64: str | None = None

@router.post("")
async def create_violation(data: ViolationCreate):
    doc = data.dict()
    doc["timestamp"] = datetime.utcnow()
    doc["createdAt"] = datetime.utcnow()

    res = await db.violations.insert_one(doc)
    saved = await db.violations.find_one({"_id": res.inserted_id})

    saved["id"] = str(saved["_id"])
    del saved["_id"]
    return saved

@router.get("/{company_name}")
async def get_violations(company_name: str):
    docs = await db.violations.find(
        {"company_name": company_name}
    ).sort("timestamp", -1).to_list(1000)

    for d in docs:
        d["id"] = str(d["_id"])
        del d["_id"]
    return docs
