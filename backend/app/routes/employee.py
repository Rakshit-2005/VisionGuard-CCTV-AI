# from fastapi import APIRouter, HTTPException
# from datetime import datetime
# from app.database import db
# from app.models.employee import EmployeeCreate

# router = APIRouter(prefix="/employee", tags=["Employee"])

# employees = db.employees
# companies = db.companies


# @router.post("/create")
# async def create_employee(data: EmployeeCreate):
#     """
#     Create an employee ONLY if company reg_no exists
#     """

#     # 1️⃣ Check if company exists using reg_no
#     company = await companies.find_one({"reg_no": data.company_reg_no})

#     if not company:
#         raise HTTPException(
#             status_code=404,
#             detail="Company with given registration number does not exist"
#         )

#     # 2️⃣ Prevent duplicate employee in same company
#     existing_employee = await employees.find_one({
#         "employee_id": data.employee_id,
#         "company_reg_no": data.company_reg_no
#     })

#     if existing_employee:
#         raise HTTPException(
#             status_code=400,
#             detail="Employee already exists for this company"
#         )

#     # 3️⃣ Insert employee
#     employee_doc = {
#         "employee_id": data.employee_id,
#         "name": data.name,
#         "department": data.department,
#         "company_reg_no": data.company_reg_no,
#         "created_at": datetime.utcnow()
#     }

#     await employees.insert_one(employee_doc)

#     return {
#         "message": "Employee created successfully",
#         "employee_id": data.employee_id,
#         "company_reg_no": data.company_reg_no
#     }


from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.database import db
# from app.models.employee import EmployeeBulkCreate

router = APIRouter(prefix="/employee", tags=["Employee"])

# employees_col = db.employees
# companies_col = db.companies


# @router.post("/bulk-create")
# async def bulk_create_employees(payload: EmployeeBulkCreate):
#     inserted = 0
#     skipped = 0
#     errors = []

#     for index, emp in enumerate(payload.employees, start=1):
#         try:
#             # 1️⃣ Check company exists
#             company = await companies_col.find_one(
#                 {"reg_no": emp.company_reg_no}
#             )
#             if not company:
#                 skipped += 1
#                 errors.append(
#                     f"Row {index}: Company {emp.company_reg_no} not found"
#                 )
#                 continue

#             # 2️⃣ Check duplicate employee
#             exists = await employees_col.find_one({
#                 "employee_id": emp.employee_id,
#                 "company_reg_no": emp.company_reg_no
#             })
#             if exists:
#                 skipped += 1
#                 errors.append(
#                     f"Row {index}: Employee already exists"
#                 )
#                 continue

#             # 3️⃣ Insert employee
#             await employees_col.insert_one({
#                 "employee_id": emp.employee_id,
#                 "name": emp.name,
#                 "department": emp.department,
#                 "company_reg_no": emp.company_reg_no,
#                 "created_at": datetime.utcnow()
#             })

#             inserted += 1

#         except Exception as e:
#             skipped += 1
#             errors.append(f"Row {index}: {str(e)}")

#     return {
#         "message": "Bulk employee insertion completed",
#         "inserted": inserted,
#         "skipped": skipped,
#         "errors": errors
#     }