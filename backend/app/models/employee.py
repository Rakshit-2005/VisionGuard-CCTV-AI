from pydantic import BaseModel
from typing import Optional

class EmployeeCreate(BaseModel):
    employeeId: str
    name: str
    department: str
    companyId: str
    complianceStatus: str = "unknown"
    imageBase64: Optional[str] = None  # 👈 BASE64 IMAGE
