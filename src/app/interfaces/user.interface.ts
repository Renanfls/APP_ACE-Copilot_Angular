export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phase: string;
  phone: string;
  company: string;
  role: string;
  registration: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
  };
  isAdmin: boolean;
} 