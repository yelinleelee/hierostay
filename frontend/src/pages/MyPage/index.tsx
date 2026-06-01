import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import styles from './MyPage.module.css';

const TABS = ['예약내역', '위시리스트', '쿠폰', '내 정보'];

export function MyPage() {
  const { user, loginWithGoogle, becomeHost } = useAuth();
  const [tab, setTab] = useState(0);
  const [pendingHost, setPendingHost] = useState(false);
  const [hostError, setHostError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <div className={styles.loginIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2>로그인이 필요합니다</h2>
        <p>마이페이지를 이용하시려면 로그인해주세요.</p>
        <button className={styles.loginBtn} onClick={loginWithGoogle}>Google로 로그인</button>
      </div>
    );
  }

  async function onBecomeHost() {
    setPendingHost(true);
    setHostError(null);
    try {
      await becomeHost();
    } catch (e) {
      setHostError(e instanceof Error ? e.message : '호스트 전환 실패');
    } finally {
      setPendingHost(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.profileSection}>
        <div className={styles.profileAvatar}>
          {user.avatar ? (
            <img src={user.avatar} alt="" />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
        <div>
          <h2 className={styles.profileName}>{user.name || '사용자'}님</h2>
          <p className={styles.profileEmail}>{user.email}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t, i) => (
          <button key={t} className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {tab === 0 && (
          <div className={styles.empty}>
            <p>예약 내역이 없습니다.</p>
            <p>첫 번째 스테이 여행을 계획해보세요.</p>
          </div>
        )}
        {tab === 1 && (
          <div className={styles.empty}>
            <p>위시리스트가 비어있습니다.</p>
            <p>마음에 드는 스테이를 저장해보세요.</p>
          </div>
        )}
        {tab === 2 && (
          <div className={styles.couponSection}>
            <div className={styles.couponCard}>
              <div className={styles.couponDiscount}>10%</div>
              <div>
                <div className={styles.couponTitle}>첫 예약 할인 쿠폰</div>
                <div className={styles.couponExpiry}>~ 2026. 12. 31.</div>
              </div>
            </div>
          </div>
        )}
        {tab === 3 && (
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>이름</span>
              <span className={styles.infoVal}>{user.name || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>이메일</span>
              <span className={styles.infoVal}>{user.email || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>역할</span>
              <span className={styles.infoVal}>{user.role}</span>
            </div>

            {user.role === 'guest' && (
              <div style={{ marginTop: 24, padding: 18, border: '1px solid var(--border)', borderRadius: 12 }}>
                <p style={{ fontSize: 14, color: 'var(--mid)', marginBottom: 12 }}>
                  호스트로 전환하면 숙소를 등록할 수 있어요.
                </p>
                <button
                  type="button"
                  onClick={onBecomeHost}
                  disabled={pendingHost}
                  className={styles.loginBtn}
                  style={{ background: 'var(--dark)' }}
                >
                  {pendingHost ? '처리 중…' : '호스트로 전환하기'}
                </button>
                {hostError && (
                  <p style={{ marginTop: 10, fontSize: 13, color: '#c0392b' }}>{hostError}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
