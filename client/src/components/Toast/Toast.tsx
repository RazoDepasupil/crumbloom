import React from 'react';
import styles from './Toast.module.css';

interface Props {
  message: string;
}

const Toast: React.FC<Props> = ({ message }) => (
  <div className={styles.toast} role="status" aria-live="polite">
    {message}
  </div>
);

export default Toast;
