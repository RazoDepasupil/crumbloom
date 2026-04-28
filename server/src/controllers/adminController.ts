import { Request, Response } from 'express';
import pool from '../config/db';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [[{ total_revenue }]] = await pool.query("SELECT COALESCE(SUM(total),0) AS total_revenue FROM orders WHERE status='delivered'") as any;
    const [[{ total_orders }]]  = await pool.query('SELECT COUNT(*) AS total_orders FROM orders') as any;
    const [[{ total_users }]]   = await pool.query("SELECT COUNT(*) AS total_users FROM users WHERE role='user'") as any;
    const [[{ total_products }]]= await pool.query('SELECT COUNT(*) AS total_products FROM products WHERE is_available=TRUE') as any;
    const [[{ pending_orders }]]= await pool.query("SELECT COUNT(*) AS pending_orders FROM orders WHERE status='pending'") as any;
    const [[{ unread_messages }]]= await pool.query('SELECT COUNT(*) AS unread_messages FROM messages WHERE is_read=FALSE') as any;
    res.json({ total_revenue, total_orders, total_users, total_products, pending_orders, unread_messages });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, gender, avatar, phone, address, created_at FROM users WHERE role='user' ORDER BY created_at DESC"
    ) as any;
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};