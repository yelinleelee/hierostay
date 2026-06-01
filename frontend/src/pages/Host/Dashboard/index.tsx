import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { deleteProperty, listMyProperties } from '../../../lib/properties';
import { listHostBookings } from '../../../lib/bookings';
import { ApiError } from '../../../lib/api';
import type { Property } from '../../../types/property';
import type { Booking } from '../../../types/booking';
import { HostSidebar } from './HostSidebar';

export function HostDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [props, bks] = await Promise.all([listMyProperties(), listHostBookings()]);
        if (cancelled) return;
        setProperties(props);
        setBookings(bks);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : '데이터를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
    const now = new Date();
    const monthIncome = activeBookings.reduce((sum, b) => {
      const d = new Date(b.check_in);
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
        return sum + Number(b.total_price || 0);
      }
      return sum;
    }, 0);
    const ratedProps = properties.filter((p) => p.review_count > 0);
    const avgRating = ratedProps.length
      ? ratedProps.reduce((s, p) => s + p.rating, 0) / ratedProps.length
      : null;

    return [
      { label: '총 예약', value: `${activeBookings.length}건`, icon: '📅' },
      { label: '이번 달 수입', value: `₩${monthIncome.toLocaleString()}`, icon: '💰' },
      { label: '리뷰 평점', value: avgRating ? avgRating.toFixed(2) : '-', icon: '⭐' },
      { label: '등록 숙소', value: `${properties.length}개`, icon: '🏠' },
    ];
  }, [properties, bookings]);

  async function handleDelete(p: Property) {
    if (!window.confirm(`"${p.title}"을(를) 삭제할까요?`)) return;
    try {
      await deleteProperty(p.ID);
      setProperties((prev) => prev.filter((x) => x.ID !== p.ID));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : '삭제 실패');
    }
  }

  return (
    <div className={styles.layout}>
      <HostSidebar />

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>호스트 대시보드</h1>
          <button className={styles.registerBtn} onClick={() => navigate('/host/register/select')}>
            + 새 숙소 등록
          </button>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue}>{loading ? '…' : s.value}</div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>내 숙소</h2>

          {error && (
            <div style={{ padding: 14, background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: 10, color: '#c0392b', fontSize: 14, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--light)' }}>불러오는 중…</div>
          ) : properties.length === 0 ? (
            <div className={styles.emptyState}>
              <p>등록된 숙소가 없습니다.</p>
              <p>첫 번째 숙소를 등록해보세요!</p>
              <button className={styles.emptyBtn} onClick={() => navigate('/host/register/select')}>숙소 등록하기</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {properties.map((p) => {
                const cover = p.images?.[0];
                return (
                  <div
                    key={p.ID}
                    style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}
                  >
                    <div
                      style={{ aspectRatio: '4 / 3', background: '#eee', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => navigate(`/stays/${p.ID}`)}
                    >
                      {cover ? (
                        <img src={cover} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--light)', fontSize: 13 }}>이미지 없음</div>
                      )}
                    </div>
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.city} · {p.address}</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>
                        ₩{Number(p.price).toLocaleString()} <span style={{ fontWeight: 400, color: 'var(--mid)', fontSize: 13 }}>/ 박</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: 'var(--mid)', cursor: 'pointer' }}
                        >
                          삭제
                        </button>
                      </div>
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
