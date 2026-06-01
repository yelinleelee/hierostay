import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../context/SearchModalContext';
import { StayCard, propertyToCardData, type StayCardData } from '../../components/common/StayCard';
import { CONCEPT_PLACEHOLDERS } from '../../data/stays';
import { listProperties } from '../../lib/properties';
import type { Property } from '../../types/property';
import styles from './Home.module.css';

const GAMES = [
  '/games/game1.html',
  '/games/game3.html',
  '/games/game4.html',
];

const CARD_COLORS = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6'];



interface ConceptSectionProps {
  title: string;
  desc: string;
  linkCategory: string;
  real: StayCardData[];
  fillerKey: keyof typeof CONCEPT_PLACEHOLDERS;
}

function ConceptSection({ title, desc, linkCategory, real, fillerKey }: ConceptSectionProps) {
  const fills = CONCEPT_PLACEHOLDERS[fillerKey].slice(0, Math.max(0, 4 - real.length));
  const cards: StayCardData[] = [
    ...real.slice(0, 4),
    ...fills.map((f) => ({
      name: f.name,
      region: f.region,
      district: f.district,
      capacity: f.capacity,
      price: f.price,
      badges: f.badges,
      images: f.images,
      _color: f._color,
    })),
  ];

  return (
    <div className={styles.conceptSection}>
      <div className={styles.conceptHeader}>
        <div>
          <h2 className={styles.conceptTitle}>{title}</h2>
          <p className={styles.conceptDesc}>{desc}</p>
        </div>
        <Link to={`/stays?category=${encodeURIComponent(linkCategory)}`} className={styles.sectionArrow}>
          전체보기
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
      <div className={styles.cardGrid}>
        {cards.map((c, i) => (
          <StayCard
            key={(c.id ?? '') + c.name + i}
            data={c}
            colorClass={c._color || CARD_COLORS[i % CARD_COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
}

function HostModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className={styles.hostOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.hostModal}>
        <button className={styles.hostModalClose} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className={styles.hostModalBody}>
          {/* Hero */}
          <div className={styles.hmHero}>
            <img src="/hiero-drawing2.png" alt="HIERO" className={styles.hmHeroImg} />
            <h2 className={styles.hmHeroTitle}>숙소 관리가 귀찮다면?<br />오픈레터 관리 구독 서비스 —<br />숙소 운영을 우리에게 맡겨보세요.</h2>
            <p className={styles.hmHeroDesc}>예약부터 메시지 응대, 청소, 정산까지.<br />히로(HIERO)가 호스트님의 시간을 되찾아 드립니다.</p>
          </div>

          {/* Pain points */}
          <div className={styles.hmSection}>
            <h3 className={styles.hmSectionTitle}>"아직도 새벽 2시에 게스트 메시지 알람에 깨시나요?"</h3>
            <div className={styles.hmPainList}>
              {['💬 끝도 없는 게스트 응대와 CS', '🧹 갑자기 펑크 나는 청소 스케줄 관리', '📉 비수기만 되면 늘어나는 공실과 수익 걱정', '⚖️ 복잡한 정산과 법률적 불안감'].map(t => (
                <div key={t} className={styles.hmPainCard}>{t}</div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className={styles.hmSection}>
            <h3 className={styles.hmSectionTitle}>오픈레터하우스에 올리기만 하세요.<br />나머지는 HIERO OS가 알아서 합니다.</h3>
            <div className={styles.hmSolutionGrid}>
              {[
                { icon: '🤖', title: 'AI 자동 응대', desc: '90% 이상의 단순 문의를 AI가 즉각 처리합니다.' },
                { icon: '✨', title: '청소/시설 관리', desc: '입·퇴거 스케줄에 맞춰 청소와 점검을 자동 배정합니다.' },
                { icon: '📈', title: 'AI 동적 가격', desc: '시장 데이터 기반으로 최적 가격을 산정해 수익을 극대화합니다.' },
                { icon: '🛡️', title: '법률·세무 케어', desc: '구독형 이용약관과 외부 자문 연계로 리스크를 차단합니다.' },
              ].map(s => (
                <div key={s.title} className={styles.hmSolutionCard}>
                  <span className={styles.hmSolutionIcon}>{s.icon}</span>
                  <strong className={styles.hmSolutionTitle}>{s.title}</strong>
                  <p className={styles.hmSolutionDesc}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={styles.hmStats}>
            <div className={styles.hmStatItem}><span className={styles.hmStatNum}>85~95%</span><span className={styles.hmStatLabel}>목표 점유율</span></div>
            <div className={styles.hmStatItem}><span className={styles.hmStatNum}>33.5%</span><span className={styles.hmStatLabel}>평균 마진율</span></div>
            <div className={styles.hmStatItem}><span className={styles.hmStatNum}>2~3%</span><span className={styles.hmStatLabel}>구독료</span></div>
          </div>

          {/* CTA */}
          <div className={styles.hmCta}>
            <button className={styles.hmCtaBtn} onClick={() => { alert('상담 신청 팝업 연결 준비 중입니다.'); }}>히로 구독 서비스 상담 신청하기</button>
            <button className={styles.hmCtaBtnSecondary} onClick={() => { onClose(); navigate('/host/register/select'); }}>오픈레터하우스 호스트 등록하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { open } = useSearchModal();
  const [properties, setProperties] = useState<Property[]>([]);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [hostModalOpen, setHostModalOpen] = useState(false);

  function openRandomGame() {
    const url = GAMES[Math.floor(Math.random() * GAMES.length)];
    setGameUrl(url);
  }

  useEffect(() => {
    let cancelled = false;
    listProperties()
      .then((items) => { if (!cancelled) setProperties(items); })
      .catch(() => { if (!cancelled) setProperties([]); });
    return () => { cancelled = true; };
  }, []);

  const realCards = properties.map(propertyToCardData);

  return (
    <div className={styles.page}>
      <div className={styles.searchSection}>
        <p className={styles.heroSub}><strong>히로(HIERO)</strong> 와 함께 나에게 딱 맞는 동네에서 살아봐요.</p>
        <img src="/hiero-drawing2.png" alt="" className={styles.heroDrawing} />
      </div>

      {/* 3 Cards */}
      <section className={styles.threeCards}>
        <div className={`${styles.card} ${styles.card1}`}>
          <p className={styles.cardEyebrow}>지금 바로 시작하는</p>
          <img src="/beahost.png" alt="Host Your Space" className={styles.cardTitleImg} />
          <p className={styles.cardDesc}>숙소 개설부터 운영 관리까지,<br />컨설팅으로 함께 시작해드려요.</p>
          <button className={styles.cardBtn} onClick={() => setHostModalOpen(true)}>
            호스트 되기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        <div className={`${styles.card} ${styles.card2}`}>
          <p className={styles.cardEyebrow}>살아보고 싶은 동네에서</p>
          <img src="/findyourroom.png" alt="Find My Room" className={styles.cardTitleImg} />
          <p className={styles.cardDesc}>원하는 지역의 숙소를 찾아보세요.<br />단기부터 장기 거주까지.</p>
          <button className={styles.cardBtn} onClick={open}>
            내 숙소 찾기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        <div className={`${styles.card} ${styles.card3}`}>
          <p className={styles.cardEyebrow}>어디 살지 모르겠다면?</p>
          <img src="/matches.png" alt="My Neighborhood" className={styles.cardTitleImg} />
          <p className={styles.cardDesc}>몇 가지 질문으로 나에게 딱 맞는<br />동네를 찾아드려요.</p>
          <button className={styles.cardBtn} onClick={openRandomGame}>
            내 동네 찾기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Host Modal */}
      {hostModalOpen && <HostModal onClose={() => setHostModalOpen(false)} />}

      {/* Game Modal */}
      {gameUrl && (
        <div className={styles.neighborhoodOverlay} onClick={e => e.target === e.currentTarget && setGameUrl(null)}>
          <div className={styles.neighborhoodModal}>
            <button className={styles.neighborhoodClose} onClick={() => setGameUrl(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <iframe src={gameUrl} className={styles.gameFrame} title="동네 게임" />
          </div>
        </div>
      )}


      <ConceptSection title="아트 스테이"   desc="예술가의 손길이 담긴 공간에서의 하룻밤"     linkCategory="아트 스테이" real={realCards} fillerKey="아트 스테이" />
      <ConceptSection title="친환경 스테이" desc="자연과 함께 숨쉬는 지속 가능한 공간"        linkCategory="친환경"      real={[]}         fillerKey="친환경" />
      <ConceptSection title="로컬 스테이"   desc="그 동네 사람처럼 살아보는 특별한 경험"     linkCategory="로컬 스테이" real={[]}         fillerKey="로컬 스테이" />
    </div>
  );
}
