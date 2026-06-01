import styles from './BrandStory.module.css';

export function BrandStoryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>OPEN LETTER HOUSE</h1>
        <p className={styles.heroSub}>편지처럼 남겨지는 공간들의 이야기</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionText}>
            <h2 className={styles.sectionTitle}>우리의 이야기</h2>
            <p className={styles.sectionBody}>
              오픈레터하우스는 여행자와 공간이 서로에게 편지를 쓰듯 연결되는 플랫폼입니다. 우리는 단순한 숙박을 넘어, 공간이 가진 이야기와 문화를 함께 경험할 수 있는 특별한 스테이를 큐레이팅합니다.
            </p>
            <p className={styles.sectionBody}>
              각 스테이는 호스트의 개성과 철학이 담긴 고유한 공간입니다. 아티스트의 작업실에서 하룻밤을, 친환경 건축가의 집에서 자연을, 오래된 골목의 한옥에서 시간의 결을 경험해보세요.
            </p>
          </div>
          <div className={styles.sectionImg} style={{ background: 'linear-gradient(135deg, #3d3028 0%, #6b4c3b 100%)' }} />
        </section>

        <section className={`${styles.section} ${styles.sectionReverse}`}>
          <div className={styles.sectionImg} style={{ background: 'linear-gradient(135deg, #2b3a4a 0%, #4a6580 100%)' }} />
          <div className={styles.sectionText}>
            <h2 className={styles.sectionTitle}>세 가지 컨셉</h2>
            <div className={styles.conceptList}>
              {[
                { title: '아트 스테이', desc: '예술가의 손길이 담긴 공간. 회화, 조각, 사진 등 다양한 예술 작품과 함께하는 특별한 숙박 경험.' },
                { title: '친환경 스테이', desc: '지속 가능한 건축과 소재로 만들어진 공간. 자연과 함께 숨쉬며 환경을 생각하는 여행.' },
                { title: '로컬 스테이', desc: '그 동네 사람처럼 살아보는 경험. 관광지가 아닌, 진짜 동네의 일상 속으로.' },
              ].map(c => (
                <div key={c.title} className={styles.conceptItem}>
                  <h3 className={styles.conceptItemTitle}>{c.title}</h3>
                  <p className={styles.conceptItemDesc}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.valuesSection}>
          <h2 className={styles.valuesTitle}>우리가 믿는 것들</h2>
          <div className={styles.valuesGrid}>
            {[
              { icon: '✦', title: '진정성', desc: '모든 스테이는 직접 방문하고 검증합니다.' },
              { icon: '◎', title: '연결', desc: '여행자와 공간, 호스트가 서로 이야기를 나눕니다.' },
              { icon: '◇', title: '지속가능성', desc: '환경과 지역 커뮤니티를 생각하는 여행을 지향합니다.' },
              { icon: '○', title: '발견', desc: '아직 알려지지 않은 특별한 공간들을 발굴합니다.' },
            ].map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
