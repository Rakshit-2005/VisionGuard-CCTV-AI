from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.database import db
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter(prefix="/employee", tags=["Employee"])
employees = db.employees

class EmployeeCreate(BaseModel):
    name: str
    employeeId: str
    department: str
    company_name: str
    complianceStatus: str
    imageBase64: str | None = None

def serialize(emp):
    emp["id"] = str(emp["_id"])
    del emp["_id"]
    return emp

@router.get("/{company_name}")
async def get_employees_by_company(company_name: str):
    docs = await employees.find(
        {"company_name": company_name}
    ).to_list(length=1000)

    for d in docs:
        d["id"] = str(d["_id"])
        del d["_id"]

    return docs

@router.post("")
async def create_employee(data: EmployeeCreate):
    if data.imageBase64 and len(data.imageBase64) > 2_000_000:
        raise HTTPException(
            status_code=413,
            detail="Image too large. Max ~1.5MB base64."
        )

    doc = data.dict()
    doc["createdAt"] = datetime.utcnow()
    print("DB:", db.name)
    print("COLLECTION:", employees.full_name)

    res = await employees.insert_one(doc)
    saved = await employees.find_one({"_id": res.inserted_id})

    return serialize(saved)
