import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '../common/Calendar';
import { useAuth } from '../../auth/AuthContext';
import { createBooking, getBookedDates } from '../../lib/bookings';
import { ApiError } from '../../lib/api';
import { expandOccupied, diffNights } from '../../lib/dates';
import type { Property } from '../../types/property';
import styles from './BookingWidget.module.css';

interface Props {
  property: Property;
}

export function BookingWidget({ property }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getBookedDates(property.ID)
      .then((ranges) => {
        if (cancelled) return;
        const days = new Set<string>();
        for (const r of ranges) {
          for (const d of expandOccupied(r.check_in, r.check_out)) days.add(d);
        }
        setBookedDates(days);
      })
      .catch(() => { /* widget still usable */ });
    return () => { cancelled = true; };
  }, [property.ID]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return diffNights(new Date(checkIn), new Date(checkOut));
  }, [checkIn, checkOut]);

  const total = nights * property.price;
  const isOwnProperty = user?.id === property.host_id;
  const maxGuests = property.max_guests || 1;

  async function handleReserve() {
    setError(null);
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/stays/${property.ID}` } } });
      return;
    }
    if (!checkIn || !checkOut) {
      setError('체크인/체크아웃 날짜를 선택해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const booking = await createBooking({
        property_id: property.ID,
        check_in: checkIn,
        check_out: checkOut,
        guests,
      });
      navigate('/bookings/my', { state: { highlight: booking.ID } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '예약에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.box}>
      <div className={styles.priceRow}>
        <span className={styles.price}>₩{property.price.toLocaleString()}</span>
        <span className={styles.per}>/ 박</span>
      </div>

      <div className={styles.calendarWrap}>
        <Calendar
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); setError(null); }}
          bookedDates={bookedDates}
        />
      </div>

      <div className={styles.dateSummary}>
        <div className={styles.dateCol}>
          <span className={styles.dateLabel}>체크인</span>
          <span className={styles.dateVal}>{checkIn ?? '날짜 선택'}</span>
        </div>
        <div className={styles.dateCol}>
          <span className={styles.dateLabel}>체크아웃</span>
          <span className={styles.dateVal}>{checkOut ?? '날짜 선택'}</span>
        </div>
      </div>

      <div className={styles.guestRow}>
        <span className={styles.guestLabel}>인원</span>
        <div className={styles.counter}>
          <button
            type="button"
            className={styles.counterBtn}
            disabled={guests <= 1}
            onClick={() => setGuests(g => Math.max(1, g - 1))}
            aria-label="인원 감소"
          >−</button>
          <span className={styles.counterNum}>{guests}</span>
          <button
            type="button"
            className={styles.counterBtn}
            disabled={guests >= maxGuests}
            onClick={() => setGuests(g => Math.min(maxGuests, g + 1))}
            aria-label="인원 증가"
          >+</button>
        </div>
      </div>

      {nights > 0 && (
        <div className={styles.totalRow}>
          <span>₩{property.price.toLocaleString()} × {nights}박</span>
          <strong>₩{total.toLocaleString()}</strong>
        </div>
      )}

      {error && <div className={styles.errorBox}>{error}</div>}

      <button
        type="button"
        className={styles.reserveBtn}
        onClick={handleReserve}
        disabled={submitting || isOwnProperty}
      >
        {isOwnProperty
          ? '본인 숙소는 예약 불가'
          : submitting ? '예약 요청 중…' : user ? '예약하기' : '로그인하고 예약하기'}
      </button>

      <p className={styles.note}>예약 즉시 결제되지 않으며, 호스트 승인 후 확정됩니다.</p>
    </div>
  );
}
