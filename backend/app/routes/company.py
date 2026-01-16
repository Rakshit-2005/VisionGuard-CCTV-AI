# # from fastapi import APIRouter, HTTPException
# # from app.database import db
# # from app.models.company import CompanyRequest
# # from bson import ObjectId

# # router = APIRouter(prefix="/company", tags=["Company"])

# # # COLLECTIONS
# # company_requests = db.company_requests
# # companies = db.companies


# # # 1️⃣ Company Registration Request
# # @router.post("/register")
# # async def register_company(data: CompanyRequest):
# #     # Check if already applied
# #     existing = await company_requests.find_one({
# #         "company_email": data.company_email
# #     })
# #     if existing:
# #         raise HTTPException(status_code=400, detail="Company already applied")

# #     await company_requests.insert_one(data.dict())
# #     return {"message": "Company registration request submitted"}


# # # 2️⃣ Approve Company (Platform Admin)
# # @router.post("/approve/{request_id}")
# # async def approve_company(request_id: str):
# #     request = await company_requests.find_one({"_id": ObjectId(request_id)})

# #     if not request:
# #         raise HTTPException(status_code=404, detail="Request not found")

# #     if request.get("verified") is True:
# #         raise HTTPException(status_code=400, detail="Already approved")

# #     # Remove verified field before moving
# #     request.pop("_id")
# #     request.pop("verified")

# #     # Insert into companies collection
# #     await companies.insert_one(request)

# #     # Update request as verified
# #     await company_requests.update_one(
# #         {"_id": ObjectId(request_id)},
# #         {"$set": {"verified": True}}
# #     )

# #     return {"message": "Company approved successfully"}


# # # 3️⃣ Get Pending Requests
# # @router.get("/requests")
# # async def get_pending_requests():
# #     data = []
# #     async for item in company_requests.find({"verified": False}):
# #         item["_id"] = str(item["_id"])
# #         data.append(item)
# #     return data


# from fastapi import APIRouter, HTTPException
# from app.database import db
# from app.models.company import CompanyRequest
# from bson import ObjectId
# from datetime import datetime


# router = APIRouter(prefix="/company", tags=["Company"])

# company_requests = db.company_requests
# companies = db.companies


# # 1️⃣ Apply for Company Registration
# @router.post("/register")
# async def register_company(data: CompanyRequest):

#     # Prevent duplicate application
#     existing_request = await company_requests.find_one({
#         "company_email": data.company_email
#     })
#     existing_company = await companies.find_one({
#         "company_email": data.company_email
#     })

#     if existing_request or existing_company:
#         raise HTTPException(status_code=400, detail="Company already exists or applied")

#     await company_requests.insert_one(data.dict())
#     return {"message": "Company registration request submitted"}


# # 2️⃣ Get All Pending Requests (Admin)
# @router.get("/requests")
# async def get_company_requests():
#     requests = []
#     async for item in company_requests.find():
#         item["_id"] = str(item["_id"])
#         requests.append(item)
#     return requests


# # 3️⃣ Approve Company
# @router.post("/approve/{request_id}")
# async def approve_company(request_id: str):

#     request = await company_requests.find_one({"_id": ObjectId(request_id)})

#     if not request:
#         raise HTTPException(status_code=404, detail="Request not found")

#     # Remove temporary fields
#     request.pop("_id")
#     request.pop("verified", None)

#     # Add metadata
#     request["created_at"] = datetime.utcnow()

#     # Insert into companies collection
#     await companies.insert_one(request)

#     # Delete request after approval
#     await company_requests.delete_one({"_id": ObjectId(request_id)})

#     return {"message": "Company approved and added successfully"}


# # 4️⃣ Reject Company
# @router.post("/reject/{request_id}")
# async def reject_company(request_id: str):

#     request = await company_requests.find_one({"_id": ObjectId(request_id)})

#     if not request:
#         raise HTTPException(status_code=404, detail="Request not found")

#     # Delete request permanently
#     await company_requests.delete_one({"_id": ObjectId(request_id)})

#     return {"message": "Company registration request rejected"}



from fastapi import APIRouter, HTTPException
from app.database import db
from app.models.company import CompanyRequest
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/company", tags=["Company"])

company_requests = db.company_requests
companies = db.companies


# 1️⃣ Apply for Company Registration
@router.post("/register")
async def register_company(data: CompanyRequest):

    # Prevent duplicate application
    existing_request = await company_requests.find_one({
        "company_email": data.company_email
    })
    existing_company = await companies.find_one({
        "company_email": data.company_email
    })

    if existing_request or existing_company:
        raise HTTPException(status_code=400, detail="Company already exists or applied")

    await company_requests.insert_one(data.dict())
    return {"message": "Company registration request submitted"}


# 2️⃣ Get All Pending Requests (Admin)
@router.get("/requests")
async def get_company_requests():
    requests = []
    async for item in company_requests.find():
        item["_id"] = str(item["_id"])
        requests.append(item)
    return requests


# 3️⃣ Approve Company
@router.post("/approve/{request_id}")
async def approve_company(request_id: str):

    request = await company_requests.find_one({"_id": ObjectId(request_id)})

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    # Remove temporary fields
    request.pop("_id")
    request.pop("verified", None)

    # Add metadata
    request["created_at"] = datetime.utcnow()

    # Insert into companies collection
    await companies.insert_one(request)

    # Delete request after approval
    await company_requests.delete_one({"_id": ObjectId(request_id)})

    return {"message": "Company approved and added successfully"}


# 4️⃣ Reject Company
@router.post("/reject/{request_id}")
async def reject_company(request_id: str):

    request = await company_requests.find_one({"_id": ObjectId(request_id)})

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    # Delete request permanently
    await company_requests.delete_one({"_id": ObjectId(request_id)})

    return {"message": "Company registration request rejected"}


# 5️⃣ Get All Approved / Registered Companies (NEW API)
@router.get("/list")
async def get_registered_companies():
    """
    Fetch basic details of all approved companies
    """
    company_list = []

    async for company in companies.find(
        {},
        {
            "company_name": 1,
            "reg_no": 1,
            "industry_type": 1,
            "admin_email": 1,
            "created_at": 1,
        }
    ):
        company_list.append({
            "id": str(company["_id"]),
            "company_name": company.get("company_name"),
            "reg_no": company.get("reg_no"),
            "industry_type": company.get("industry_type"),
            "admin_email": company.get("admin_email"),
            "created_at": company.get("created_at"),
        })

    return company_list