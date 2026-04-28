import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types';

export const placeOrder = async (req: AuthRequest, res: Response) => {
  const { items, note } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ message: 'Order must have at least one item' });

  const total = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total, note) VALUES (?, ?, ?)',
      [req.user?.id, total, note || null]
    ) as any;
    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES (?,?,?,?,?)',
        [orderId, item.product_id, item.name, item.quantity, item.price]
      );
    }
    await conn.commit();
    res.status(201).json({ id: orderId, message: 'Order placed successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error', error: err });
  } finally {
    conn.release();
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user?.id]
    ) as any;
    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]) as any;
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const [orders] = await pool.query(
      'SELECT o.*, u.name AS user_name, u.email AS user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?',
      [req.params.id]
    ) as any;
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });
    const order = orders[0];
    if (req.user?.role !== 'admin' && order.user_id !== req.user?.id)
      return res.status(403).json({ message: 'Not authorized' });
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]) as any;
    order.items = items;
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getAllOrders = async (_req: AuthRequest, res: Response) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name AS user_name, u.email AS user_email, u.avatar AS user_avatar
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    ) as any;
    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]) as any;
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const valid = ['pending', 'baking', 'ready', 'delivered', 'cancelled'];
  if (!valid.includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};