import styles from '../Register.module.css';
import { useRegister } from '../RegisterContext';
import type { PropertyType } from '../../types/property';

const TYPES: { icon: string; label: string; desc: string; value: PropertyType }[] = [
  { icon: '🏠', label: '단독주택', desc: '독채 주택 전체',       value: 'house' },
  { icon: '🏢', label: '아파트',   desc: '도심형 아파트',         value: 'apartment' },
  { icon: '🏡', label: '별장/펜션', desc: '자연 속 독립 공간',     value: 'villa' },
  { icon: '🏯', label: '한옥',     desc: '전통 한국 건축',         value: 'unique' },
  { icon: '🛖', label: '독채 캐빈', desc: '숲속 통나무집',         value: 'guesthouse' },
  { icon: '🏨', label: '부티크 호텔', desc: '감성 소규모 호텔',   value: 'hotel' },
];

export function TypeStep() {
  const { data, setField } = useRegister();
  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>어떤 유형의 숙소를 등록하시나요?</h1>
      <p className={styles.stepDesc}>숙소 유형을 선택해주세요.</p>
      <div className={styles.typeGrid}>
        {TYPES.map(t => (
          <div
            key={t.value}
            className={`${styles.typeCard} ${data.type === t.value ? styles.typeCardSelected : ''}`}
            onClick={() => setField('type', t.value)}
          >
            <div className={styles.typeIcon}>{t.icon}</div>
            <div className={styles.typeLabel}>{t.label}</div>
            <div className={styles.typeDesc}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
