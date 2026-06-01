import { useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../context/SearchModalContext';
import styles from './About.module.css';

export function AboutPage() {
  const navigate = useNavigate();
  const { open } = useSearchModal();

  return (
    <div className={styles.page}>
      {/* Section 1: Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>OPEN LETTER HOUSE</span>
          <h1 className={styles.heroTitle}>
            당신과 가장 닮은 동네를<br />찾으세요.
          </h1>
          <p className={styles.heroDesc}>
            단기 임대, 이제는 역세권이 아니라 <strong>'내 취향 골목'</strong>을 기준으로 선택할 때입니다.<br />
            오픈레터하우스가 당신의 한 챕터가 될 동네를 매칭해 드립니다.
          </p>
        </div>
      </section>

      {/* Section 2: Why Open Letter? */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>WHY OPEN LETTER?</span>
          <h2 className={styles.sectionTitle}>"집 밖 10분이 당신의 하루를 결정합니다."</h2>
          <p className={styles.sectionLead}>역세권이면 정말 행복할까요?</p>
        </div>
        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <div className={styles.whyEmoji}>🌳</div>
            <p className={styles.whyText}>창문을 열었을 때 보이는 가로수 그늘</p>
          </div>
          <div className={styles.whyCard}>
            <div className={styles.whyEmoji}>🥐</div>
            <p className={styles.whyText}>퇴근길 마주치는 다정한 빵집의 온기</p>
          </div>
          <div className={styles.whyCard}>
            <div className={styles.whyEmoji}>🐕</div>
            <p className={styles.whyText}>주말 아침 강아지와 함께 걷는 산책길</p>
          </div>
        </div>
        <p className={styles.whyConclusion}>
          오픈레터는 당신의 삶이 가장 빛날 수 있는 <strong>'중간영역'</strong>을 찾아냅니다.
        </p>
      </section>

      {/* Section 3: MORO Score */}
      <section className={`${styles.section} ${styles.bgBeige}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>PLATFORM CORE</span>
          <h2 className={styles.sectionTitle}>감성을 데이터로 증명합니다<br />— MORO Score Stack</h2>
        </div>
        <div className={styles.moroGrid}>
          <div className={styles.moroCard}>
            <div className={styles.moroIconWrap}>🛡️</div>
            <h3 className={styles.moroTitle}>포기불가 지수</h3>
            <p className={styles.moroSubtitle}>Life Quality</p>
            <p className={styles.moroDesc}>
              경사도, 체감 안전, 주차 등 절대 양보할 수 없는 기본 생활 여건을 체크합니다.
            </p>
          </div>
          <div className={styles.moroCard}>
            <div className={styles.moroIconWrap}>☕</div>
            <h3 className={styles.moroTitle}>골목 바이브 지수</h3>
            <p className={styles.moroSubtitle}>Neighborhood Vibe</p>
            <p className={styles.moroDesc}>
              3년 이상 자리를 지킨 스테디 빵집, 인디 서점, 공원 벤치 등 동네의 아날로그 온기를 측정합니다.
            </p>
          </div>
          <div className={styles.moroCard}>
            <div className={styles.moroIconWrap}>🚇</div>
            <h3 className={styles.moroTitle}>외부 연결 지수</h3>
            <p className={styles.moroSubtitle}>Connectivity</p>
            <p className={styles.moroDesc}>
              직장까지의 실 소요 시간과 따릉이·러닝 코스 접근성까지 고려합니다.
            </p>
          </div>
        </div>
        <p className={styles.dataNote}>도시공학 전문가들이 설계한 데이터 기반 매칭 시스템</p>
      </section>

      {/* Section 4: Story Stay */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>STORY STAY</span>
          <h2 className={styles.sectionTitle}>당신의 취향을 구독하세요,<br />'스토리 스테이'</h2>
          <p className={styles.sectionLead}>단순 숙박을 넘어, 당신의 취향을 구체화하는 테마형 공간.</p>
        </div>
        <div className={styles.storyGrid}>
          <div className={`${styles.storyCard} ${styles.storyArt}`}>
            <div className={styles.storyEmoji}>🎨</div>
            <h3 className={styles.storyTitle}>아트 스테이</h3>
            <p className={styles.storySubtitle}>Art Stay</p>
            <p className={styles.storyDesc}>
              영감이 필요한 당신을 위해. 독립 갤러리와 예술적 골목이 어우러진 크리에이티브 공간.
            </p>
          </div>
          <div className={`${styles.storyCard} ${styles.storyEco}`}>
            <div className={styles.storyEmoji}>🌿</div>
            <h3 className={styles.storyTitle}>에코 스테이</h3>
            <p className={styles.storySubtitle}>Eco Stay</p>
            <p className={styles.storyDesc}>
              회복이 필요한 당신을 위해. 한강까지 12분, 가로수 그늘과 식물이 가득한 힐링 공간.
            </p>
          </div>
          <div className={`${styles.storyCard} ${styles.storyWork}`}>
            <div className={styles.storyEmoji}>💻</div>
            <h3 className={styles.storyTitle}>워라밸 스테이</h3>
            <p className={styles.storySubtitle}>Work-Life Stay</p>
            <p className={styles.storyDesc}>
              효율이 중요한 당신을 위해. 강남 출퇴근 30분 컷, 단골 국밥집과 조용한 밤이 있는 실속 공간.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Local Identity */}
      <section className={`${styles.section} ${styles.bgSoftBlue}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>LOCAL IDENTITY</span>
          <h2 className={styles.sectionTitle}>"당신은 이 동네에서<br />어떤 사람인가요?"</h2>
        </div>
        <div className={styles.identityCard}>
          <div className={styles.identityHead}>
            <span className={styles.identityLocation}>📍 성내동</span>
            <span className={styles.identityRole}>로컬 취향 탐험가</span>
          </div>
          <p className={styles.identityQuote}>
            "당신은 성내동에서 <strong>'로컬 취향 탐험가'</strong>로 살게 될 거예요.<br />
            아직 핫플이 되기 전의 숨은 감도를 가장 먼저 발견하는 루틴."
          </p>
          <div className={styles.identityTags}>
            <span className={styles.identityTag}>#인디감성</span>
            <span className={styles.identityTag}>#나만아는곳</span>
          </div>
        </div>
      </section>

      {/* Section 6: Trust - Managed by HIERO */}
      <section className={`${styles.section} ${styles.bgDark}`}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.eyebrow} ${styles.eyebrowLight}`}>MANAGED BY HIERO</span>
          <h2 className={styles.sectionTitleLight}>감성은 로컬에서,<br />운영은 프로페셔널하게.</h2>
        </div>
        <p className={styles.trustDesc}>
          오픈레터하우스의 모든 숙소는 전문 운영 OS인 <strong>HIERO(히로)</strong>를 통해 관리됩니다.<br />
          어느 동네를 선택하든 표준화된 청결함, 신속한 AI 응대, 투명한 계약 시스템을 보장합니다.
        </p>
        <button className={styles.trustLink} onClick={() => navigate('/host/hiero')}>
          HIERO 자세히 보기 →
        </button>
      </section>

      {/* Section 7: CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>지금 당신과 가장 닮은 동네는 어디인가요?</h2>
        <p className={styles.ctaDesc}>나다운 삶의 한 챕터를 오늘 시작하세요.</p>
        <div className={styles.ctaButtons}>
          <button className={styles.btnPrimary} onClick={open}>
            나에게 딱 맞는 동네 & 숙소 찾기
          </button>
          <button className={styles.btnSecondary} onClick={() => navigate('/neighborhood')}>
            1분 만에 취향 퀴즈 시작하기
          </button>
        </div>
      </section>
    </div>
  );
}
