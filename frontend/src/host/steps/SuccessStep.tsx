import { useNavigate } from 'react-router-dom';
import styles from '../Register.module.css';

export function SuccessStep() {
  const navigate = useNavigate();
  return (
    <div className={styles.successPage}>
      <div className={styles.successIcon}>🎉</div>
      <h1 className={styles.successTitle}>숙소 등록이 완료되었습니다!</h1>
      <p className={styles.successDesc}>
        등록 신청이 접수되었습니다. 오픈레터하우스 팀이 검토 후 승인하면 서비스에 등재됩니다.
        보통 1~3 영업일이 소요됩니다.
      </p>
      <div className={styles.successBtns}>
        <button className={styles.successPrimaryBtn} onClick={() => navigate('/host')}>대시보드로 이동</button>
        <button className={styles.successSecondaryBtn} onClick={() => navigate('/')}>홈으로 이동</button>
      </div>
    </div>
  );
}
