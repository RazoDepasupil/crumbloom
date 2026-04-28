import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './User.module.css';

const BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const STATUS_COLOR: Record<string, string> = {
  pending:   '#f59e0b',
  baking:    '#e91e63',
  ready:     '#10b981',
  delivered: '#6366f1',
  cancelled: '#ef4444',
};

const STATUS_STEPS = ['pending', 'baking', 'ready', 'delivered'];

const UserHome: React.FC = () => {
  const { user }                    = useAuth();
  const [orders, setOrders]         = useState<any[]>([]);
  const [products, setProducts]     = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getToken()}` };

    fetch(`${BASE}/orders/my`, { headers })
      .then(r => r.json())
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoadingOrders(false); })
      .catch(() => setLoadingOrders(false));

    fetch(`${BASE}/products`)
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d : []));
  }, []);

  const totalSpent   = orders.reduce((s, o) => s + Number(o.total), 0);
  const activeOrders = orders.filter(o => ['pending', 'baking', 'ready'].includes(o.status));
  const activeOrder  = activeOrders[0] || null;
  const delivered    = orders.filter(o => o.status === 'delivered').length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeLeft}>
            <span className={styles.welcomeAvatar}>{user?.avatar}</span>
            <div>
              <p className={styles.welcomeGreeting}>{getGreeting()},</p>
              <h1 className={styles.welcomeName}>{user?.name} 👋</h1>
              <p className={styles.welcomeSub}>
                {user?.address ? `📍 ${user.address}` : 'Welcome to your dashboard'}
              </p>
            </div>
          </div>
          <Link to="/menu" className={styles.shopNowBtn}>
            🍪 Shop Now
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📦</span>
            <p className={styles.statValue} style={{ color: '#e91e63' }}>{orders.length}</p>
            <p className={styles.statLabel}>Total Orders</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✅</span>
            <p className={styles.statValue} style={{ color: '#10b981' }}>{delivered}</p>
            <p className={styles.statLabel}>Delivered</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>⏳</span>
            <p className={styles.statValue} style={{ color: '#f59e0b' }}>{activeOrders.length}</p>
            <p className={styles.statLabel}>Active</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>💰</span>
            <p className={styles.statValue} style={{ color: '#880e4f' }}>${totalSpent.toFixed(2)}</p>
            <p className={styles.statLabel}>Total Spent</p>
          </div>
        </div>

        {/* Active order tracker */}
        {activeOrder && (
          <div className={styles.trackerCard}>
            <div className={styles.trackerTop}>
              <div>
                <p className={styles.trackerLabel}>🔥 Order in Progress</p>
                <h3 className={styles.trackerId}>ORD-{String(activeOrder.id).padStart(3, '0')}</h3>
                <p className={styles.trackerItems}>
                  {(activeOrder.items || []).map((i: any) => `${i.quantity}× ${i.name}`).join(' · ')}
                </p>
              </div>
              <span className={styles.trackerTotal}>${Number(activeOrder.total).toFixed(2)}</span>
            </div>

            {/* Progress steps */}
            <div className={styles.progressTrack}>
              {STATUS_STEPS.map((step, i) => {
                const currentIdx = STATUS_STEPS.indexOf(activeOrder.status);
                const isActive   = i <= currentIdx;
                const isDone     = i < currentIdx;
                return (
                  <React.Fragment key={step}>
                    <div className={styles.progressStep}>
                      <div className={`${styles.progressDot} ${isActive ? styles.progressDotActive : ''} ${isDone ? styles.progressDotDone : ''}`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <span className={`${styles.progressLabel} ${isActive ? styles.progressLabelActive : ''}`}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`${styles.progressLine} ${isDone ? styles.progressLineDone : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className={styles.trackerStatusRow}>
              <span className={styles.statusPill} style={{ background: STATUS_COLOR[activeOrder.status] + '22', color: STATUS_COLOR[activeOrder.status] }}>
                {activeOrder.status}
              </span>
              <Link to="/dashboard/orders" className={styles.trackerLink}>View details →</Link>
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Orders</h2>
            <Link to="/dashboard/orders" className={styles.sectionLink}>View all →</Link>
          </div>

          {loadingOrders ? (
            <p className={styles.loadingText}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🍪</span>
              <p className={styles.emptyTitle}>No orders yet</p>
              <p className={styles.emptyText}>Browse the menu and place your first order!</p>
              <Link to="/menu" className={styles.emptyBtn}>Browse Menu →</Link>
            </div>
          ) : (
            orders.slice(0, 3).map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderCardHeader}>
                  <span className={styles.orderCardId}>ORD-{String(order.id).padStart(3, '0')}</span>
                  <span className={styles.statusPill} style={{ background: STATUS_COLOR[order.status] + '22', color: STATUS_COLOR[order.status] }}>
                    {order.status}
                  </span>
                  <span className={styles.orderCardDate}>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <p className={styles.orderCardItems}>
                  {(order.items || []).map((i: any) => `${i.quantity}× ${i.name}`).join(' · ')}
                </p>
                <div className={styles.orderCardFooter}>
                  <span className={styles.orderCardTotal}>${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Suggested products */}
        {products.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>You Might Like 🌸</h2>
              <Link to="/menu" className={styles.sectionLink}>See all →</Link>
            </div>
            <div className={styles.suggestGrid}>
              {products.slice(0, 4).map((p: any) => (
                <div key={p.id} className={styles.suggestCard}>
                  <div className={styles.suggestTop}>
                    <span className={styles.suggestEmoji}>🍪</span>
                    {p.tag && <span className={styles.suggestTag}>{p.tag}</span>}
                  </div>
                  <div className={styles.suggestBody}>
                    <p className={styles.suggestName}>{p.name}</p>
                    <p className={styles.suggestPrice}>${Number(p.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserHome;