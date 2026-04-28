import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types';

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE is_available = TRUE ORDER BY id ASC'
    ) as any;
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]) as any;
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, stock, tag } = req.body;
  if (!name || !description || !price)
    return res.status(400).json({ message: 'Name, description and price are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, stock, tag) VALUES (?,?,?,?,?,?)',
      [name, description, price, category || null, stock || 100, tag || null]
    ) as any;
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, stock, tag, is_available } = req.body;
  try {
    await pool.query(
      'UPDATE products SET name=?, description=?, price=?, category=?, stock=?, tag=?, is_available=? WHERE id=?',
      [name, description, price, category || null, stock, tag || null, is_available, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await pool.query('UPDATE products SET is_available = FALSE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Admin: update only the tag
export const updateProductTag = async (req: AuthRequest, res: Response) => {
  const { tag } = req.body;
  const validTags = ['Bestseller', 'New', 'Fan Fave', 'Limited', 'Sale', null, ''];
  if (!validTags.includes(tag))
    return res.status(400).json({ message: 'Invalid tag' });
  try {
    await pool.query(
      'UPDATE products SET tag = ? WHERE id = ?',
      [tag || null, req.params.id]
    );
    res.json({ message: 'Tag updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};