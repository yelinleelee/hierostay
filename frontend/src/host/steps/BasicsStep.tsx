import styles from '../Register.module.css';
import { useRegister } from '../RegisterContext';

type CounterKey = 'guests' | 'bedrooms' | 'beds' | 'bathrooms';

const ITEMS: { key: CounterKey; label: string; min: number }[] = [
  { key: 'guests',    label: '최대 인원', min: 1 },
  { key: 'bedrooms',  label: '침실',     min: 0 },
  { key: 'beds',      label: '침대',     min: 1 },
  { key: 'bathrooms', label: '욕실',     min: 1 },
];

export function BasicsStep() {
  const { data, setField } = useRegister();

  function adjust(key: CounterKey, dir: number) {
    const item = ITEMS.find(i => i.key === key)!;
    const next = Math.max(item.min, (data[key] as number) + dir);
    setField(key, next);
  }

  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>기본 정보를 입력해주세요</h1>
      <p className={styles.stepDesc}>인원과 공간 구성을 알려주세요.</p>
      {ITEMS.map(item => (
        <div key={item.key} className={styles.counterRow}>
          <span className={styles.counterLabel}>{item.label}</span>
          <div className={styles.counter}>
            <button className={styles.counterBtn} onClick={() => adjust(item.key, -1)} disabled={(data[item.key] as number) <= item.min}>−</button>
            <span className={styles.counterNum}>{data[item.key] as number}</span>
            <button className={styles.counterBtn} onClick={() => adjust(item.key, 1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
