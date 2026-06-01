import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../../types/property';
import styles from './StayCard.module.css';

/**
 * 카드가 그리는 view-model. 백엔드 Property와 placeholder 모두 이 모양으로 정규화한다.
 * 매핑은 propertyToCardData()에서 처리하고, placeholder는 데이터 파일에서 이 모양에 가깝게 정의된다.
 */
export interface StayCardData {
  id?: number | string;
  name: string;
  region?: string;
  district?: string;
  capacity?: string;
  price: number;
  images?: string[];
  badges?: string[];
  _color?: string;
}

const BADGE_CLS: Record<string, string> = {
  '단독소개': styles.badgePromo,
  '신규': styles.badgePromo,
  '마감할인': styles.badgeSale,
};

export function propertyToCardData(p: Property): StayCardData {
  const cap = p.max_guests ? `최대 ${p.max_guests}명` : undefined;
  return {
    id: p.ID,
    name: p.title,
    region: p.city,
    district: undefined,
    capacity: cap,
    price: p.price,
    images: p.images,
    badges: [],
  };
}

interface Props {
  data: StayCardData;
  colorClass?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export function StayCard({ data, colorClass, onHoverStart, onHoverEnd }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();
  const cls = colorClass || data._color || '';
  const image = data.images?.[0];

  function handleClick() {
    if (data.id) navigate(`/stays/${data.id}`);
    else navigate('/stays');
  }

  return (
    <div className={styles.card} onClick={handleClick} onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
      <div className={`${styles.imgWrap} ${cls}`}>
        {image ? (
          <img src={image} alt={data.name} />
        ) : (
          <div className={styles.placeholder}>{data.name}</div>
        )}
        {(data.badges || []).length > 0 && (
          <div className={styles.badges}>
            {(data.badges || []).map(b => (
              <span key={b} className={`${styles.badge} ${BADGE_CLS[b] || styles.badgePromo}`}>{b}</span>
            ))}
          </div>
        )}
        <button
          className={`${styles.bookmark} ${bookmarked ? styles.saved : ''}`}
          onClick={e => { e.stopPropagation(); setBookmarked(p => !p); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{data.name}</div>
        <div className={styles.meta}>
          {data.region}
          {data.district ? `, ${data.district}` : ''}
          {data.capacity ? ` · ${data.capacity}` : ''}
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>₩{data.price.toLocaleString()}~</span>
        </div>
      </div>
    </div>
  );
}
