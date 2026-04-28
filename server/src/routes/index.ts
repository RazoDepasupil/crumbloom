import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductTag } from '../controllers/productController';
import { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { getFavourites, addFavourite, removeFavourite, getFavouriteIds } from '../controllers/favouriteController';
import { sendMessage, getAllMessages, markMessageRead } from '../controllers/messageController';
import { getDashboardStats, getAllUsers } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login',    login);
router.get ('/auth/me',       authenticate, getMe);
router.put ('/auth/profile',  authenticate, updateProfile);

// Products (public read, admin write)
router.get   ('/products',        getAllProducts);
router.get   ('/products/:id',    getProductById);
router.post  ('/products',        authenticate, requireAdmin, createProduct);
router.put   ('/products/:id',    authenticate, requireAdmin, updateProduct);
router.patch ('/products/:id/tag',authenticate, requireAdmin, updateProductTag);
router.delete('/products/:id',    authenticate, requireAdmin, deleteProduct);

// Orders
router.post('/orders',             authenticate, placeOrder);
router.get ('/orders/my',          authenticate, getMyOrders);
router.get ('/orders/:id',         authenticate, getOrderById);
router.get ('/admin/orders',       authenticate, requireAdmin, getAllOrders);
router.put ('/admin/orders/:id',   authenticate, requireAdmin, updateOrderStatus);

// Favourites
router.get   ('/favourites',            authenticate, getFavourites);
router.get   ('/favourites/ids',        authenticate, getFavouriteIds);
router.post  ('/favourites',            authenticate, addFavourite);
router.delete('/favourites/:productId', authenticate, removeFavourite);

// Messages
router.post('/messages',            sendMessage);
router.get ('/admin/messages',      authenticate, requireAdmin, getAllMessages);
router.put ('/admin/messages/:id',  authenticate, requireAdmin, markMessageRead);

// Admin
router.get('/admin/stats',  authenticate, requireAdmin, getDashboardStats);
router.get('/admin/users',  authenticate, requireAdmin, getAllUsers);

export default router;