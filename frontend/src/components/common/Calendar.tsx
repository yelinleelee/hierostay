import { useMemo, useState } from 'react';
import styles from './Calendar.module.css';

interface Props {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (checkIn: string | null, checkOut: string | null) => void;
  bookedDates: Set<string>;
}

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function rangeBlocked(start: string, endExclusive: string, blocked: Set<string>): boolean {
  const s = new Date(start);
  const e = new Date(endExclusive);
  for (const d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
    if (blocked.has(fmt(d))) return true;
  }
  return false;
}

export function Calendar({ checkIn, checkOut, onChange, bookedDates }: Props) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const todayStr = fmt(today);

  const [view, setView] = useState(() => {
    const base = checkIn ? new Date(checkIn) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const cells = useMemo(() => {
    const firstDow = view.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const arr: Array<{ date: string; day: number } | null> = [];
    for (let i = 0; i < firstDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(view.getFullYear(), view.getMonth(), d);
      arr.push({ date: fmt(dt), day: d });
    }
    return arr;
  }, [view]);

  function shift(months: number) {
    setView(v => new Date(v.getFullYear(), v.getMonth() + months, 1));
  }

  function handleClick(date: string) {
    if (date < todayStr) return;
    if (bookedDates.has(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      onChange(date, null);
      return;
    }
    if (date === checkIn) {
      onChange(null, null);
      return;
    }
    if (date < checkIn) {
      onChange(date, null);
      return;
    }
    if (rangeBlocked(checkIn, date, bookedDates)) {
      onChange(date, null);
      return;
    }
    onChange(checkIn, date);
  }

  const monthLabel = `${view.getFullYear()}년 ${view.getMonth() + 1}월`;
  const canPrev = view.getFullYear() > today.getFullYear()
    || (view.getFullYear() === today.getFullYear() && view.getMonth() > today.getMonth());

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label="이전 달"
        >‹</button>
        <span className={styles.monthLabel}>{monthLabel}</span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => shift(1)}
          aria-label="다음 달"
        >›</button>
      </div>

      <div className={styles.dowRow}>
        {DOW.map(d => <span key={d} className={styles.dow}>{d}</span>)}
      </div>

      <div className={styles.grid}>
        {cells.map((c, i) => {
          if (!c) return <span key={i} className={styles.empty} />;
          const isPast = c.date < todayStr;
          const isBooked = bookedDates.has(c.date);
          const disabled = isPast || isBooked;
          const isCheckIn = checkIn === c.date;
          const isCheckOut = checkOut === c.date;
          const inRange = checkIn && checkOut && c.date > checkIn && c.date < checkOut;
          const cls = [
            styles.cell,
            disabled ? styles.disabled : '',
            isBooked ? styles.booked : '',
            isCheckIn || isCheckOut ? styles.selected : '',
            inRange ? styles.inRange : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={c.date}
              type="button"
              className={cls}
              disabled={disabled}
              onClick={() => handleClick(c.date)}
            >
              {c.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
