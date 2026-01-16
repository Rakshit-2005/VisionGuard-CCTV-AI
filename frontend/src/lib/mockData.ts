// Mock Data for Safety Compliance Platform

export interface Company {
  id: string;
  name: string;
  industry: 'factory' | 'lab' | 'warehouse' | 'construction';
  status: 'pending' | 'active' | 'rejected';
  email: string;
  adminName: string;
  adminEmail: string;
  employeeCount: number;
  cameraCount: number;
  complianceRate: number;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  photo?: string;
  companyId: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'unknown';
  lastViolation?: string;
}

export interface Violation {
  id: string;
  employeeId: string;
  employeeName: string;
  companyId: string;
  missingPPE: ('helmet' | 'shoes' | 'goggles' | 'mask' | 'gloves')[];
  timestamp: string;
  cameraLocation: string;
  severity: 'low' | 'medium' | 'high';
  imageUrl?: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  streamSource: string;
  companyId: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastActivity: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'platform_admin' | 'company_admin';
  companyId?: string;
}

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'TechForge Industries',
    industry: 'factory',
    status: 'active',
    email: 'contact@techforge.com',
    adminName: 'John Mitchell',
    adminEmail: 'john@techforge.com',
    employeeCount: 245,
    cameraCount: 12,
    complianceRate: 94.5,
    createdAt: '2024-01-15',
  },
  {
    id: 'comp-2',
    name: 'BioLabs Research',
    industry: 'lab',
    status: 'active',
    email: 'info@biolabs.com',
    adminName: 'Sarah Chen',
    adminEmail: 'sarah@biolabs.com',
    employeeCount: 89,
    cameraCount: 8,
    complianceRate: 98.2,
    createdAt: '2024-02-20',
  },
  {
    id: 'comp-3',
    name: 'GlobalStore Logistics',
    industry: 'warehouse',
    status: 'active',
    email: 'ops@globalstore.com',
    adminName: 'Mike Rodriguez',
    adminEmail: 'mike@globalstore.com',
    employeeCount: 412,
    cameraCount: 24,
    complianceRate: 87.3,
    createdAt: '2024-03-05',
  },
  {
    id: 'comp-4',
    name: 'BuildRight Construction',
    industry: 'construction',
    status: 'pending',
    email: 'admin@buildright.com',
    adminName: 'David Park',
    adminEmail: 'david@buildright.com',
    employeeCount: 0,
    cameraCount: 0,
    complianceRate: 0,
    createdAt: '2024-12-28',
  },
  {
    id: 'comp-5',
    name: 'ChemWorks Manufacturing',
    industry: 'factory',
    status: 'pending',
    email: 'info@chemworks.com',
    adminName: 'Lisa Wong',
    adminEmail: 'lisa@chemworks.com',
    employeeCount: 0,
    cameraCount: 0,
    complianceRate: 0,
    createdAt: '2024-12-30',
  },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  { id: 'emp-1', employeeId: 'TF-001', name: 'Alex Johnson', department: 'Assembly Line A', companyId: 'comp-1', complianceStatus: 'compliant' },
  { id: 'emp-2', employeeId: 'TF-002', name: 'Maria Garcia', department: 'Welding', companyId: 'comp-1', complianceStatus: 'non-compliant', lastViolation: '2024-12-28T14:30:00Z' },
  { id: 'emp-3', employeeId: 'TF-003', name: 'James Wilson', department: 'Quality Control', companyId: 'comp-1', complianceStatus: 'compliant' },
  { id: 'emp-4', employeeId: 'TF-004', name: 'Emily Brown', department: 'Maintenance', companyId: 'comp-1', complianceStatus: 'non-compliant', lastViolation: '2024-12-29T09:15:00Z' },
  { id: 'emp-5', employeeId: 'TF-005', name: 'Robert Lee', department: 'Assembly Line B', companyId: 'comp-1', complianceStatus: 'compliant' },
  { id: 'emp-6', employeeId: 'TF-006', name: 'Jennifer Davis', department: 'Packaging', companyId: 'comp-1', complianceStatus: 'compliant' },
  { id: 'emp-7', employeeId: 'TF-007', name: 'Michael Chen', department: 'Welding', companyId: 'comp-1', complianceStatus: 'non-compliant', lastViolation: '2024-12-29T11:45:00Z' },
  { id: 'emp-8', employeeId: 'TF-008', name: 'Amanda Taylor', department: 'Shipping', companyId: 'comp-1', complianceStatus: 'compliant' },
  { id: 'emp-9', employeeId: 'BL-001', name: 'Dr. Rachel Kim', department: 'Research', companyId: 'comp-2', complianceStatus: 'compliant' },
  { id: 'emp-10', employeeId: 'BL-002', name: 'Tom Anderson', department: 'Lab Safety', companyId: 'comp-2', complianceStatus: 'compliant' },
  { id: 'emp-11', employeeId: 'GS-001', name: 'Chris Martinez', department: 'Receiving', companyId: 'comp-3', complianceStatus: 'non-compliant', lastViolation: '2024-12-29T08:20:00Z' },
  { id: 'emp-12', employeeId: 'GS-002', name: 'Patricia White', department: 'Inventory', companyId: 'comp-3', complianceStatus: 'compliant' },
];

// Mock Violations
export const mockViolations: Violation[] = [
  { id: 'vio-1', employeeId: 'TF-002', employeeName: 'Maria Garcia', companyId: 'comp-1', missingPPE: ['helmet', 'goggles'], timestamp: '2024-12-29T14:30:00Z', cameraLocation: 'Welding Bay 2', severity: 'high' },
  { id: 'vio-2', employeeId: 'TF-004', employeeName: 'Emily Brown', companyId: 'comp-1', missingPPE: ['gloves'], timestamp: '2024-12-29T09:15:00Z', cameraLocation: 'Maintenance Hall', severity: 'medium' },
  { id: 'vio-3', employeeId: 'TF-007', employeeName: 'Michael Chen', companyId: 'comp-1', missingPPE: ['mask'], timestamp: '2024-12-29T11:45:00Z', cameraLocation: 'Welding Bay 1', severity: 'medium' },
  { id: 'vio-4', employeeId: 'GS-001', employeeName: 'Chris Martinez', companyId: 'comp-3', missingPPE: ['shoes', 'helmet'], timestamp: '2024-12-29T08:20:00Z', cameraLocation: 'Loading Dock A', severity: 'high' },
  { id: 'vio-5', employeeId: 'TF-002', employeeName: 'Maria Garcia', companyId: 'comp-1', missingPPE: ['helmet'], timestamp: '2024-12-28T16:45:00Z', cameraLocation: 'Welding Bay 2', severity: 'high' },
  { id: 'vio-6', employeeId: 'TF-001', employeeName: 'Alex Johnson', companyId: 'comp-1', missingPPE: ['goggles'], timestamp: '2024-12-28T10:30:00Z', cameraLocation: 'Assembly Line A', severity: 'low' },
  { id: 'vio-7', employeeId: 'GS-002', employeeName: 'Patricia White', companyId: 'comp-3', missingPPE: ['mask', 'gloves'], timestamp: '2024-12-28T14:00:00Z', cameraLocation: 'Inventory Zone C', severity: 'medium' },
  { id: 'vio-8', employeeId: 'TF-005', employeeName: 'Robert Lee', companyId: 'comp-1', missingPPE: ['helmet'], timestamp: '2024-12-27T09:00:00Z', cameraLocation: 'Assembly Line B', severity: 'high' },
];

// Mock Cameras
export const mockCameras: Camera[] = [
];

// Compliance Trend Data
export const complianceTrendData = [
  { date: 'Dec 23', compliance: 91, violations: 12 },
  { date: 'Dec 24', compliance: 93, violations: 8 },
  { date: 'Dec 25', compliance: 89, violations: 15 },
  { date: 'Dec 26', compliance: 92, violations: 10 },
  { date: 'Dec 27', compliance: 94, violations: 7 },
  { date: 'Dec 28', compliance: 90, violations: 14 },
  { date: 'Dec 29', compliance: 95, violations: 6 },
];

// PPE Violation Distribution
export const ppeViolationData = [
  { name: 'Helmet', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Goggles', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Gloves', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Mask', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Shoes', value: 8, color: 'hsl(var(--chart-5))' },
];

// Violations by Company
export const violationsByCompany = [
  { company: 'TechForge', violations: 45 },
  { company: 'BioLabs', violations: 12 },
  { company: 'GlobalStore', violations: 78 },
];

// AI Assistant Responses
export const aiResponses: Record<string, string> = {
  'helmet violations today': 'Today, there were 3 helmet violations detected:\n\n1. **Maria Garcia** (TF-002) at Welding Bay 2 - 2:30 PM\n2. **Chris Martinez** (GS-001) at Loading Dock A - 8:20 AM\n3. **Robert Lee** (TF-005) at Assembly Line B - 9:00 AM\n\nThe Welding Bay area has the highest frequency of helmet violations this week.',
  'compliance this week': 'Your weekly compliance summary:\n\n📊 **Overall Compliance Rate: 92.4%**\n\n- Monday: 91%\n- Tuesday: 93%\n- Wednesday: 89%\n- Thursday: 92%\n- Friday: 94%\n- Saturday: 95%\n\n✅ **Best performing department:** Quality Control (99.2%)\n⚠️ **Needs attention:** Welding Bay (85.3%)',
  'non-compliant employees': 'Currently, **3 employees** are flagged as non-compliant:\n\n1. **Maria Garcia** - Last violation: Dec 29, 2:30 PM (Missing helmet & goggles)\n2. **Emily Brown** - Last violation: Dec 29, 9:15 AM (Missing gloves)\n3. **Michael Chen** - Last violation: Dec 29, 11:45 AM (Missing mask)\n\nRecommendation: Schedule safety training for the Welding department.',
  'default': 'I can help you with:\n\n• PPE compliance queries\n• Employee violation history\n• Department safety statistics\n• Weekly/monthly reports\n• Camera status updates\n\nTry asking: "Show helmet violations today" or "What\'s our compliance rate this week?"',
};
