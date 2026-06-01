import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { RegisterProvider, useRegister } from './RegisterContext';

const STEPS = [
  { path: 'type', label: '숙소 유형' },
  { path: 'basics', label: '기본 정보' },
  { path: 'description', label: '설명' },
  { path: 'location', label: '위치' },
  { path: 'photos', label: '사진' },
  { path: 'price', label: '가격' },
];

const STEP_PATHS = STEPS.map((s) => s.path);

function RegisterLayoutInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submit, submitting, submitError } = useRegister();

  const currentStep = STEP_PATHS.findIndex((p) => location.pathname.endsWith(`/${p}`));
  const total = STEP_PATHS.length;
  const progress = currentStep >= 0 ? ((currentStep + 1) / total) * 100 : 0;
  const isSuccess = location.pathname.endsWith('/success');

  function goPrev() {
    if (submitting) return;
    if (currentStep > 0) navigate(`/host/register/${STEP_PATHS[currentStep - 1]}`);
    else navigate('/host/register/select');
  }

  async function goNext() {
    if (submitting) return;
    if (currentStep >= 0 && currentStep < total - 1) {
      navigate(`/host/register/${STEP_PATHS[currentStep + 1]}`);
    } else if (currentStep === total - 1) {
      const res = await submit();
      if (res.ok) navigate('/host/register/success');
    }
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerHeader}>
        {!isSuccess && currentStep >= 0 && (
          <div className={styles.stepIndicator}>{currentStep + 1} / {total}</div>
        )}
      </div>

      {!isSuccess && currentStep >= 0 && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className={styles.registerContent}>
        <Outlet />
        {submitError && currentStep === total - 1 && (
          <div style={{ width: '100%', maxWidth: 600, marginTop: 16, padding: 14, background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: 10, color: '#c0392b', fontSize: 14 }}>
            {submitError}
          </div>
        )}
      </div>

      {!isSuccess && currentStep >= 0 && (
        <div className={styles.registerFooter}>
          <button className={styles.prevBtn} onClick={goPrev} disabled={submitting}>이전</button>
          <button className={styles.nextBtn} onClick={goNext} disabled={submitting}>
            {currentStep === total - 1
              ? (submitting ? '등록 중...' : '등록 완료')
              : '다음'}
          </button>
        </div>
      )}
    </div>
  );
}

export function RegisterLayout() {
  return (
    <RegisterProvider>
      <RegisterLayoutInner />
    </RegisterProvider>
  );
}
