import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const MENU = [
  { label: '내 숙소',   path: '/host' },
  { label: '예약 관리', path: '/host/bookings' },
  { label: '정산',      path: null },
  { label: '리뷰',      path: null },
  { label: '설정',      path: null },
];

export function HostSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo} onClick={() => navigate('/')}>
        OPEN LETTER<span>HOST</span>
      </div>
      <nav className={styles.sidebarNav}>
        {MENU.map(item => {
          const active = item.path !== null && location.pathname === item.path;
          return (
            <div
              key={item.label}
              className={`${styles.sidebarItem} ${active ? styles.sidebarItemActive : ''}`}
              onClick={() => item.path && navigate(item.path)}
              style={{ cursor: item.path ? 'pointer' : 'default', opacity: item.path ? 1 : 0.5 }}
            >
              {item.label}
            </div>
          );
        })}
      </nav>
      <button className={styles.guestModeBtn} onClick={() => navigate('/')}>← 게스트 모드</button>
    </aside>
  );
}
