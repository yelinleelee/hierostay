import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.hours}>
            고객센터 평일 10:00 ~ 19:00 (주말 및 공휴일 제외)<br />
            점심시간 12:30 ~ 13:30
          </p>
          <div className={styles.ctaRow}>
            {['입점 문의', '제휴 문의', 'B2B 구매', '1:1 문의'].map(t => (
              <button key={t} className={styles.ctaBtn}>{t}</button>
            ))}
          </div>
          <div className={styles.links}>
            <a href="#">ABOUT</a><span>·</span>
            <a href="#">NEWSLETTER</a><span>·</span>
            <a href="#">이용약관</a><span>·</span>
            <a href="#">개인정보 처리방침</a>
          </div>
          <p className={styles.biz}>
            상호명: 오픈레터하우스 주식회사 &nbsp;|&nbsp; 대표: 홍길동 &nbsp;|&nbsp; 사업자등록번호: 123-45-67890<br />
            주소: 서울특별시 마포구 와우산로 123, 5층 &nbsp;|&nbsp; 통신판매업신고: 2025-서울마포-0001호
          </p>
          <p className={styles.disclaimer}>오픈레터하우스는 통신판매중개자이며, 통신판매의 당사자가 아닙니다.</p>
          <p className={styles.copyright}>© 2025 Open Letter House. All rights reserved.</p>
        </div>
        <div className={styles.right}>
          <div className={styles.footerLogo}>
            OPEN LETTER
            <span>HOUSE</span>
          </div>
          <div className={styles.sns}>
            <a className={styles.snsBtn} href="#" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a className={styles.snsBtn} href="#" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a className={styles.snsBtn} href="#" title="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="none" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
