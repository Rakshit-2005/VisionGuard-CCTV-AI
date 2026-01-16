# from pydantic import BaseModel, EmailStr
# from typing import Optional

# class CompanyBase(BaseModel):
#     company_name: str
#     industry_type: str
#     company_email: EmailStr
#     reg_no: str
#     admin_name: str
#     admin_email: EmailStr
#     contact: str
#     password: str


# class CompanyRequest(CompanyBase):
#     verified: bool = False


# class CompanyResponse(BaseModel):
#     id: str
#     company_name: str
#     company_email: EmailStr
#     industry_type: str



from pydantic import BaseModel, EmailStr
from datetime import datetime

class CompanyBase(BaseModel):
    company_name: str
    industry_type: str
    company_email: EmailStr
    reg_no: str
    admin_name: str
    admin_email: EmailStr
    contact: str
    password: str


class CompanyRequest(CompanyBase):
    verified: bool = False


class CompanyDB(CompanyBase):
    created_at: datetime