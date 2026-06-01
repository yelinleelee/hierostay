import styles from '../Register.module.css';
import { useRegister } from '../RegisterContext';

export function DescriptionStep() {
  const { data, setField } = useRegister();
  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>숙소를 소개해주세요</h1>
      <p className={styles.stepDesc}>숙소 이름과 설명을 입력해주세요.</p>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>숙소 이름</label>
        <input
          className={styles.formInput}
          type="text"
          placeholder="예: 신당동 오픈레터하우스"
          value={data.name}
          onChange={e => setField('name', e.target.value)}
          maxLength={50}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>숙소 설명</label>
        <textarea
          className={`${styles.formInput} ${styles.formTextarea}`}
          placeholder="숙소의 특징과 매력을 자유롭게 소개해주세요."
          value={data.description}
          onChange={e => setField('description', e.target.value)}
          maxLength={500}
        />
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--light)', marginTop: 4 }}>{data.description.length}/500</div>
      </div>
    </div>
  );
}
