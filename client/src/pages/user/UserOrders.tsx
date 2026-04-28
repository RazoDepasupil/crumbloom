import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
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

const FILTERS = ['All', 'pending', 'baking', 'ready', 'delivered', 'cancelled'];

const UserOrders: React.FC = () => {
  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch(`${BASE}/orders/my`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setError('Failed to load orders.'); setLoading(false); });
  }, []);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + Number(o.total), 0);

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Orders 📦</h1>
          <p className={styles.pageSub}>Track and manage all your orders.</p>
        </div>

        {/* Summary strip */}
        <div className={styles.orderSummaryStrip}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryVal}>{orders.length}</span>
            <span className={styles.summaryLbl}>Total Orders</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryVal}>{orders.filter(o => ['pending','baking','ready'].includes(o.status)).length}</span>
            <span className={styles.summaryLbl}>Active</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryVal}>{orders.filter(o => o.status === 'delivered').length}</span>
            <span className={styles.summaryLbl}>Delivered</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryVal}>${totalSpent.toFixed(2)}</span>
            <span className={styles.summaryLbl}>Spent</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
              style={filter === f && STATUS_COLOR[f] ? { background: STATUS_COLOR[f], borderColor: STATUS_COLOR[f] } : {}}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className={styles.errorBox}>⚠️ {error}</div>
        )}

        {loading ? (
          <div className={styles.section} style={{ textAlign: 'center', padding: 60 }}>
            <span style={{ fontSize: 36 }}>⏳</span>
            <p className={styles.loadingText}>Loading your orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📦</span>
            <p className={styles.emptyTitle}>{filter === 'All' ? 'No orders yet' : `No ${filter} orders`}</p>
            <p className={styles.emptyText}>
              {filter === 'All' ? 'Browse the menu and place your first order!' : 'Try selecting a different filter.'}
            </p>
            {filter === 'All' && <a href="/menu" className={styles.emptyBtn}>Browse Menu →</a>}
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filtered.map(order => (
              <div key={order.id} className={styles.orderCardFull}>
                {/* Card header */}
                <div className={styles.orderCardFullHeader}>
                  <div>
                    <span className={styles.orderCardId}>ORD-{String(order.id).padStart(3, '0')}</span>
                    <span className={styles.orderCardDate}>{new Date(order.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</span>
                  </div>
                  <span className={styles.statusPill} style={{ background: STATUS_COLOR[order.status] + '22', color: STATUS_COLOR[order.status] }}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className={styles.orderItemsList}>
                  {(order.items || []).map((item: any, i: number) => (
                    <div key={i} className={styles.orderItemRow}>
                      <span className={styles.orderItemEmoji}>🍪</span>
                      <span className={styles.orderItemName}>{item.name}</span>
                      <span className={styles.orderItemQty}>×{item.quantity}</span>
                      <span className={styles.orderItemPrice}>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className={styles.orderCardFullFooter}>
                  <span className={styles.orderTotalLabel}>Total</span>
                  <span className={styles.orderTotalVal}>₱{Number(order.total).toFixed(2)}</span>
                </div>

                {/* Progress bar for active */}
                {['pending', 'baking', 'ready'].includes(order.status) && (
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressStepsRow}>
                      {STATUS_STEPS.map((step, i) => {
                        const currentIdx = STATUS_STEPS.indexOf(order.status);
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
                    <div className={styles.progressBar}>
                      <div className={styles.progressBarFill} style={{
                        width: order.status === 'pending' ? '20%' : order.status === 'baking' ? '55%' : '85%'
                      }} />
                    </div>
                  </div>
                )}

                {order.note && (
                  <p className={styles.orderNote}>📝 Note: {order.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserOrders;