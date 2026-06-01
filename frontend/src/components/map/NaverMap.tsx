import { useEffect, useRef, useState } from 'react';
import type { RoutePOI } from '../../data/stays';
import styles from './NaverMap.module.css';

const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID as string | undefined;
const SCRIPT_ID = 'naver-map-script';

export interface MapMarker {
  lat: number;
  lng: number;
  name: string;
  price?: number;
}

export interface ActiveRoute {
  id: string;
  color: string;
}

interface Props {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  hoveredStay?: { lat: number; lng: number } | null;
  activeRoute?: ActiveRoute;
  routeWaypoints?: { lat: number; lng: number }[] | null;
  routePOIs?: RoutePOI[] | null;
}

const ROUTE_PATHS: Record<string, [number, number][]> = {
  coffee:    [[0,0],[0.0015,0.001],[0.002,0.003],[0.0015,0.005],[0,0.006],[-0.001,0.005],[-0.002,0.003],[-0.001,0.001],[0,0]],
  dawn:      [[0,0],[-0.002,0.001],[-0.004,0.003],[-0.005,0.006],[-0.003,0.008],[0,0.007],[0.001,0.004],[0,0]],
  dog:       [[0,0],[0.001,0.002],[0.003,0.001],[0.004,0.003],[0.003,0.005],[0.001,0.006],[-0.001,0.004],[-0.001,0.002],[0,0]],
  season:    [[0,0],[0.002,-0.001],[0.004,0.001],[0.005,0.003],[0.003,0.006],[0.001,0.007],[-0.001,0.005],[0,0]],
  food:      [[0,0],[0.001,0.001],[0.002,0],[0.002,0.002],[0.003,0.003],[0.002,0.005],[0.001,0.004],[0,0.002],[0,0]],
  running:   [[0,0],[0.003,0.001],[0.006,0.002],[0.007,0.005],[0.005,0.008],[0.002,0.009],[-0.001,0.007],[-0.002,0.004],[0,0]],
  bookstore: [[0,0],[0.001,0.001],[0.001,0.003],[0.002,0.004],[0.001,0.006],[-0.001,0.005],[-0.002,0.003],[-0.001,0.001],[0,0]],
  night:     [[0,0],[-0.001,0.002],[-0.002,0.004],[-0.001,0.007],[0.001,0.009],[0.003,0.007],[0.002,0.004],[0.001,0.002],[0,0]],
  indie:     [[0,0],[0.002,0.001],[0.003,-0.001],[0.004,0.002],[0.003,0.004],[0.001,0.005],[-0.001,0.003],[0,0.001],[0,0]],
  cafe:      [[0,0],[0.001,0.002],[0.002,0.001],[0.003,0.003],[0.002,0.005],[0.001,0.004],[-0.001,0.003],[-0.001,0.001],[0,0]],
};

function markerContent(name: string, price?: number) {
  const label = price ? `₩${Math.round(price / 10000)}만~` : name;
  return `<div style="
    display:inline-block;
    background:#1a1a1a;
    color:#fff;
    padding:6px 12px;
    border-radius:99px;
    font-size:12px;
    font-weight:700;
    font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;
    white-space:nowrap;
    box-shadow:0 3px 12px rgba(0,0,0,0.25);
    cursor:pointer;
    transform:translate(-50%,-100%);
  ">${label}</div>`;
}

function poiMarkerContent(poi: RoutePOI) {
  return `<div style="
    display:inline-flex;
    flex-direction:column;
    align-items:center;
    cursor:pointer;
    transform:translate(-50%,-100%);
    font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;
  ">
    <div style="
      background:#C17F3A;
      color:#fff;
      padding:7px 12px;
      border-radius:10px;
      white-space:nowrap;
      box-shadow:0 3px 10px rgba(0,0,0,0.22);
      line-height:1.35;
    ">
      <div style="font-size:12px;font-weight:700;">☕ ${poi.name}</div>
      <div style="font-size:11px;opacity:0.88;margin-top:1px;">도보 ${poi.walkMinutes}분</div>
    </div>
    <div style="
      width:0;height:0;
      border-left:5px solid transparent;
      border-right:5px solid transparent;
      border-top:6px solid #C17F3A;
    "></div>
  </div>`;
}

function poiInfoContent(poi: RoutePOI) {
  return `<div style="
    padding:14px 16px;
    font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;
    min-width:180px;
    max-width:220px;
  ">
    <div style="font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">☕ ${poi.name}</div>
    <div style="font-size:12px;color:#C17F3A;font-weight:600;margin-bottom:${poi.description ? '8px' : '0'};">도보 ${poi.walkMinutes}분</div>
    ${poi.description ? `<div style="font-size:12px;color:#555;line-height:1.55;">${poi.description}</div>` : ''}
  </div>`;
}

function loadScript(src: string): Promise<void> {
  if (window.naver?.maps) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.naver?.maps) { resolve(); return; }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

type ErrorType = 'no-key' | 'load-fail' | null;

export function NaverMap({
  markers = [],
  center = { lat: 37.5548, lng: 127.0509 },
  zoom = 13,
  hoveredStay,
  activeRoute,
  routeWaypoints,
  routePOIs,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);
  const poiMarkersRef = useRef<naver.maps.Marker[]>([]);
  const openIwRef = useRef<naver.maps.InfoWindow | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorType, setErrorType] = useState<ErrorType>(null);

  // ── 지도 초기화 ──────────────────────────────────────────
  useEffect(() => {
    const id = CLIENT_ID?.trim();
    console.log('[NaverMap] CLIENT_ID 값:', id ?? '(없음)');

    if (!id) {
      setErrorType('no-key');
      setStatus('error');
      return;
    }

    let isDestroyed = false;
    const src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${id}&language=ko`;

    loadScript(src)
      .then(() => {
        if (isDestroyed || !containerRef.current) return;

        const map = new window.naver.maps.Map(containerRef.current, {
          center: new window.naver.maps.LatLng(center.lat, center.lng),
          zoom,
          mapTypeControl: false,
          logoControl: true,
          scaleControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
            style: window.naver.maps.ZoomControlStyle.SMALL,
          },
        });

        if (isDestroyed) return;

        mapRef.current = map;

        markers.forEach((m) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(m.lat, m.lng),
            map,
            title: m.name,
            icon: {
              content: markerContent(m.name, m.price),
              anchor: new window.naver.maps.Point(0, 0),
            },
          });

          const iw = new window.naver.maps.InfoWindow({
            content: `<div style="padding:10px 14px;font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;font-size:13px;font-weight:600;color:#1a1a1a;min-width:100px">
              ${m.name}
              ${m.price ? `<div style="font-weight:400;color:#666;margin-top:3px;font-size:12px">₩${m.price.toLocaleString()}~</div>` : ''}
            </div>`,
            borderWidth: 1,
            borderColor: '#e0dbd3',
          });

          window.naver.maps.Event.addListener(marker, 'click', () => {
            iw.open(map, marker);
          });
        });

        setStatus('ready');
        console.log('[NaverMap] 초기화 완료 — 마커', markers.length, '개');
      })
      .catch((err: unknown) => {
        if (isDestroyed) return;
        console.error('[NaverMap] 스크립트 로드 실패:', err);
        setErrorType('load-fail');
        setStatus('error');
      });

    return () => {
      isDestroyed = true;
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, zoom]);

  // ── 카드 호버 시 지도 이동 + 줌인 ────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.naver?.maps) return;

    if (hoveredStay) {
      map.panTo(new window.naver.maps.LatLng(hoveredStay.lat, hoveredStay.lng));
      map.setZoom(15, true);
    }
  }, [hoveredStay]);

  // ── 커피향 루트 POI 핀 ───────────────────────────────────
  useEffect(() => {
    poiMarkersRef.current.forEach(m => m.setMap(null));
    poiMarkersRef.current = [];
    if (openIwRef.current) { openIwRef.current.close(); openIwRef.current = null; }

    const map = mapRef.current;
    if (!map || !routePOIs?.length || !window.naver?.maps || status !== 'ready') return;

    routePOIs.forEach(poi => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(poi.lat, poi.lng),
        map,
        icon: {
          content: poiMarkerContent(poi),
          anchor: new window.naver.maps.Point(0, 0),
        },
      });

      const iw = new window.naver.maps.InfoWindow({
        content: poiInfoContent(poi),
        borderWidth: 1,
        borderColor: '#e8ddd3',
        backgroundColor: '#fff',
        anchorSize: new window.naver.maps.Size(10, 10),
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (openIwRef.current && openIwRef.current !== iw) {
          openIwRef.current.close();
        }
        if (iw.getMap()) {
          iw.close();
          openIwRef.current = null;
        } else {
          iw.open(map, marker);
          openIwRef.current = iw;
        }
      });

      poiMarkersRef.current.push(marker);
    });
  }, [routePOIs, status]);

  // ── 호버 시 루트 폴리라인 ────────────────────────────────
  useEffect(() => {
    polylineRef.current?.setMap(null);
    polylineRef.current = null;

    const map = mapRef.current;
    if (!map || !window.naver?.maps) return;

    const color = activeRoute?.color ?? '#1a1a1a';
    let path: naver.maps.LatLng[];

    if (routeWaypoints && routeWaypoints.length >= 2) {
      path = routeWaypoints.map(p => new window.naver.maps.LatLng(p.lat, p.lng));
    } else if (hoveredStay) {
      const routeId = activeRoute?.id ?? 'coffee';
      const offsets = ROUTE_PATHS[routeId] ?? ROUTE_PATHS.coffee;
      path = offsets.map(([dlat, dlng]) =>
        new window.naver.maps.LatLng(hoveredStay.lat + dlat, hoveredStay.lng + dlng)
      );
    } else {
      return;
    }

    polylineRef.current = new window.naver.maps.Polyline({
      map,
      path,
      strokeColor: color,
      strokeOpacity: 0.85,
      strokeWeight: 5,
      strokeStyle: 'solid',
    });
  }, [hoveredStay, activeRoute?.id, activeRoute?.color, routeWaypoints]);

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.map} />

      {status === 'loading' && (
        <div className={styles.overlay}>
          <div className={styles.spinner} />
          <span>지도 로딩 중…</span>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.overlay}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorType === 'no-key' ? (
            <span>
              <strong>.env</strong> 파일에 값이 없어요<br />
              <small style={{ opacity: 0.8 }}>VITE_NAVER_MAP_CLIENT_ID=실제ID</small><br />
              <small style={{ opacity: 0.6 }}>저장 후 서버 재시작 필요</small>
            </span>
          ) : (
            <span>
              지도 로드 실패<br />
              <small style={{ opacity: 0.8 }}>브라우저 콘솔(F12)에서<br />[NaverMap] 로그를 확인하세요</small>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
