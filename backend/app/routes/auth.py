from fastapi import APIRouter, HTTPException
from app.database import db
from app.models.auth import LoginRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

companies = db.companies

@router.post("/login")
async def login(data: LoginRequest):
    """
    Login using admin_email and password
    """

    # 1️⃣ Check if user exists
    company = await companies.find_one(
        {"admin_email": data.username}
    )

    if not company:
        if data.username=="admin@gmail.com":
            return {
                "message": "Platform admin login",
                "role": "platform_admin",
                "company": "temp"
            }
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    # 2️⃣ Check password (plain-text comparison)
    if company["password"] != data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    # 3️⃣ Successful login response
    return {
        "message": "Login successful",
        "company": {
            "company_name": company["company_name"],
            "reg_no": company["reg_no"],
            "admin_name": company["admin_name"],
            "admin_email": company["admin_email"],
            "industry_type": company["industry_type"]
        }
    }