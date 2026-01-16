from pydantic import BaseModel, Field


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., example="EMP001")
    name: str = Field(..., example="Rahul Sharma")
    department: str = Field(..., example="Manufacturing")
    company_reg_no: str = Field(..., example="123456")