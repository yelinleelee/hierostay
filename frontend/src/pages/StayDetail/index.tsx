import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty } from '../../lib/properties';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext';
import { BookingWidget } from '../../components/booking/BookingWidget';
import { ReviewList } from '../../components/ReviewList';
import type { Property } from '../../types/property';
import styles from './StayDetail.module.css';

const HERO_BG = 'linear-gradient(135deg, #1e2e48 0%, #3a5472 100%)';

const TABS = ['스테이 소개', '객실 정보', '리뷰', '위치 및 정보', '편의시설'];

function TabIntro({ p, mainImage }: { p: Property; mainImage?: string }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>스테이 소개</h2>
      <p className={styles.descText}>{p.description || '소개가 아직 없습니다.'}</p>
      <div className={styles.contentImg} style={{ background: HERO_BG }}>
        {mainImage && (
          <img
            src={mainImage}
            alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => (e.currentTarget.style.opacity = '0')}
          />
        )}
      </div>
    </div>
  );
}

function TabRooms({ p }: { p: Property }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>객실 정보</h2>
      <div className={styles.roomCard}>
        <div className={styles.roomImg} style={{ background: HERO_BG }} />
        <div className={styles.roomBody}>
          <div className={styles.roomName}>{p.title}</div>
          <div className={styles.roomDesc}>
            {p.property_type} · {p.room_type} / 최대 {p.max_guests}명
            <br />
            침실 {p.bedrooms} · 침대 {p.beds} · 욕실 {p.bathrooms}
          </div>
          <div className={styles.roomPriceRow}>
            <span className={styles.priceFinal}>₩{p.price.toLocaleString()}~</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabReviews({ p }: { p: Property }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>
        리뷰{' '}
        <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--light)' }}>
          {p.review_count}개
        </span>
      </h2>
      {p.rating > 0 && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 40, fontWeight: 700 }}>{p.rating.toFixed(1)}</span>
          <span style={{ fontSize: 14, color: 'var(--light)' }}>/ 5.0</span>
        </div>
      )}
      <ReviewList propertyId={p.ID} />
    </div>
  );
}

function TabLocation({ p }: { p: Property }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>위치 및 정보</h2>
      <div className={styles.mapPlaceholder}>🗺 지도 (준비 중)</div>
      <div className={styles.locationInfo}>
        <strong>{p.address}</strong>
        <br />
        {p.city}, {p.country}
      </div>
    </div>
  );
}

function TabAmenities({ p }: { p: Property }) {
  if (!p.amenities?.length) {
    return (
      <div className={styles.tabSection}>
        <h2 className={styles.sectionHeading}>편의시설</h2>
        <p className={styles.descText}>등록된 편의시설이 없습니다.</p>
      </div>
    );
  }
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>편의시설</h2>
      <div className={styles.rulesGrid}>
        {p.amenities.map((a, i) => (
          <div key={i} className={styles.ruleItem}>
            <span className={styles.ruleDot} />
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabIdx, setTabIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProperty(Number(id))
      .then((data) => {
        if (!cancelled) setProperty(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : '숙소 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div style={{ padding: '120px 40px', textAlign: 'center', color: 'var(--mid)' }}>숙소 정보를 불러오는 중…</div>;
  }
  if (error || !property) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 16, color: 'var(--mid)', marginBottom: 16 }}>{error ?? '숙소 정보를 불러오지 못했습니다.'}</p>
        <button
          onClick={() => navigate('/stays')}
          style={{ padding: '10px 20px', background: 'var(--dark)', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
        >
          전체 스테이로 돌아가기
        </button>
      </div>
    );
  }

  const mainImage = property.images?.[0];
  const TAB_CONTENT = [
    <TabIntro p={property} mainImage={mainImage} />,
    <TabRooms p={property} />,
    <TabReviews p={property} />,
    <TabLocation p={property} />,
    <TabAmenities p={property} />,
  ];

  return (
    <div>
      {/* Hero Gallery */}
      <div className={styles.detailHero}>
        <div className={styles.heroGrid}>
          <button className={styles.heroBack} onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className={styles.heroActions}>
            <button className={styles.heroActionBtn} title="공유">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            <button className={styles.heroActionBtn} onClick={() => setBookmarked((p) => !p)} title="북마크">
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          <div className={`${styles.heroItem} ${styles.heroMain}`} style={{ background: HERO_BG }}>
            {mainImage && (
              <img src={mainImage} alt={property.title} onError={(e) => (e.currentTarget.style.opacity = '0')} />
            )}
          </div>
          {[0, 1, 2, 3].map((n) => {
            const src = property.images?.[n + 1];
            return (
              <div key={n} className={`${styles.heroItem} ${styles.heroSub}`} style={{ background: HERO_BG }}>
                {src && <img src={src} alt="" onError={(e) => (e.currentTarget.style.opacity = '0')} />}
              </div>
            );
          })}

          <button className={styles.btnShowAll}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            사진 모두 보기
          </button>
        </div>
      </div>

      {/* Detail Body */}
      <div className={styles.detailBody}>
        <div className={styles.detailLeft}>
          <div className={styles.detailHead}>
            <div>
              <h1 className={styles.detailName}>{property.title}</h1>
              <p className={styles.detailLocation}>
                {property.city}
                {property.country ? `, ${property.country}` : ''}
              </p>
              {property.rating > 0 && (
                <div className={styles.detailReviews}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--light)' }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{property.rating.toFixed(1)}</span>
                  <span className={styles.reviewLink}>후기 {property.review_count}개</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.detailTabs}>
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`${styles.detailTab} ${tabIdx === i ? styles.tabActive : ''}`}
                onClick={() => setTabIdx(i)}
              >
                {t}
              </button>
            ))}
          </div>

          <div>{TAB_CONTENT[tabIdx]}</div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.detailRight}>
          {user?.id === property.host_id ? (
            <div className={styles.sidebarBox} style={{ padding: 20, fontSize: 13, color: 'var(--mid)', lineHeight: 1.7 }}>
              본인이 호스팅하는 숙소입니다.
              <br />
              예약 관리는{' '}
              <a href="/host/bookings" style={{ color: 'var(--accent)' }}>예약 관리</a>에서 확인하세요.
            </div>
          ) : (
            <BookingWidget property={property} />
          )}
        </div>
      </div>
    </div>
  );
}
