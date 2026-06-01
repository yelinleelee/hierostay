import { useCallback, useEffect, useState } from 'react';
import { approveBooking, cancelBooking, listHostBookings } from '../../lib/bookings';
import { ApiError } from '../../lib/api';
import type { Booking, BookingStatus } from '../../types/booking';
import { HostSidebar } from '../Host/Dashboard/HostSidebar';
import dashStyles from '../Host/Dashboard/Dashboard.module.css';
import styles from './HostBookings.module.css';

const STATUS_LABEL: Record<BookingStatus, { label: string; cls: string }> = {
  pending:   { label: '승인 대기', cls: 'statusPending' },
  confirmed: { label: '예약 확정', cls: 'statusConfirmed' },
  cancelled: { label: '취소됨',    cls: 'statusCancelled' },
  completed: { label: '이용 완료', cls: 'statusCompleted' },
};

export function HostBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listHostBookings()
      .then(setBookings)
      .catch((e) => setError(e instanceof ApiError ? e.message : '예약을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(b: Booking) {
    setActing(b.ID);
    try {
      await approveBooking(b.ID);
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : '승인에 실패했습니다.');
    } finally {
      setActing(null);
    }
  }

  async function handleReject(b: Booking) {
    if (!window.confirm('이 예약을 거절(취소)하시겠습니까?')) return;
    setActing(b.ID);
    try {
      await cancelBooking(b.ID, '호스트 거절');
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : '거절에 실패했습니다.');
    } finally {
      setActing(null);
    }
  }

  return (
    <div className={dashStyles.layout}>
      <HostSidebar />

      <main className={dashStyles.main}>
        <div className={dashStyles.mainHeader}>
          <h1 className={dashStyles.mainTitle}>예약 관리</h1>
        </div>

        {error && (
          <div style={{ padding: 14, background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: 10, color: '#c0392b', fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className={dashStyles.section}>
          {loading ? (
            <div className={styles.empty}>불러오는 중…</div>
          ) : bookings.length === 0 ? (
            <div className={styles.empty}>아직 들어온 예약이 없습니다.</div>
          ) : (
            <div className={styles.list}>
              {bookings.map((b) => {
                const s = STATUS_LABEL[b.status];
                const cover = b.property?.images?.[0];
                return (
                  <div key={b.ID} className={styles.row}>
                    <div className={styles.thumb}>
                      {cover ? (
                        <img src={cover} alt={b.property?.title || ''} />
                      ) : (
                        <div className={styles.thumbPlaceholder}>—</div>
                      )}
                    </div>
                    <div className={styles.info}>
                      <div className={styles.propTitle}>{b.property?.title ?? `Property #${b.property_id}`}</div>
                      <div className={styles.guest}>
                        게스트: <strong>{b.guest?.name ?? '-'}</strong>
                        {b.guest?.email && <span className={styles.email}> · {b.guest.email}</span>}
                      </div>
                      <div className={styles.dates}>
                        {b.check_in} → {b.check_out} · {b.guests}명 · ₩{Number(b.total_price).toLocaleString()}
                      </div>
                    </div>
                    <div className={styles.statusCol}>
                      <span className={`${styles.badge} ${styles[s.cls]}`}>{s.label}</span>
                      {b.status === 'pending' && (
                        <div className={styles.actions}>
                          <button
                            className={styles.approveBtn}
                            onClick={() => handleApprove(b)}
                            disabled={acting === b.ID}
                          >
                            {acting === b.ID ? '처리 중…' : '승인'}
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleReject(b)}
                            disabled={acting === b.ID}
                          >
                            거절
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
