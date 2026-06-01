import { useEffect, useState } from 'react';
import styles from './ConsultModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'sourcing', label: '아직 매물이 없어요 (신규 발굴 희망)' },
  { value: 'remodel',  label: '이미 집이 있어요 (공실 해결/리모델링 희망)' },
  { value: 'optimize', label: '현재 숙소를 운영 중이에요 (운영 최적화 희망)' },
];

const BUDGET_OPTIONS = [
  { value: 'under30',  label: '3,000만 원 미만' },
  { value: '30to70',   label: '3,000만 원 ~ 7,000만 원' },
  { value: 'over70',   label: '7,000만 원 이상' },
];

export function ConsultModal({ open, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [budget, setBudget] = useState('');
  const [region, setRegion] = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function reset() {
    setName(''); setPhone(''); setStatus(''); setBudget('');
    setRegion(''); setMessage(''); setAgree(false);
    setSubmitted(false); setError('');
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('성함과 연락처는 필수입니다.');
      return;
    }
    if (!agree) {
      setError('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    const statusLabel = STATUS_OPTIONS.find(o => o.value === status)?.label || '미선택';
    const budgetLabel = BUDGET_OPTIONS.find(o => o.value === budget)?.label || '미선택';

    const formData = {
      _subject: `[오픈레터 컨설팅 상담 신청] ${name}님의 신청 건입니다.`,
      _template: 'table',
      _captcha: 'false',
      성함: name,
      연락처: phone,
      현재상태: statusLabel,
      예상예산: budgetLabel,
      관심지역: region || '미입력',
      문의내용: message || '미입력',
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/au.design84@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('전송 실패');
      setSubmitted(true);
    } catch {
      setError('전송 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="닫기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className={styles.thanksWrap}>
            <div className={styles.thanksIcon}>✉️</div>
            <h2 className={styles.thanksTitle}>신청이 완료되었습니다.</h2>
            <p className={styles.thanksDesc}>
              24시간 이내에 전문가가 연락드리겠습니다.<br />
              오픈레터하우스를 신뢰해 주셔서 감사합니다.
            </p>
            <button className={styles.thanksClose} onClick={handleClose}>닫기</button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <span className={styles.eyebrow}>OPEN LETTER PREMIUM CONSULTING</span>
              <h2 className={styles.title}>1:1 프리미엄 호스팅 컨설팅 신청</h2>
              <p className={styles.lead}>
                성공적인 숙소 운영의 시작, 도시공학 전문가 팀이<br />
                호스트님의 조건에 딱 맞는 최적의 전략을 제안해 드립니다.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>성함 <em>*</em></span>
                  <input
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="실명 혹은 닉네임"
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>연락처 <em>*</em></span>
                  <input
                    type="tel"
                    className={styles.input}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    required
                  />
                </label>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>현재 상태</span>
                <div className={styles.optionList}>
                  {STATUS_OPTIONS.map(o => (
                    <label
                      key={o.value}
                      className={`${styles.option} ${status === o.value ? styles.optionSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={o.value}
                        checked={status === o.value}
                        onChange={() => setStatus(o.value)}
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>예상 투자 예산</span>
                <div className={styles.optionRow}>
                  {BUDGET_OPTIONS.map(o => (
                    <label
                      key={o.value}
                      className={`${styles.budget} ${budget === o.value ? styles.budgetSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={o.value}
                        checked={budget === o.value}
                        onChange={() => setBudget(o.value)}
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
                <p className={styles.note}>
                  비용은 상담 후 호스트님의 예산과 목표에 따라 맞춤형으로 산정됩니다.
                </p>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>관심 지역</span>
                <input
                  type="text"
                  className={styles.input}
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  placeholder="예) 강동구 성내동, 마포구 연남동"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>문의 내용</span>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="추가로 궁금하신 점을 자유롭게 적어주세요."
                  rows={4}
                />
              </label>

              <label className={styles.agree}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                />
                <span>
                  <strong>(필수)</strong> 상담 진행을 위한 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? '전송 중...' : '전문가와 1:1 상담 시작하기'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
