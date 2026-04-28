import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import styles from './Admin.module.css';

const BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<'all'|'unread'|'read'>('all');

  useEffect(() => {
    fetch(`${BASE}/admin/messages`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { setMessages(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const markRead = async (id: number) => {
    await fetch(`${BASE}/admin/messages/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${getToken()}` } });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const filtered = filter === 'all' ? messages
    : filter === 'unread' ? messages.filter(m => !m.is_read)
    : messages.filter(m => m.is_read);

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Messages 📬</h1>
          <p className={styles.pageSub}>
            {messages.length} total · {unreadCount} unread
          </p>
        </div>

        <div className={styles.filterRow}>
          {(['all','unread','read'] as const).map(f => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
            </button>
          ))}
        </div>

        <div className={styles.section}>
          {loading ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⏳</span>
              <p className={styles.emptyText}>Loading messages...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📭</span>
              <p className={styles.emptyText}>No {filter === 'all' ? '' : filter} messages.</p>
            </div>
          ) : (
            <div className={styles.messageList}>
              {filtered.map(msg => (
                <div key={msg.id} className={styles.messageCard}
                  style={{ borderLeftColor: msg.is_read ? '#f0e0ea' : 'var(--pink-500)', opacity: msg.is_read ? 0.75 : 1 }}>
                  <div className={styles.messageMeta}>
                    <span className={styles.messageName}>{msg.name}</span>
                    <span className={styles.messageEmail}>{msg.email}</span>
                    <span className={styles.messageDate}>{new Date(msg.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</span>
                    {!msg.is_read && (
                      <button className={styles.markReadBtn} onClick={() => markRead(msg.id)}>
                        ✓ Mark read
                      </button>
                    )}
                  </div>
                  <p className={styles.messageText}>{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminMessages;