import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../context/SearchModalContext';
import { DOMESTIC_REGIONS, OVERSEAS_REGIONS } from '../../data/stays';
import styles from './SearchModal.module.css';

const DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '은평구', '종로구', '중구', '중랑구',
];

const ROUTES = [
  { id: 'coffee',    label: '커피향 루트',  emoji: '🥐', desc: '골목 카페를 따라 걷는 하루' },
  { id: 'dawn',      label: '새벽산책',     emoji: '🌿', desc: '이른 아침, 고요한 골목길' },
  { id: 'dog',       label: '강아지산책',   emoji: '🐕', desc: '반려견과 함께하는 동네 산책' },
  { id: 'season',    label: '계절감성',     emoji: '🌸', desc: '계절의 변화를 느끼는 풍경길' },
  { id: 'food',      label: '골목맛집',     emoji: '🍜', desc: '숨겨진 동네 맛집을 찾아서' },
  { id: 'running',   label: '러닝코스',     emoji: '🏃', desc: '상쾌한 아침 러닝 루트' },
  { id: 'bookstore', label: '동네서점',     emoji: '📚', desc: '골목 속 작은 서점들' },
  { id: 'night',     label: '야경산책',     emoji: '🌙', desc: '밤빛 물드는 골목 야경' },
  { id: 'indie',     label: '인디바이브',   emoji: '🎨', desc: '독립예술가들의 공간들' },
  { id: 'cafe',      label: '스테디카페',   emoji: '☕', desc: '오래된 단골 카페 순례' },
  { id: 'unsure',    label: '잘 모르겠어요', emoji: '🤔', desc: '구 안의 모든 동네 보여드릴게요' },
];

const STEP_LABELS = ['지역 선택', '구 선택', '날짜 선택', '골목 루트'];

export function SearchModal() {
  const { isOpen, close } = useSearchModal();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [tab, setTab] = useState<'domestic' | 'overseas'>('domestic');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['전체']);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');

  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  function toggleRegion(region: string) {
    if (region === '전체') {
      setSelectedRegions(['전체']);
    } else {
      const next = selectedRegions.filter(r => r !== '전체');
      if (next.includes(region)) {
        const after = next.filter(r => r !== region);
        setSelectedRegions(after.length ? after : ['전체']);
      } else {
        setSelectedRegions([...next, region]);
      }
    }
  }

  function reset() {
    setSelectedRegions(['전체']);
    setSelectedDistrict('');
    setCheckIn('');
    setCheckOut('');
    setSelectedRoute('');
    setStep(1);
  }

  function doSearch() {
    const params = new URLSearchParams();
    const regionVal = selectedRegions.includes('전체') ? '' : selectedRegions.join(',');
    if (regionVal) params.set('region', regionVal);
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (selectedRoute && selectedRoute !== 'unsure') params.set('route', selectedRoute);
    close();
    navigate('/stays?' + params.toString());
  }

  const totalSteps = 4;
  const regions = tab === 'domestic' ? DOMESTIC_REGIONS : OVERSEAS_REGIONS;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <h2>어디로 떠날까요?</h2>
          <button className={styles.closeBtn} onClick={close}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.stepBar}>
          {STEP_LABELS.map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const isDone = step > n;
            const isActive = step === n;
            return (
              <div key={label} className={styles.stepRow}>
                <div className={styles.stepItem}>
                  <div className={`${styles.stepDot} ${isActive ? styles.stepDotActive : isDone ? styles.stepDotDone : ''}`}>
                    {isDone ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : n}
                  </div>
                  <span className={`${styles.stepLabel} ${isActive || isDone ? styles.stepLabelActive : ''}`}>{label}</span>
                </div>
                {i < totalSteps - 1 && <div className={`${styles.stepConnector} ${isDone ? styles.stepConnectorDone : ''}`} />}
              </div>
            );
          })}
        </div>

        <div className={styles.modalBody}>
          {step === 1 && (
            <>
              <div className={styles.tabs}>
                <button className={`${styles.tab} ${tab === 'domestic' ? styles.tabActive : ''}`} onClick={() => setTab('domestic')}>국내</button>
                <button className={`${styles.tab} ${tab === 'overseas' ? styles.tabActive : ''}`} onClick={() => setTab('overseas')}>해외</button>
              </div>
              <div className={styles.regionSection}>
                <div className={styles.regionTitle}>{tab === 'domestic' ? '국내 지역' : '해외 지역'}</div>
                <div className={styles.pills}>
                  {regions.map(r => (
                    <button
                      key={r}
                      className={`${styles.pill} ${selectedRegions.includes(r) ? styles.pillSelected : ''}`}
                      onClick={() => toggleRegion(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className={styles.stepSection}>
              <div className={styles.stepTitle}>어느 구로 가볼까요?</div>
              <div className={styles.districtGrid}>
                {DISTRICTS.map(d => (
                  <button
                    key={d}
                    className={`${styles.districtBtn} ${selectedDistrict === d ? styles.districtBtnSelected : ''}`}
                    onClick={() => setSelectedDistrict(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepSection}>
              <div className={styles.stepTitle}>언제 머무실 예정인가요?</div>
              <div className={styles.dateGrid}>
                <label className={styles.dateField}>
                  <span className={styles.dateLabel}>체크인</span>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value > checkOut) setCheckOut('');
                    }}
                  />
                </label>
                <label className={styles.dateField}>
                  <span className={styles.dateLabel}>체크아웃</span>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setCheckOut(e.target.value)}
                  />
                </label>
              </div>
              {checkIn && checkOut && (
                <div className={styles.dateSelected}>
                  {new Date(checkIn).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  {' → '}
                  {new Date(checkOut).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  {' · '}
                  {Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)}박
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepSection}>
              <div className={styles.stepTitle}>어떤 골목 루트로 떠나볼까요?</div>
              <div className={styles.routeGrid}>
                {ROUTES.map(r => (
                  <button
                    key={r.id}
                    className={`${styles.routeCard} ${selectedRoute === r.id ? styles.routeCardSelected : ''}`}
                    onClick={() => setSelectedRoute(r.id)}
                  >
                    <span className={styles.routeEmoji}>{r.emoji}</span>
                    <span className={styles.routeName}>{r.label}</span>
                    <span className={styles.routeDesc}>{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {step > 1 ? (
            <button className={styles.backBtn} onClick={() => setStep(s => (s - 1) as 1 | 2 | 3 | 4)}>
              ← 이전
            </button>
          ) : (
            <button className={styles.resetBtn} onClick={reset}>초기화</button>
          )}

          {step < 4 ? (
            <button className={styles.nextBtn} onClick={() => setStep(s => (s + 1) as 1 | 2 | 3 | 4)}>
              다음 →
            </button>
          ) : (
            <button className={styles.searchBtn} onClick={doSearch}>검색</button>
          )}
        </div>
      </div>
    </div>
  );
}
