import { useNavigate } from 'react-router-dom';
import styles from './Hiero.module.css';

export function HieroLandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Section 1: Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <img src="/hiero-drawing.png" alt="HIERO" className={styles.heroImage} />
          <h1 className={styles.heroTitle}>
            숙소 관리가 귀찮다면?<br />
            오픈레터 관리 구독 서비스 —<br />
            숙소 운영을 우리에게 맡겨보세요.
          </h1>
          <p className={styles.heroDesc}>
            예약부터 메시지 응대, 청소, 정산까지.<br />
            히로(HIERO)가 호스트님의 시간을 되찾아 드립니다.
          </p>
        </div>
      </section>

      {/* Section 2: Pain Point */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>"아직도 새벽 2시에 게스트 메시지 알람에 깨시나요?"</h2>
        </div>
        <div className={styles.painPoints}>
          <div className={styles.painPointCard}>💬 끝도 없는 게스트 응대와 CS</div>
          <div className={styles.painPointCard}>🧹 갑자기 펑크 나는 청소 스케줄 관리</div>
          <div className={styles.painPointCard}>📉 비수기만 되면 늘어나는 공실과 수익 걱정</div>
          <div className={styles.painPointCard}>⚖️ 복잡한 정산과 전세사기 이슈 등 법률적 불안감</div>
        </div>
      </section>

      {/* Section 3: Solution */}
      <section className={`${styles.section} ${styles.bgGray}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>오픈레터하우스에 올리기만 하세요.<br />나머지는 HIERO OS가 알아서 합니다.</h2>
        </div>
        <div className={styles.solutionGrid}>
          <div className={styles.solutionCard}>
            <div className={styles.solutionIcon}>🤖</div>
            <h3 className={styles.solutionTitle}>AI 자동 응대 (Smart CS)</h3>
            <p className={styles.solutionDesc}>90% 이상의 단순 문의를 AI가 즉각 처리하여 호스트의 수고를 덜어줍니다.</p>
          </div>
          <div className={styles.solutionCard}>
            <div className={styles.solutionIcon}>✨</div>
            <h3 className={styles.solutionTitle}>지능형 청소/시설 관리</h3>
            <p className={styles.solutionDesc}>입·퇴거 스케줄에 맞춰 청소와 시설 점검을 자동으로 배정합니다.</p>
          </div>
          <div className={styles.solutionCard}>
            <div className={styles.solutionIcon}>📈</div>
            <h3 className={styles.solutionTitle}>AI 동적 가격 시스템</h3>
            <p className={styles.solutionDesc}>시장 데이터 기반으로 최적의 가격을 산정하여 수익을 극대화합니다.</p>
          </div>
          <div className={styles.solutionCard}>
            <div className={styles.solutionIcon}>🛡️</div>
            <h3 className={styles.solutionTitle}>법률·세무 안심 케어</h3>
            <p className={styles.solutionDesc}>구독형 이용약관과 외부 자문 연계를 통해 제도적 리스크를 사전에 차단합니다.</p>
          </div>
        </div>
      </section>

      {/* Section 4: Competitiveness */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>내 방이 비어도 안심할 수 있는 이유,<br />'인벤토리 풀(Inventory Pool)' 시스템</h2>
        </div>
        <div className={styles.competitivenessContent}>
          <ul className={styles.featureList}>
            <li>동일 생활권 내 유사 등급의 숙소를 하나의 '풀'로 묶어 관리하여 특정 호실의 공실 리스크를 획기적으로 줄입니다.</li>
            <li>목표 점유율 85~95% 유지 (AI 당일 자동 배분 시스템)</li>
            <li>평균 마진율 33.5% 달성 (운영 자동화 및 최적화 결과)</li>
            <li>매출 쉐어가 아닌 합리적인 구독료(2~3%)로 호스트의 수익을 보호합니다.</li>
          </ul>
        </div>
      </section>

      {/* Section 5: Trust & Team */}
      <section className={`${styles.section} ${styles.bgDark}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitleDark}>"부동산 시장을 가장 잘 아는 도시계획 전문가들이 설계했습니다."</h2>
        </div>
        <p className={styles.trustDesc}>
          8~12년 이상의 부동산 및 생활권 분석 경력을 가진 도시공학 석·박사 팀이 지역 데이터에 기반하여 가장 안전하고 효율적인 운영 모델을 구축했습니다.
        </p>
      </section>

      {/* Section 6: Review */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>호스트 & 게스트 리얼 후기</h2>
        </div>
        <div className={styles.reviewGrid}>
          <div className={styles.reviewCard}>
            <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
            <p className={styles.reviewText}>"새벽 메시지 알람 소리에 깨던 날들이 이젠 기억도 안 나요. AI가 응대의 90%를 처리해주니 본업에 집중할 수 있게 됐습니다."</p>
            <p className={styles.reviewAuthor}>- 성내동 빌라 호스트</p>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
            <p className={styles.reviewText}>"비수기 공실 걱정이 많았는데, 동적 가격 시스템 덕분에 33.5%라는 마진율을 꾸준히 유지 중입니다. 대시보드 보는 맛이 나네요."</p>
            <p className={styles.reviewAuthor}>- 강동구 오피스텔 호스트</p>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
            <p className={styles.reviewText}>"문의 답변이 빛의 속도예요! 청소 상태도 호텔급이라 다음번에도 꼭 이 생활권의 오픈레터 숙소를 이용하고 싶어요."</p>
            <p className={styles.reviewAuthor}>- 30대 가족 게스트</p>
          </div>
        </div>
      </section>

      {/* Section 7: CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>호스트님의 시간은 더 가치 있는 곳에 쓰여야 하니까요.</h2>
        <p className={styles.ctaDesc}>지금 바로 히로(HIERO)와 함께 편안한 호스팅을 시작하세요.</p>
        <div className={styles.ctaButtons}>
          <button className={styles.btnPrimary} onClick={() => alert('상담 신청 팝업 연결 준비 중입니다.')}>히로 구독 서비스 상담 신청하기</button>
          <button className={styles.btnSecondary} onClick={() => navigate('/host/register/select')}>오픈레터하우스 호스트 등록하기</button>
        </div>
      </section>
    </div>
  );
}
