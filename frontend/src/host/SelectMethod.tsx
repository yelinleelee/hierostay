import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

export function SelectMethod() {
  const navigate = useNavigate();

  return (
    <div className={styles.selectPage}>
      <div className={styles.selectHeader}>
        <div className={styles.selectLogo} onClick={() => navigate('/')}>
          OPEN LETTER <span>HOST</span>
        </div>
      </div>
      <div className={styles.selectContent}>
        <h1 className={styles.selectTitle}>숙소 등록 방식을 선택해주세요</h1>
        <p className={styles.selectDesc}>직접 등록하거나 호스트 상담을 통해 등록할 수 있습니다.</p>
        <div className={styles.methodGrid}>
          <div className={styles.methodCard} onClick={() => navigate('/host/register/type')}>
            <div className={styles.methodIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h2 className={styles.methodTitle}>직접 등록</h2>
            <p className={styles.methodDesc}>단계별 가이드를 따라 숙소 정보를 직접 입력합니다. 빠르고 간편하게 등록할 수 있습니다.</p>
            <div className={styles.methodCta}>시작하기 →</div>
          </div>
          <div className={styles.methodCard} onClick={() => navigate('/host/launching')}>
            <div className={styles.methodIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className={styles.methodTitle}>호스트 상담</h2>
            <p className={styles.methodDesc}>전문 호스트 매니저가 등록을 도와드립니다. 처음 등록하는 분들께 추천합니다.</p>
            <div className={styles.methodCta}>상담 신청 →</div>
          </div>
        </div>
      </div>
    </div>
  );
}
