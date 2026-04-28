import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types';

export const getFavourites = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.* FROM favourites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ? AND p.is_available = TRUE`,
      [req.user?.id]
    ) as any;
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const addFavourite = async (req: AuthRequest, res: Response) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ message: 'product_id is required' });
  try {
    await pool.query(
      'INSERT IGNORE INTO favourites (user_id, product_id) VALUES (?, ?)',
      [req.user?.id, product_id]
    );
    res.status(201).json({ message: 'Added to favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const removeFavourite = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM favourites WHERE user_id = ? AND product_id = ?',
      [req.user?.id, req.params.productId]
    );
    res.json({ message: 'Removed from favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get favourite product_ids for a user (for UI state)
export const getFavouriteIds = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT product_id FROM favourites WHERE user_id = ?',
      [req.user?.id]
    ) as any;
    res.json(rows.map((r: any) => r.product_id));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};