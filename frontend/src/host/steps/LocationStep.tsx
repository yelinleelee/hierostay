import styles from '../Register.module.css';
import { useRegister } from '../RegisterContext';

const REGIONS = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '부산', '제주'];

export function LocationStep() {
  const { data, setField } = useRegister();
  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>숙소 위치를 알려주세요</h1>
      <p className={styles.stepDesc}>정확한 주소는 예약 확정 후 게스트에게 공개됩니다.</p>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>지역</label>
        <select
          className={styles.formInput}
          value={data.city}
          onChange={e => setField('city', e.target.value)}
          style={{ appearance: 'auto' }}
        >
          <option value="">지역 선택</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>상세 주소</label>
        <input
          className={styles.formInput}
          type="text"
          placeholder="도로명 주소를 입력해주세요"
          value={data.address}
          onChange={e => setField('address', e.target.value)}
        />
      </div>
    </div>
  );
}
