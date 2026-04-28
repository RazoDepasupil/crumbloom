import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useScrolled } from '../../hooks/useScrolled';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Menu',    path: '/menu'    },
  { label: 'Story',   path: '/story'   },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const { totalItems, dispatch } = useCart();
  const { user, logout } = useAuth();
  const scrolled = useScrolled(60);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isHome = location.pathname === '/';
  const solidNav = !isHome || scrolled;

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogo = () => {
    setSidebarOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 1000);
    }
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`${styles.nav} ${solidNav ? styles.scrolled : ''}`}>
        <a onClick={handleLogo} className={styles.logo} style={{ cursor: 'pointer' }}>
          Crumb<span>&amp;</span>Bloom
        </a>

        <ul className={styles.links}>
          {NAV_LINKS.map(({ label, path }) => (
            <li key={path}>
              <Link to={path} className={location.pathname === path ? styles.active : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.rightSide}>
          {user ? (
            <div className={styles.userMenu}>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className={styles.dashboardBtn}
              >
                {user.avatar} {user.name.split(' ')[0]}
              </Link>
              <button className={styles.signOutBtn} onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Sign In →
            </Link>
          )}

          <button
            className={styles.cartBtn}
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            aria-label="Open cart"
          >
            🛍 Cart
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </button>

          <button
            className={`${styles.hamburger} ${sidebarOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>Crumb<span>&amp;</span>Bloom</span>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <ul className={styles.sidebarLinks}>
          {NAV_LINKS.map(({ label, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`${styles.sidebarLink} ${location.pathname === path ? styles.sidebarActive : ''}`}
              >
                {label}
                <span className={styles.sidebarArrow}>→</span>
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className={styles.sidebarLink}>
                  {user.avatar} Dashboard
                  <span className={styles.sidebarArrow}>→</span>
                </Link>
              </li>
              <li>
                <a className={styles.sidebarLink} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  🚪 Sign Out
                  <span className={styles.sidebarArrow}>→</span>
                </a>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className={styles.sidebarLink}>
                🔑 Sign In
                <span className={styles.sidebarArrow}>→</span>
              </Link>
            </li>
          )}
        </ul>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.sidebarCartBtn}
            onClick={() => { setSidebarOpen(false); dispatch({ type: 'TOGGLE_CART' }); }}
          >
            🛍 View Cart {totalItems > 0 && `(${totalItems})`}
          </button>
          <p className={styles.sidebarTagline}>Baked fresh daily with love 🌸</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;