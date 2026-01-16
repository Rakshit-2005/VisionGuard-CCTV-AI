import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { apiRequest } from '@/lib/api';

/* =========================
   Types
========================= */
export interface User {
  company_name: string;
  reg_no: string;
  admin_name: string;
  admin_email: string;
  industry_type: string;
  role: 'company_admin' | 'platform_admin';
  name: string;
  email: string;
}

interface RegisterData {
  companyName: string;
  industry: string;
  companyEmail: string;
  companyRegistrationNumber: string;
  adminName: string;
  adminEmail: string;
  adminContact: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

/* =========================
   Context
========================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* =========================
   Provider
========================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // hydrate from localStorage ONCE
  useEffect(() => {
    const stored = localStorage.getItem('safetyai_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  /* -------------------------
     LOGIN
  -------------------------- */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: email, password }),
      });

      const role =
        email === 'admin@gmail.com'
          ? 'platform_admin'
          : 'company_admin';

      const loggedInUser: User = {
        ...res.company,
        role,
        name: res.company.admin_name,
        email: res.company.admin_email,
      };

      setUser(loggedInUser);
      localStorage.setItem(
        'safetyai_user',
        JSON.stringify(loggedInUser)
      );

      return { success: true, user: loggedInUser };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Login failed',
      };
    }
  }, []);

  /* -------------------------
     REGISTER
  -------------------------- */
  const register = useCallback(async (data: RegisterData) => {
    try {
      const payload = {
        company_name: data.companyName,
        industry_type: data.industry,
        company_email: data.companyEmail,
        reg_no: data.companyRegistrationNumber,
        admin_name: data.adminName,
        admin_email: data.adminEmail,
        contact: data.adminContact,
        password: data.password,
      };

      await apiRequest('/company/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Registration failed',
      };
    }
  }, []);

  /* -------------------------
     LOGOUT
  -------------------------- */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('safetyai_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
