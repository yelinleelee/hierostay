import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const MENU = [
  { label: '내 숙소',  path: '/host',            icon: '🏠' },
  { label: '예약',    path: '/host/bookings',    icon: '🧾' },
  { label: '달력',    path: '/host/calendar',    icon: '📅' },
  { label: '리스팅',  path: '/host/listings',    icon: '📋' },
  { label: '메시지',  path: '/host/messages',    icon: '💬' },
];

export function HostSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        {MENU.map(item => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.label}
              className={`${styles.sidebarItem} ${active ? styles.sidebarItemActive : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.sidebarIcon}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
