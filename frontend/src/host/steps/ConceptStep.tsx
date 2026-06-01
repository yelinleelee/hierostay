import styles from '../Register.module.css';
import { useRegister } from '../RegisterContext';

const CONCEPTS = [
  { icon: '🎨', label: '아트 스테이', desc: '예술가의 감성이 담긴 공간' },
  { icon: '🌿', label: '친환경',     desc: '자연과 함께하는 지속 가능한 공간' },
  { icon: '🏘', label: '로컬 스테이', desc: '그 동네의 일상을 경험하는 공간' },
  { icon: '✨', label: '럭셔리',     desc: '최고급 시설과 서비스' },
];

export function ConceptStep() {
  const { data, setField } = useRegister();
  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>숙소의 컨셉을 선택해주세요</h1>
      <p className={styles.stepDesc}>가장 잘 어울리는 컨셉을 고르세요.</p>
      <div className={styles.conceptGrid}>
        {CONCEPTS.map(c => (
          <div
            key={c.label}
            className={`${styles.conceptCard} ${data.concept === c.label ? styles.conceptCardSelected : ''}`}
            onClick={() => setField('concept', c.label)}
          >
            <div className={styles.typeIcon}>{c.icon}</div>
            <div className={styles.conceptLabel}>{c.label}</div>
            <div className={styles.conceptDesc}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
