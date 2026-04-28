export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  gender?: 'male' | 'female' | 'other';
  avatar: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  stock: number;
  is_available: boolean;
  tag?: 'Bestseller' | 'New' | 'Fan Fave' | 'Limited' | 'Sale' | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  total: number;
  status: 'pending' | 'baking' | 'ready' | 'delivered' | 'cancelled';
  note?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

import { Request } from 'express';
export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}