import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StayCard, propertyToCardData, type StayCardData } from '../../components/common/StayCard';
import { NaverMap } from '../../components/map/NaverMap';
import type { MapMarker } from '../../components/map/NaverMap';
import { listProperties } from '../../lib/properties';
import type { Property } from '../../types/property';
import { ApiError } from '../../lib/api';
import styles from './Stays.module.css';

const CARD_COLORS = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6'];

const ROUTES = [
  { id: 'all',       emoji: '✨', label: '전체보기',  color: '#222' },
  { id: 'coffee',    emoji: '🥐', label: '커피향',    color: '#C17F3A' },
  { id: 'dawn',      emoji: '🌿', label: '새벽산책',  color: '#3A7D44' },
  { id: 'dog',       emoji: '🐕', label: '강아지산책', color: '#8B6355' },
  { id: 'season',    emoji: '🌸', label: '계절감성',  color: '#C2547A' },
  { id: 'food',      emoji: '🍜', label: '골목맛집',  color: '#C0392B' },
  { id: 'running',   emoji: '🏃', label: '러닝코스',  color: '#2471A3' },
  { id: 'bookstore', emoji: '📚', label: '동네서점',  color: '#5B3FA8' },
  { id: 'night',     emoji: '🌙', label: '야경산책',  color: '#1F3A7A' },
  { id: 'indie',     emoji: '🎨', label: '인디바이브', color: '#7B3FA8' },
  { id: 'cafe',      emoji: '☕', label: '스테디카페', color: '#4E342E' },
] as const;

type RouteId = typeof ROUTES[number]['id'];

interface CardWithCoord extends StayCardData {
  _coord?: { lat: number; lng: number };
}

export function StaysPage() {
  const [searchParams] = useSearchParams();
  const region   = searchParams.get('region')   || '';
  const category = searchParams.get('category') || '';
  const date     = searchParams.get('date')     || '';
  const guests   = searchParams.get('guests')   || '';

  const routeParam = searchParams.get('route') || '';
  const initialRoute: RouteId = ROUTES.some(r => r.id === routeParam)
    ? (routeParam as RouteId)
    : 'all';
  const [activeRouteId, setActiveRouteId] = useState<RouteId>(initialRoute);
  const [hoveredStay, setHoveredStay] = useState<{ lat: number; lng: number } | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listProperties()
      .then((items) => {
        if (!cancelled) setProperties(items);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : '숙소를 불러오지 못했습니다.');
        setProperties([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const cards: CardWithCoord[] = useMemo(() => {
    return properties.map((p): CardWithCoord => ({
      ...propertyToCardData(p),
      _coord: p.latitude && p.longitude ? { lat: p.latitude, lng: p.longitude } : undefined,
    }));
  }, [properties]);

  // 현재 Property에는 category 필드가 없어 카테고리 필터는 노출만, 데이터는 영향 없음.
  const filtered = cards.filter(c => {
    if (region && region !== '전체') {
      if (!(c.region?.includes(region) || c.district?.includes(region) || c.name.includes(region))) return false;
    }
    return true;
  });

  const mapMarkers: MapMarker[] = filtered.flatMap(s => {
    if (!s._coord) return [];
    return [{ ...s._coord, name: s.name, price: s.price }];
  });

  const mapCenter = mapMarkers.length > 0
    ? {
        lat: mapMarkers.reduce((sum, m) => sum + m.lat, 0) / mapMarkers.length,
        lng: mapMarkers.reduce((sum, m) => sum + m.lng, 0) / mapMarkers.length,
      }
    : { lat: 37.5665, lng: 126.9780 };

  const activeRoute = ROUTES.find(r => r.id === activeRouteId)!;
  const isAll = activeRouteId === 'all';

  return (
    <div className={styles.page}>
      <div className={styles.routeBar}>
        {ROUTES.map(r => (
          <button
            key={r.id}
            className={`${styles.routeBtn} ${activeRouteId === r.id ? styles.routeBtnActive : ''}`}
            style={activeRouteId === r.id
              ? { ['--route-color' as string]: r.color, borderColor: r.color, background: r.color } as React.CSSProperties
              : undefined}
            onClick={() => setActiveRouteId(r.id)}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>
          {category
            ? `${category} 스테이`
            : region && region !== '전체'
              ? `${region} 스테이`
              : '전체 스테이'}
        </h1>

        {!isAll && (
          <div className={styles.activeRouteInfo}>
            <span className={styles.activeRouteDot} style={{ background: activeRoute.color }} />
            <span>{activeRoute.emoji} <strong>{activeRoute.label}</strong> 루트로 탐색 중</span>
          </div>
        )}

        {(region || date || guests) && (
          <div className={styles.searchInfo}>
            {region && region !== '전체' && <span>{region}</span>}
            {date && <span>{date}</span>}
            {guests && <span>{guests}</span>}
          </div>
        )}
        <p className={styles.count}>{loading ? '불러오는 중…' : `${filtered.length}개의 스테이`}</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.cardList}>
          {error ? (
            <div className={styles.empty}><p>{error}</p></div>
          ) : loading ? (
            <div className={styles.empty}><p>숙소를 불러오는 중입니다…</p></div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>검색 결과가 없습니다.</p>
              <p>다른 지역이나 날짜로 검색해보세요.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((s, i) => (
                <StayCard
                  key={String(s.id ?? '') + s.name + i}
                  data={s}
                  colorClass={s._color || CARD_COLORS[i % CARD_COLORS.length]}
                  onHoverStart={() => { if (s._coord) setHoveredStay(s._coord); }}
                  onHoverEnd={() => setHoveredStay(null)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.mapPanel}>
          <NaverMap
            markers={mapMarkers}
            center={mapCenter}
            zoom={mapMarkers.length === 1 ? 15 : 11}
            hoveredStay={hoveredStay}
            activeRoute={activeRoute}
          />
        </div>
      </div>
    </div>
  );
}
