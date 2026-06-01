import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <nav className={styles.navbar}>
      <button className={styles.hostModeBtn} onClick={() => navigate('/host')}>호스트 모드</button>

      <Link to="/" className={styles.logo}>
        <img src="/hiero-logo-b.png" alt="HIERO" className={styles.logoImg} />
      </Link>

      <div className={styles.navRight}>

        <div className={styles.userMenuWrap} ref={dropdownRef}>
          <button
            className={styles.menuToggle}
            onClick={e => { e.stopPropagation(); setDropdownOpen(p => !p); }}
          >
            {user && <span className={styles.userName}>{user.name?.split(' ')[0] || '사용자'} 님</span>}
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              {user ? (
                <>
                  <div className={styles.ddHeader}>
                    <div className={styles.ddName}>{user.name || '사용자'}님</div>
                    <div className={styles.ddSub}>내 계정 관리</div>
                  </div>
                  {[
                    ['내 예약', '/bookings/my'],
                    ['메시지', '/messages'],
                    ['내 정보', '/mypage'],
                  ].map(([label, href]) => (
                    <Link key={label} to={href} className={styles.ddItem} onClick={() => setDropdownOpen(false)}>{label}</Link>
                  ))}
                  <div className={styles.ddDivider} />
                  <button className={`${styles.ddItem} ${styles.ddLogout}`} onClick={() => { logout(); setDropdownOpen(false); }}>로그아웃</button>
                </>
              ) : (
                <>
                  <button className={styles.ddItem} onClick={() => { loginWithGoogle(); setDropdownOpen(false); }}>Google로 로그인</button>
                  <div className={styles.ddDivider} />
                  <a className={styles.ddItem} href="#">고객센터</a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
