import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './Admin.module.css';

const BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const STATUS_COLOR: Record<string, string> = {
  pending:   '#f59e0b',
  baking:    '#e91e63',
  ready:     '#10b981',
  delivered: '#6366f1',
  cancelled: '#ef4444',
};

const STATUS_BG: Record<string, string> = {
  pending:   '#fef3c7',
  baking:    '#fce4ec',
  ready:     '#d1fae5',
  delivered: '#ede9fe',
  cancelled: '#fee2e2',
};

const AdminOverview: React.FC = () => {
  const { user }                  = useAuth();
  const [stats, setStats]         = useState<any>(null);
  const [orders, setOrders]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  const h = { Authorization: `Bearer ${getToken()}` };

  const loadData = () => {
    Promise.all([
      fetch(`${BASE}/admin/stats`,  { headers: h }).then(r => r.json()),
      fetch(`${BASE}/admin/orders`, { headers: h }).then(r => r.json()),
    ]).then(([s, o]) => {
      setStats(s);
      setOrders(Array.isArray(o) ? o : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${BASE}/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...h },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  if (loading) return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <span className={styles.loadingEmoji}>🍪</span>
          <p className={styles.loadingText}>Loading dashboard...</p>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className={styles.page}>

        {/* Welcome header */}
        <div className={styles.welcomeRow}>
          <div>
            <p className={styles.welcomeDate}>{today}</p>
            <h1 className={styles.welcomeTitle}>
              {getGreeting()}, {user?.name?.split(' ')[0]}! {user?.avatar}
            </h1>
            <p className={styles.welcomeSub}>Here's what's happening at Crumb &amp; Bloom today.</p>
          </div>
          <button className={styles.refreshBtn} onClick={loadData}>↻ Refresh</button>
        </div>

        {/* Stats cards */}
        <div className={styles.statsGrid}>
          {[
            { icon: '💰', label: 'Revenue',       value: `₱${Number(stats?.total_revenue || 0).toFixed(2)}`, sub: 'From delivered orders', color: '#880e4f', bg: '#fce4ec' },
            { icon: '📦', label: 'Total Orders',  value: stats?.total_orders  ?? 0, sub: 'All time',         color: '#e91e63', bg: '#fce4ec' },
            { icon: '⏳', label: 'Pending',       value: stats?.pending_orders ?? 0, sub: 'Awaiting action', color: '#f59e0b', bg: '#fef9c3' },
            { icon: '👥', label: 'Customers',     value: stats?.total_users    ?? 0, sub: 'Registered users', color: '#6366f1', bg: '#ede9fe' },
            { icon: '🍪', label: 'Products',      value: stats?.total_products ?? 0, sub: 'Active items',     color: '#10b981', bg: '#d1fae5' },
            { icon: '📬', label: 'Unread Msgs',   value: stats?.unread_messages ?? 0, sub: 'Need reply',      color: '#f97316', bg: '#fff7ed' },
          ].map(s => (
            <div key={s.label} className={styles.statCard} style={{ '--stat-color': s.color, '--stat-bg': s.bg } as any}>
              <div className={styles.statIconWrap} style={{ background: s.bg }}>
                <span className={styles.statIcon}>{s.icon}</span>
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statSub}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders table */}
        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Recent Orders</h2>
              <p className={styles.cardSub}>{orders.length} total orders</p>
            </div>
            <a href="/admin/orders" className={styles.viewAllBtn}>View all →</a>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📦</span>
              <p className={styles.emptyText}>No orders yet</p>
            </div>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Order ID</span>
                <span>Customer</span>
                <span>Items</span>
                <span>Total</span>
                <span>Date</span>
                <span>Status</span>
                <span>Update</span>
              </div>
              {orders.slice(0, 8).map(order => (
                <div key={order.id} className={styles.tableRow}>
                  <span className={styles.orderId}>
                    ORD-{String(order.id).padStart(3, '0')}
                  </span>
                  <div className={styles.customerCell}>
                    <span className={styles.customerAvatar}>{order.user_avatar || '🙋'}</span>
                    <span className={styles.customerName}>{order.user_name}</span>
                  </div>
                  <span className={styles.itemsCell}>
                    {(order.items || []).map((i: any) => i.name).join(', ')}
                  </span>
                  <span className={styles.totalCell}>₱{Number(order.total).toFixed(2)}</span>
                  <span className={styles.dateCell}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className={styles.statusBadge}
                    style={{ background: STATUS_BG[order.status], color: STATUS_COLOR[order.status] }}>
                    {order.status}
                  </span>
                  <select
                    className={styles.statusSelect}
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                  >
                    {['pending','baking','ready','delivered','cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminOverview;