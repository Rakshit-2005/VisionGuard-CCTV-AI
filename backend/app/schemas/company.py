from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CompanyBasicResponse(BaseModel):
    id: str
    company_name: str
    reg_no: str
    industry_type: str
    admin_email: str
    created_at: Optional[datetime]