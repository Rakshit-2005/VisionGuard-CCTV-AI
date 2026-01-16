// Demo API Service - Simulates backend API calls
// In production, replace these with actual API endpoints

import {
  mockCompanies,
  mockEmployees,
  mockViolations,
  mockCameras,
  aiResponses,
  Company,
  Employee,
  Violation,
  Camera,
} from './mockData';

const API_BASE = 'http://localhost:8000';

// Simulate network delay
const simulateDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============ AUTH API ============

export const authApi = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    console.log('[Demo API] POST /api/auth/login', { email });
    await simulateDelay(800);
    
    const mockUsers = [
      { id: 'user-1', email: 'admin@safetyai.com', name: 'Platform Admin', role: 'platform_admin' },
      { id: 'user-2', email: 'john@techforge.com', name: 'John Mitchell', role: 'company_admin', companyId: 'comp-1' },
      { id: 'user-3', email: 'sarah@biolabs.com', name: 'Sarah Chen', role: 'company_admin', companyId: 'comp-2' },
      { id: 'user-4', email: 'mike@globalstore.com', name: 'Mike Rodriguez', role: 'company_admin', companyId: 'comp-3' },
    ];

    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check company status for company admins
    if (user.role === 'company_admin' && user.companyId) {
      const company = mockCompanies.find((c) => c.id === user.companyId);
      if (company && company.status !== 'active') {
        return { success: false, error: 'Your company account is pending approval. Please wait for admin verification.' };
      }
    }

    return { success: true, user };
  },

  register: async (data: {
    companyName: string;
    industry: string;
    companyEmail: string;
    adminName: string;
    adminEmail: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    console.log('[Demo API] POST /api/auth/register', data);
    await simulateDelay(1000);

    // Check if email already exists
    const existingCompany = mockCompanies.find(
      (c) => c.adminEmail.toLowerCase() === data.adminEmail.toLowerCase()
    );
    if (existingCompany) {
      return { success: false, error: 'An account with this email already exists' };
    }

    return { success: true };
  },

  logout: async (): Promise<void> => {
    console.log('[Demo API] POST /api/auth/logout');
    await simulateDelay(300);
  },
};

// ============ COMPANIES API ============

export const companiesApi = {
  getAll: async (): Promise<Company[]> => {
    console.log('[Demo API] GET /api/companies');
    await simulateDelay(500);
    return [...mockCompanies];
  },

  getById: async (id: string): Promise<Company | null> => {
    console.log('[Demo API] GET /api/companies/' + id);
    await simulateDelay(400);
    return mockCompanies.find((c) => c.id === id) || null;
  },

  approve: async (id: string): Promise<{ success: boolean }> => {
    console.log('[Demo API] POST /api/companies/' + id + '/approve');
    await simulateDelay(600);
    return { success: true };
  },

  reject: async (id: string): Promise<{ success: boolean }> => {
    console.log('[Demo API] POST /api/companies/' + id + '/reject');
    await simulateDelay(600);
    return { success: true };
  },

  updateSettings: async (id: string, data: Partial<Company>): Promise<{ success: boolean }> => {
    console.log('[Demo API] PATCH /api/companies/' + id, data);
    await simulateDelay(500);
    return { success: true };
  },
};

// ============ EMPLOYEES API ============

export const employeesApi = {
  getByCompany: async (companyId: string): Promise<Employee[]> => {
    console.log('[Demo API] GET /api/companies/' + companyId + '/employees');
    await simulateDelay(500);
    return mockEmployees.filter((e) => e.companyId === companyId);
  },

  create: async (data: Omit<Employee, 'id'>): Promise<Employee> => {
    console.log('[Demo API] POST /api/employees', data);
    await simulateDelay(600);
    const newEmployee: Employee = {
      ...data,
      id: `emp-${Date.now()}`,
    };
    return newEmployee;
  },

  update: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    console.log('[Demo API] PATCH /api/employees/' + id, data);
    await simulateDelay(500);
    const employee = mockEmployees.find((e) => e.id === id);
    return { ...employee!, ...data };
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    console.log('[Demo API] DELETE /api/employees/' + id);
    await simulateDelay(400);
    return { success: true };
  },

  bulkUpload: async (file: File): Promise<{ success: boolean; count: number }> => {
    console.log('[Demo API] POST /api/employees/bulk-upload', { fileName: file.name });
    await simulateDelay(1500);
    return { success: true, count: 15 }; // Mock uploaded count
  },
};

// ============ VIOLATIONS API ============

export const violationsApi = {
  getByCompany: async (companyId: string): Promise<Violation[]> => {
    console.log('[Demo API] GET /api/companies/' + companyId + '/violations');
    await simulateDelay(500);
    return mockViolations.filter((v) => v.companyId === companyId);
  },

  getAll: async (): Promise<Violation[]> => {
    console.log('[Demo API] GET /api/violations');
    await simulateDelay(500);
    return [...mockViolations];
  },

  getStats: async (companyId?: string): Promise<{
    today: number;
    thisWeek: number;
    thisMonth: number;
    byPPE: Record<string, number>;
  }> => {
    console.log('[Demo API] GET /api/violations/stats', { companyId });
    await simulateDelay(400);
    return {
      today: 4,
      thisWeek: 23,
      thisMonth: 87,
      byPPE: { helmet: 35, goggles: 25, gloves: 20, mask: 12, shoes: 8 },
    };
  },

  exportReport: async (format: 'pdf' | 'csv', companyId?: string): Promise<Blob> => {
    console.log('[Demo API] GET /api/violations/export', { format, companyId });
    await simulateDelay(1000);
    // Return mock blob
    return new Blob(['Demo Report Data'], { type: 'text/plain' });
  },
};

// ============ CAMERAS API ============

export const camerasApi = {
  getByCompany: async (companyId: string) => {
    const res = await fetch(`${API_BASE}/companies/${companyId}/cameras`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE}/cameras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/cameras/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    await fetch(`${API_BASE}/cameras/${id}`, { method: 'DELETE' });
    return { success: true };
  },

  testConnection: async (streamSource) => {
    const res = await fetch(`${API_BASE}/cameras/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamSource }),
    });
    return res.json();
  },
};

// ============ AI ASSISTANT API ============

export const aiAssistantApi = {
  chat: async (message: string): Promise<{ response: string }> => {
    console.log('[Demo API] POST /api/ai/chat', { message });
    await simulateDelay(1500);

    const lowerQuery = message.toLowerCase();
    
    let response: string;
    if (lowerQuery.includes('helmet') && (lowerQuery.includes('today') || lowerQuery.includes('violation'))) {
      response = aiResponses['helmet violations today'];
    } else if (lowerQuery.includes('compliance') && (lowerQuery.includes('week') || lowerQuery.includes('rate'))) {
      response = aiResponses['compliance this week'];
    } else if (lowerQuery.includes('non-compliant') || lowerQuery.includes('noncompliant')) {
      response = aiResponses['non-compliant employees'];
    } else {
      response = aiResponses['default'];
    }

    return { response };
  },
};

// ============ REPORTS API ============

export const reportsApi = {
  getComplianceTrend: async (companyId?: string, period: 'week' | 'month' | 'year' = 'week'): Promise<{
    data: Array<{ date: string; compliance: number; violations: number }>;
  }> => {
    console.log('[Demo API] GET /api/reports/compliance-trend', { companyId, period });
    await simulateDelay(600);
    return {
      data: [
        { date: 'Dec 23', compliance: 91, violations: 12 },
        { date: 'Dec 24', compliance: 93, violations: 8 },
        { date: 'Dec 25', compliance: 89, violations: 15 },
        { date: 'Dec 26', compliance: 92, violations: 10 },
        { date: 'Dec 27', compliance: 94, violations: 7 },
        { date: 'Dec 28', compliance: 90, violations: 14 },
        { date: 'Dec 29', compliance: 95, violations: 6 },
      ],
    };
  },

  getDashboardStats: async (companyId?: string): Promise<{
    totalEmployees: number;
    activeViolations: number;
    complianceRate: number;
    activeCameras: number;
  }> => {
    console.log('[Demo API] GET /api/reports/dashboard-stats', { companyId });
    await simulateDelay(400);

    if (companyId) {
      const company = mockCompanies.find((c) => c.id === companyId);
      const employees = mockEmployees.filter((e) => e.companyId === companyId);
      const violations = mockViolations.filter((v) => v.companyId === companyId);
      const cameras = mockCameras.filter((c) => c.companyId === companyId);
      
      return {
        totalEmployees: employees.length,
        activeViolations: violations.length,
        complianceRate: company?.complianceRate || 0,
        activeCameras: cameras.filter((c) => c.status === 'active').length,
      };
    }

    // Platform-wide stats
    return {
      totalEmployees: mockEmployees.length,
      activeViolations: mockViolations.length,
      complianceRate: 91.5,
      activeCameras: mockCameras.filter((c) => c.status === 'active').length,
    };
  },

  generateReport: async (type: 'daily' | 'weekly' | 'monthly', companyId?: string): Promise<{ url: string }> => {
    console.log('[Demo API] POST /api/reports/generate', { type, companyId });
    await simulateDelay(2000);
    return { url: '#demo-report' };
  },
};

// ============ NOTIFICATIONS API ============

export const notificationsApi = {
  getAll: async (): Promise<Array<{ id: string; title: string; message: string; read: boolean; timestamp: string }>> => {
    console.log('[Demo API] GET /api/notifications');
    await simulateDelay(400);
    return [
      { id: '1', title: 'New Violation', message: 'Helmet violation detected in Welding Bay', read: false, timestamp: new Date().toISOString() },
      { id: '2', title: 'Camera Offline', message: 'CAM-SHIP went offline', read: true, timestamp: new Date(Date.now() - 3600000).toISOString() },
    ];
  },

  markAsRead: async (id: string): Promise<{ success: boolean }> => {
    console.log('[Demo API] POST /api/notifications/' + id + '/read');
    await simulateDelay(200);
    return { success: true };
  },
};

// ============ SETTINGS API ============

export const settingsApi = {
  get: async (): Promise<{ notifications: boolean; emailAlerts: boolean; theme: string }> => {
    console.log('[Demo API] GET /api/settings');
    await simulateDelay(300);
    return { notifications: true, emailAlerts: true, theme: 'dark' };
  },

  update: async (data: Partial<{ notifications: boolean; emailAlerts: boolean; theme: string }>): Promise<{ success: boolean }> => {
    console.log('[Demo API] PATCH /api/settings', data);
    await simulateDelay(400);
    return { success: true };
  },
};
