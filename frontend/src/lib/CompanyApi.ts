import { apiRequest } from '@/lib/api';

export interface PendingCompany {
  _id: string;
  company_name: string;
  industry_type: string;
  admin_name: string;
  company_email: string;
}

export const companyApi = {
  getPendingRequests: async (): Promise<PendingCompany[]> => {
    return await apiRequest('/company/requests');
  },

  approveCompany: async (id: string) => {
    return await apiRequest(`/company/approve/${id}`, {
      method: 'POST',
    });
  },

  rejectCompany: async (id: string) => {
    return await apiRequest(`/company/reject/${id}`, {
      method: 'POST',
    });
  },
};