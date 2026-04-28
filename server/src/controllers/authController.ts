import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { AuthRequest } from '../types';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, gender, avatar } = req.body;
  if (!name || !email || !password || !gender || !avatar)
    return res.status(400).json({ message: 'Name, email, password, gender and avatar are required' });

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]) as any;
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, gender, avatar) VALUES (?, ?, ?, "user", ?, ?)',
      [name, email, hashed, gender, avatar]
    ) as any;

    const token = jwt.sign(
      { id: result.insertId, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: result.insertId, name, email, role: 'user', gender, avatar }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]) as any;
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid email or password' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, gender, avatar, phone, address, created_at FROM users WHERE id = ?',
      [req.user?.id]
    ) as any;
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, phone, address, avatar } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, avatar = ? WHERE id = ?',
      [name, phone, address, avatar, req.user?.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};