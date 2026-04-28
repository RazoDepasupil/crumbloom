import React from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import styles from './Admin.module.css';

const MOCK_MESSAGES = [
  { id: 1, name: 'Maria Santos', email: 'maria@email.com', message: 'Hi! I wanted to order a custom gift box for my friend\'s birthday next Saturday. Can you do 12 cookies with a mix of rose velvet and strawberry cloud?', date: '2026-03-14' },
  { id: 2, name: 'Jake Reyes',   email: 'jake@email.com',  message: 'Are the brown butter classic cookies available every day? I want to make sure before I come in.', date: '2026-03-13' },
  { id: 3, name: 'Ana Cruz',     email: 'ana@email.com',   message: 'Do you deliver to Daraga? We have a small office there and would love to order a corporate batch for our team!', date: '2026-03-12' },
];

const AdminMessages: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Messages 📬</h1>
          <p className={styles.pageSub}>Customer inquiries from the Contact page.</p>
        </div>

        <div className={styles.section}>
          <div className={styles.messageList}>
            {MOCK_MESSAGES.map(msg => (
              <div key={msg.id} className={styles.messageCard}>
                <div className={styles.messageMeta}>
                  <span className={styles.messageName}>{msg.name}</span>
                  <span className={styles.messageEmail}>{msg.email}</span>
                  <span className={styles.messageDate}>{msg.date}</span>
                </div>
                <p className={styles.messageText}>{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminMessages;