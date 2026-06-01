import { useState } from 'react';
import { ConsultModal } from './ConsultModal';
import styles from './Launching.module.css';

export function LaunchingPage() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className={styles.page}>
      {/* Section 1: Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>OPEN LETTER LAUNCHING SOLUTION</span>
          <h1 className={styles.heroTitle}>
            매물 발굴부터 리모델링까지<br />
            — 당신의 숙소, 시작부터 완성까지 책임집니다.
          </h1>
          <p className={styles.heroDesc}>
            복잡한 부동산 앱, 정체불명의 인테리어 업체 사이에서 헤매지 마세요.<br />
            도시공학 전문가들이 수익률 높은 매물을 찾고, 가장 효율적인 공간으로 세팅해 드립니다.
          </p>
          <div className={styles.heroKey}>🔑</div>
        </div>
      </section>

      {/* Section 2: Pain Points */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>PAIN POINTS</span>
          <h2 className={styles.sectionTitle}>
            "호스트가 되고 싶은 마음은 굴뚝같지만,<br />현실은 이렇지 않나요?"
          </h2>
        </div>
        <div className={styles.painList}>
          <div className={styles.painCard}>
            <span className={styles.painNum}>01</span>
            <h3 className={styles.painTitle}>"매물 찾기가 너무 힘들어요."</h3>
            <p className={styles.painDesc}>
              어떤 동네가 뜨는지, 어떤 건물이 수익이 날지 판단하기 어렵습니다.
            </p>
          </div>
          <div className={styles.painCard}>
            <span className={styles.painNum}>02</span>
            <h3 className={styles.painTitle}>"시공을 어디서부터 어디까지 해야 할까요?"</h3>
            <p className={styles.painDesc}>
              인테리어 견적은 천차만별이고, 불필요한 공사비 지출은 늘어만 갑니다.
            </p>
          </div>
          <div className={styles.painCard}>
            <span className={styles.painNum}>03</span>
            <h3 className={styles.painTitle}>"세팅은 끝냈는데, 운영은요?"</h3>
            <p className={styles.painDesc}>
              첫 게스트를 받는 법부터 청소 관리, 수익률 최적화까지 막막하기만 합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Our Solution */}
      <section className={`${styles.section} ${styles.bgCream}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>TOTAL CARE SOLUTION</span>
          <h2 className={styles.sectionTitle}>
            전문가의 시각으로 설계하고,<br />HIERO OS로 완성합니다.
          </h2>
        </div>
        <div className={styles.solutionList}>
          <div className={styles.solutionCard}>
            <span className={styles.solutionStep}>STEP 1</span>
            <div className={styles.solutionIcon}>🔍</div>
            <h3 className={styles.solutionTitle}>데이터 기반 매물 발굴</h3>
            <p className={styles.solutionLabel}>Sourcing</p>
            <p className={styles.solutionDesc}>
              도시공학 박사급 팀이 유동 인구와 상권, 'MORO 스코어'를 분석하여
              가장 공실률이 낮고 수익성이 높은 빌라·오피스텔 매물을 선별합니다.
            </p>
          </div>
          <div className={styles.solutionCard}>
            <span className={styles.solutionStep}>STEP 2</span>
            <div className={styles.solutionIcon}>🛠️</div>
            <h3 className={styles.solutionTitle}>최적화 리모델링 & 세팅</h3>
            <p className={styles.solutionLabel}>Setup</p>
            <p className={styles.solutionDesc}>
              '아트 스테이', '워라밸 스테이' 등 명확한 테마를 설정하고,
              최소 비용으로 최대의 공간 감도를 뽑아낼 수 있는 전문 시공 및 스타일링을 진행합니다.
            </p>
          </div>
          <div className={styles.solutionCard}>
            <span className={styles.solutionStep}>STEP 3</span>
            <div className={styles.solutionIcon}>🚀</div>
            <h3 className={styles.solutionTitle}>하이패스 운영 안착</h3>
            <p className={styles.solutionLabel}>Operation</p>
            <p className={styles.solutionDesc}>
              숙소 완공과 동시에 HIERO 자동화 시스템을 이식합니다.
              메시지 응대, 청소 배정, 정산 관리가 자동으로 돌아가는 '자동 수익형 자산'으로 만들어 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Expertise */}
      <section className={`${styles.section} ${styles.bgDark}`}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.eyebrow} ${styles.eyebrowLight}`}>WHY OPEN LETTER</span>
          <h2 className={styles.sectionTitleLight}>
            단순한 중개가 아닙니다.<br />
            도시를 이해하는 전문가들이 만드는 비즈니스입니다.
          </h2>
        </div>
        <div className={styles.expertiseGrid}>
          <div className={styles.expertiseStat}>
            <p className={styles.statNum}>12<span className={styles.statUnit}>년</span></p>
            <p className={styles.statLabel}>부동산 운영 경력</p>
            <p className={styles.statSub}>도시공학 박사 수료 및 전문가팀 구성</p>
          </div>
          <div className={styles.expertiseStat}>
            <p className={styles.statNum}>100<span className={styles.statUnit}>+</span></p>
            <p className={styles.statLabel}>강동구 실운영 가구</p>
            <p className={styles.statSub}>실데이터 기반 수익 구조 검증 완료</p>
          </div>
          <div className={styles.expertiseStat}>
            <p className={styles.statNum}>33.5<span className={styles.statUnit}>%</span></p>
            <p className={styles.statLabel}>평균 마진율</p>
            <p className={styles.statSub}>고효율 운영 노하우 전수</p>
          </div>
        </div>
      </section>

      {/* Section 5: Process */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>PROCESS</span>
          <h2 className={styles.sectionTitle}>호스트님 맞춤형으로<br />단계별로 진행됩니다.</h2>
        </div>
        <div className={styles.processList}>
          <div className={styles.processItem}>
            <span className={styles.processNum}>01</span>
            <div className={styles.processBody}>
              <h3 className={styles.processTitle}>1:1 상담 신청</h3>
              <p className={styles.processDesc}>
                호스트님의 자산 규모와 희망 수익률을 확인합니다.
              </p>
            </div>
          </div>
          <div className={styles.processItem}>
            <span className={styles.processNum}>02</span>
            <div className={styles.processBody}>
              <h3 className={styles.processTitle}>정밀 진단 및 제안</h3>
              <p className={styles.processDesc}>
                적합한 지역과 매물 후보군, 예상 시공 범위를 제안해 드립니다.
              </p>
            </div>
          </div>
          <div className={styles.processItem}>
            <span className={styles.processNum}>03</span>
            <div className={styles.processBody}>
              <h3 className={styles.processTitle}>매수 및 시공 계약</h3>
              <p className={styles.processDesc}>
                최종 결정된 모델을 바탕으로 안전하게 프로젝트를 착수합니다.
              </p>
            </div>
          </div>
          <div className={styles.processItem}>
            <span className={styles.processNum}>04</span>
            <div className={styles.processBody}>
              <h3 className={styles.processTitle}>그랜드 오픈 & 운영 이관</h3>
              <p className={styles.processDesc}>
                숙소가 완성되면 즉시 오픈레터하우스 플랫폼에 등록하고 자동 운영을 시작합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          지금 바로 당신만을 위한<br />호스팅 전략 리포트를 받아보세요.
        </h2>
        <p className={styles.ctaDesc}>
          당신의 부동산 가치를 바꾸는 가장 확실한 방법입니다.
        </p>
        <button
          className={styles.ctaButton}
          onClick={() => setConsultOpen(true)}
        >
          1:1 프라이빗 컨설팅 상담 신청하기
        </button>
        <p className={styles.ctaNote}>
          본 서비스는 호스트님의 예산과 목표에 따라 맞춤형으로 진행되며, 상담 후 비용이 산정됩니다.
        </p>
      </section>

      <ConsultModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </div>
  );
}
