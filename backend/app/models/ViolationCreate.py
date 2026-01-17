from pydantic import BaseModel

class ViolationCreate(BaseModel):
    company_name: str
    employeeId: str
    employeeName: str
    cameraId: str
    cameraLocation: str
    missingPPE: list[str]
    severity: str
    imageBase64: str | None = None
