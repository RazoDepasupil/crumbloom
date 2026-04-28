export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'baking' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
}