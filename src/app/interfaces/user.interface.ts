export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyCode: string;
  registration: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  createdAt: Date;
  isAdmin: boolean;
  username?: string;
  password?: string;
  role: string;
  avatar?: string;
  phase?: string;
  company?: string;
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
  };
} 