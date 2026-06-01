import styles from '../Register.module.css';
import { useRegister } from '../RegisterContext';

export function PriceStep() {
  const { data, setField } = useRegister();
  const price = data.price;
  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>1박 가격을 설정해주세요</h1>
      <p className={styles.stepDesc}>비슷한 스테이의 가격을 참고해 적절한 가격을 정해보세요.</p>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>1박 가격 (원)</label>
        <div className={styles.priceWrap}>
          <span className={styles.pricePrefix}>₩</span>
          <input
            className={`${styles.formInput} ${styles.priceInput}`}
            type="number"
            placeholder="100,000"
            value={price}
            onChange={e => setField('price', e.target.value)}
            min={10000}
            step={1000}
          />
        </div>
      </div>
      {price && Number(price) > 0 && (
        <div style={{ marginTop: 16, padding: 20, background: '#f5f5f5', borderRadius: 12, fontSize: 14, color: 'var(--mid)' }}>
          게스트에게 표시되는 가격: <strong style={{ color: 'var(--dark)', fontSize: 18 }}>₩{Number(price).toLocaleString()}</strong> / 박
        </div>
      )}
    </div>
  );
}
