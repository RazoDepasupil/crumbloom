import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardLayout.module.css';

interface NavItem {
  icon: string;
  label: string;
  path: string;
  badge?: number;
}

const ADMIN_NAV: NavItem[] = [
  { icon: '📊', label: 'Overview',   path: '/admin'            },
  { icon: '📦', label: 'Orders',     path: '/admin/orders'     },
  { icon: '🍪', label: 'Products',   path: '/admin/menu'       },
  { icon: '👥', label: 'Customers',  path: '/admin/customers'  },
  { icon: '📬', label: 'Messages',   path: '/admin/messages'   },
];

const USER_NAV: NavItem[] = [
  { icon: '🏠', label: 'Home',        path: '/dashboard'                },
  { icon: '📦', label: 'My Orders',   path: '/dashboard/orders'         },
  { icon: '❤️', label: 'Favourites',  path: '/dashboard/favourites'     },
  { icon: '👤', label: 'Profile',     path: '/dashboard/profile'        },
];

const PAGE_TITLES: Record<string, string> = {
  '/admin':               'Overview',
  '/admin/orders':        'Orders',
  '/admin/menu':          'Products',
  '/admin/customers':     'Customers',
  '/admin/messages':      'Messages',
  '/dashboard':           'Home',
  '/dashboard/orders':    'My Orders',
  '/dashboard/favourites':'Favourites',
  '/dashboard/profile':   'Profile',
};

interface Props { children: React.ReactNode; }

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { user, logout, isAdmin }   = useAuth();
  const location                    = useLocation();
  const navigate                    = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread]           = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  const navItems    = isAdmin ? ADMIN_NAV : USER_NAV;
  const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  // Load badge counts for admin
  useEffect(() => {
    if (!isAdmin) return;
    const h = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    fetch('http://localhost:5000/api/admin/stats', { headers: h })
      .then(r => r.json())
      .then(d => {
        setUnread(d.unread_messages || 0);
        setPendingOrders(d.pending_orders || 0);
      })
      .catch(() => {});
  }, [isAdmin, location.pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBadge = (path: string) => {
    if (path === '/admin/messages') return unread;
    if (path === '/admin/orders')   return pendingOrders;
    return 0;
  };

  return (
    <div className={styles.layout}>
      {/* Overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIconWrap}>
            <span className={styles.brandIcon}>🍪</span>
          </div>
          <div>
            <p className={styles.brandName}>Crumb &amp; Bloom</p>
            <p className={styles.brandRole}>
              {isAdmin ? '⚙️ Admin Panel' : '✨ My Account'}
            </p>
          </div>
        </div>

        {/* User card */}
        <div className={styles.userCard}>
          <div className={styles.userAvatarWrap}>
            <span className={styles.userAvatar}>{user?.avatar}</span>
            <span className={styles.onlineDot} />
          </div>
          <div className={styles.userText}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <span className={styles.roleBadge}
            style={{ background: isAdmin ? 'rgba(255,255,255,.15)' : 'rgba(255,192,203,.25)' }}>
            {isAdmin ? 'Admin' : 'User'}
          </span>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          <p className={styles.navSection}>
            {isAdmin ? 'Management' : 'Navigation'}
          </p>
          {navItems.map(item => {
            const badge    = getBadge(item.path);
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {badge > 0 && (
                  <span className={styles.navBadge}>{badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className={styles.sidebarBottom}>
          <div className={styles.divider} />
          <Link to="/" className={styles.storeLink}>
            <span>🛍</span>
            <span>Visit Store</span>
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.hamburger}
              onClick={() => setSidebarOpen(p => !p)}
              aria-label="Toggle sidebar"
            >
              <span /><span /><span />
            </button>
            <div className={styles.topbarTitle}>
              <h2 className={styles.pageTitle}>{currentTitle}</h2>
              <p className={styles.breadcrumb}>
                {isAdmin ? 'Admin' : 'Account'} / {currentTitle}
              </p>
            </div>
          </div>

          <div className={styles.topbarRight}>
            {isAdmin && unread > 0 && (
              <Link to="/admin/messages" className={styles.notifBtn} title={`${unread} unread messages`}>
                📬
                <span className={styles.notifBadge}>{unread}</span>
              </Link>
            )}
            <div className={styles.topbarUser}>
              <span className={styles.topbarAvatar}>{user?.avatar}</span>
              <div className={styles.topbarUserText}>
                <p className={styles.topbarName}>{user?.name?.split(' ')[0]}</p>
                <p className={styles.topbarRole}>{isAdmin ? 'Admin' : 'User'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;