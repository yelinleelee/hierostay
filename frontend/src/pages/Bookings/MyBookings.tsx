import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelBooking, listMyBookings } from '../../lib/bookings';
import type { Booking, BookingStatus } from '../../types/booking';
import { ApiError } from '../../lib/api';
import { ReviewForm } from '../../components/ReviewForm';
import styles from './MyBookings.module.css';

const STATUS_LABEL: Record<BookingStatus, { label: string; cls: string }> = {
  pending:   { label: '승인 대기', cls: 'statusPending' },
  confirmed: { label: '예약 확정', cls: 'statusConfirmed' },
  cancelled: { label: '취소됨',    cls: 'statusCancelled' },
  completed: { label: '이용 완료', cls: 'statusCompleted' },
};

export function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [reviewing, setReviewing] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listMyBookings()
      .then(setBookings)
      .catch((e) => setError(e instanceof ApiError ? e.message : '예약을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCancel(b: Booking) {
    if (!window.confirm('예약을 취소하시겠습니까?')) return;
    const reason = window.prompt('취소 사유 (선택사항)') ?? '';
    setCancelling(b.ID);
    try {
      await cancelBooking(b.ID, reason);
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : '예약 취소에 실패했습니다.');
    } finally {
      setCancelling(null);
    }
  }

  function isReviewable(b: Booking) {
    if (b.status === 'cancelled') return false;
    return new Date(b.check_out) <= new Date();
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>내 예약</h1>

      {error && <div className={styles.errorBox}>{error}</div>}

      {loading ? (
        <div className={styles.empty}>불러오는 중…</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          <p>예약 내역이 없습니다.</p>
          <button className={styles.linkBtn} onClick={() => navigate('/stays')}>스테이 둘러보기</button>
        </div>
      ) : (
        <div className={styles.list}>
          {bookings.map((b) => {
            const s = STATUS_LABEL[b.status];
            const cover = b.property?.images?.[0];
            const canCancel = b.status === 'pending' || b.status === 'confirmed';
            const reviewable = isReviewable(b);
            return (
              <div key={b.ID} className={styles.card}>
                <div className={styles.thumb} onClick={() => b.property && navigate(`/stays/${b.property_id}`)}>
                  {cover ? (
                    <img src={cover} alt={b.property?.title || ''} />
                  ) : (
                    <div className={styles.thumbPlaceholder}>이미지 없음</div>
                  )}
                </div>
                <div className={styles.body}>
                  <div className={styles.cardHead}>
                    <div className={styles.propTitle}>{b.property?.title ?? `Property #${b.property_id}`}</div>
                    <span className={`${styles.badge} ${styles[s.cls]}`}>{s.label}</span>
                  </div>
                  <div className={styles.meta}>{b.property?.city} · {b.property?.address}</div>
                  <div className={styles.dates}>{b.check_in} → {b.check_out} · {b.guests}명</div>
                  <div className={styles.priceRow}>
                    <span>총 결제액</span>
                    <strong>₩{Number(b.total_price).toLocaleString()}</strong>
                  </div>
                  <div className={styles.actions}>
                    {reviewable && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => setReviewing((id) => (id === b.ID ? null : b.ID))}
                      >
                        {reviewing === b.ID ? '리뷰 닫기' : '리뷰 작성'}
                      </button>
                    )}
                    {canCancel && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancel(b)}
                        disabled={cancelling === b.ID}
                      >
                        {cancelling === b.ID ? '취소 중…' : '예약 취소'}
                      </button>
                    )}
                  </div>

                  {reviewing === b.ID && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      <ReviewForm
                        bookingId={b.ID}
                        onCancel={() => setReviewing(null)}
                        onSubmitted={() => { setReviewing(null); load(); }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
