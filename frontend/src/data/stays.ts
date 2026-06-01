/**
 * 디자인용 정적 데이터 — 백엔드 API와 무관한 UI placeholder/카탈로그.
 * (Stay/mapApiToStay 같은 API 매핑 코드는 의도적으로 들여오지 않음)
 */

export interface PlaceholderStay {
  name: string;
  region: string;
  district: string;
  categories: string[];
  capacity: string;
  price: number;
  badges: string[];
  description: string;
  _color: string;
  images?: string[];
}

export const CONCEPT_PLACEHOLDERS: Record<string, PlaceholderStay[]> = {
  '아트 스테이': [
    { name: '파란 아틀리에', region: '경기', district: '파주시', categories: ['아트 스테이'], capacity: '2~4명', price: 180000, badges: [], description: '', _color: 'cp-3', images: ['/images/stays/thumnail/4.jpg'] },
    { name: '갤러리하우스', region: '부산', district: '수영구', categories: ['아트 스테이'], capacity: '2~4명', price: 160000, badges: [], description: '', _color: 'cp-5', images: ['/images/stays/thumnail/5.jpg'] },
    { name: '모노스튜디오', region: '제주', district: '애월읍', categories: ['아트 스테이'], capacity: '1~2명', price: 170000, badges: [], description: '', _color: 'cp-1', images: ['/images/stays/thumnail/6.jpg'] },
  ],
  '친환경': [
    { name: '숲속의 집', region: '강원', district: '홍천군', categories: ['친환경'], capacity: '2~6명', price: 140000, badges: [], description: '', _color: 'cp-2', images: ['/images/stays/thumnail/7.jpg'] },
    { name: '흙집스테이', region: '전남', district: '순천시', categories: ['친환경'], capacity: '2~4명', price: 120000, badges: [], description: '', _color: 'cp-4', images: ['/images/stays/thumnail/8.jpg'] },
    { name: '솔숲재', region: '경북', district: '영양군', categories: ['친환경'], capacity: '2~4명', price: 125000, badges: [], description: '', _color: 'cp-6', images: ['/images/stays/thumnail/9.jpg'] },
  ],
  '로컬 스테이': [
    { name: '서촌골방', region: '서울', district: '종로구', categories: ['로컬 스테이'], capacity: '1~2명', price: 110000, badges: [], description: '', _color: 'cp-1', images: ['/images/stays/thumnail/10.jpg'] },
    { name: '부산골목집', region: '부산', district: '초량동', categories: ['로컬 스테이'], capacity: '2~4명', price: 130000, badges: [], description: '', _color: 'cp-6', images: ['/images/stays/thumnail/11.png'] },
    { name: '전주한옥', region: '전북', district: '전주시', categories: ['로컬 스테이'], capacity: '2~6명', price: 150000, badges: [], description: '', _color: 'cp-4', images: ['/images/stays/thumnail/1.jpg'] },
  ],
};

export const DOMESTIC_REGIONS = ['전체', '서울', '제주', '강원', '강릉', '춘천', '양양', '부산', '경상', '경주', '전라', '전주', '남원', '경기', '양평', '가평', '인천', '충청'];
export const OVERSEAS_REGIONS = ['전체', '일본', '태국', '베트남', '발리', '유럽'];

export const STAY_LATLNG: Record<string, { lat: number; lng: number }> = {
  '오픈레터하우스': { lat: 37.5592, lng: 127.0097 },
  '초록재':         { lat: 37.5499, lng: 127.1478 },
  '천호재':         { lat: 37.5384, lng: 127.1240 },
  '파란 아틀리에':  { lat: 37.7572, lng: 126.7821 },
  '갤러리하우스':   { lat: 35.1672, lng: 129.1132 },
  '숲속의 집':      { lat: 37.6978, lng: 127.8894 },
  '흙집스테이':     { lat: 34.9501, lng: 127.4871 },
  '서촌골방':       { lat: 37.5832, lng: 126.9704 },
  '부산골목집':     { lat: 35.1097, lng: 129.0325 },
  '전주한옥':       { lat: 35.8177, lng: 127.1536 },
};

export interface RoutePOI {
  lat: number;
  lng: number;
  name: string;
  walkMinutes: number;
  description?: string;
}

export const COFFEE_ROUTE_POIS: RoutePOI[] = [
  { lat: 37.5382, lng: 127.1258, name: '메가커피 천호역점', walkMinutes: 3, description: '24시간 운영 · 넓은 좌석' },
  { lat: 37.5376, lng: 127.1275, name: '스타벅스 천호점', walkMinutes: 7, description: '천호대로 창가 뷰 · 리저브 메뉴' },
  { lat: 37.5369, lng: 127.1284, name: '어라운드커피', walkMinutes: 10, description: '독립카페 · 원두 직접 로스팅' },
  { lat: 37.5361, lng: 127.1271, name: '투썸플레이스 강동점', walkMinutes: 13, description: '케이크 종류 다양 · 조용한 분위기' },
  { lat: 37.5371, lng: 127.1248, name: '빈티지로스터스', walkMinutes: 5, description: '독립카페 · 브런치 메뉴 있음' },
];

export const STAY_COFFEE_ROUTES: Record<string, { lat: number; lng: number }[]> = {
  '천호재': [
    { lat: 37.5384, lng: 127.1240 },
    { lat: 37.5383, lng: 127.1258 },
    { lat: 37.5377, lng: 127.1274 },
    { lat: 37.5369, lng: 127.1283 },
    { lat: 37.5358, lng: 127.1271 },
    { lat: 37.5362, lng: 127.1252 },
    { lat: 37.5371, lng: 127.1238 },
    { lat: 37.5384, lng: 127.1240 },
  ],
};
