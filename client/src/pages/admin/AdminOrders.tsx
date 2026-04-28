import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import styles from './Admin.module.css';

const BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b', baking: '#e91e63', ready: '#10b981', delivered: '#6366f1', cancelled: '#ef4444',
};
const STATUS_BG: Record<string, string> = {
  pending: '#fef3c7', baking: '#fce4ec', ready: '#d1fae5', delivered: '#ede9fe', cancelled: '#fee2e2',
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/admin/orders`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${BASE}/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>All Orders 📦</h1>
          <p className={styles.pageSub}>{orders.length} total orders across all customers.</p>
        </div>

        <div className={styles.filterRow}>
          {['all','pending','baking','ready','delivered','cancelled'].map(s => (
            <button key={s}
              className={`${styles.filterBtn} ${filter === s ? styles.filterActive : ''}`}
              onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Orders</h2>
              <p className={styles.cardSub}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⏳</span>
              <p className={styles.emptyText}>Loading orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📦</span>
              <p className={styles.emptyText}>No orders found</p>
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
              {filtered.map(order => (
                <div key={order.id} className={styles.tableRow}>
                  <span className={styles.orderId}>ORD-{String(order.id).padStart(3,'0')}</span>
                  <div className={styles.customerCell}>
                    <span className={styles.customerAvatar}>{order.user_avatar || '🙋'}</span>
                    <span className={styles.customerName}>{order.user_name}</span>
                  </div>
                  <span className={styles.itemsCell}>{(order.items||[]).map((i:any)=>`${i.quantity}× ${i.name}`).join(', ')}</span>
                  <span className={styles.totalCell}>₱{Number(order.total).toFixed(2)}</span>
                  <span className={styles.dateCell}>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span className={styles.statusBadge} style={{ background: STATUS_BG[order.status], color: STATUS_COLOR[order.status] }}>
                    {order.status}
                  </span>
                  <select className={styles.statusSelect} value={order.status} onChange={e => updateStatus(order.id, e.target.value)}>
                    {['pending','baking','ready','delivered','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
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

export default AdminOrders;