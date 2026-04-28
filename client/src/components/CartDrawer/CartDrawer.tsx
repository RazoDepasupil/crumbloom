import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './CartDrawer.module.css';

const BASE = 'http://localhost:5000/api';

interface Props { onOrder: () => void; }

const CartDrawer: React.FC<Props> = ({ onOrder }) => {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [err, setErr]         = useState('');

  if (!state.isOpen) return null;

  const handleOrder = async () => {
    setPlacing(true); setErr('');
    try {
      const items = state.items.map(i => ({
        product_id: i.cookie.id,
        name:       i.cookie.name,
        quantity:   i.quantity,
        price:      i.cookie.price,
      }));
      const res = await fetch(`${BASE}/orders`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) { const d=await res.json(); setErr(d.message||'Failed to place order.'); setPlacing(false); return; }
      dispatch({ type:'CLEAR_CART' });
      dispatch({ type:'CLOSE_CART' });
      onOrder();
      navigate('/dashboard/orders');
    } catch { setErr('Cannot connect to server.'); setPlacing(false); }
  };

  const goTo = (path: string) => { dispatch({ type:'CLOSE_CART' }); navigate(path); };

  return (
    <>
      <div className={styles.overlay} onClick={()=>dispatch({ type:'CLOSE_CART' })} />
      <aside className={styles.drawer} role="dialog" aria-label="Shopping cart">
        <div className={styles.header}>
          <h2 className={styles.title}>Cart</h2>
          <button className={styles.closeBtn} onClick={()=>dispatch({ type:'CLOSE_CART' })}>✕</button>
        </div>
        <div className={styles.body}>
          {totalItems === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyEmoji}>🍪</span>
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptyText}>Add some products to get started</p>
            </div>
          ) : state.items.map(item=>(
            <div key={item.cookie.id} className={styles.item}>
              <div className={styles.itemEmoji}>🍪</div>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.cookie.name}</p>
                <p className={styles.itemPrice}>₱{(item.cookie.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className={styles.qtyControls}>
                <button className={styles.qtyBtn} onClick={()=>dispatch({ type:'DECREASE_QTY', payload:item.cookie.id })}>−</button>
                <span className={styles.qty}>{item.quantity}</span>
                <button className={styles.qtyBtn} onClick={()=>dispatch({ type:'INCREASE_QTY', payload:item.cookie.id })}>+</button>
              </div>
            </div>
          ))}
        </div>

        {totalItems > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
            </div>
            {err && <p style={{ fontFamily:'var(--font-body)', fontSize:12, color:'#ef4444', textAlign:'center' }}>⚠️ {err}</p>}
            {user ? (
              <button className={styles.checkoutBtn} onClick={handleOrder} disabled={placing}>
                {placing ? 'Placing...' : 'Place Order'}
              </button>
            ) : (
              <div className={styles.authPrompt}>
                <p className={styles.authNote}>Sign in to complete your order</p>
                <button className={styles.loginBtn} onClick={()=>goTo('/login')}>Sign In</button>
                <button className={styles.signupBtn} onClick={()=>goTo('/login?tab=signup')}>Create Account</button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;