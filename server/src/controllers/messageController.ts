import { Request, Response } from 'express';
import pool from '../config/db';

export const sendMessage = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: 'All fields are required' });
  try {
    await pool.query('INSERT INTO messages (name, email, message) VALUES (?,?,?)', [name, email, message]);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getAllMessages = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC') as any;
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const markMessageRead = async (req: Request, res: Response) => {
  try {
    await pool.query('UPDATE messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};