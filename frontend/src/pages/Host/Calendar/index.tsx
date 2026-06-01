import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HostSidebar } from '../Dashboard/HostSidebar';
import styles from '../Dashboard/Dashboard.module.css';
import { listMyProperties } from '../../../lib/properties';
import { listHostBookings } from '../../../lib/bookings';
import type { Property } from '../../../types/property';
import type { Booking } from '../../../types/booking';

const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const DAY_NAMES = ['일','월','화','수','목','금','토'];

// 숙소별 구분 색상 — 메인페이지 형광 라임(#aaff6e)과 통일한 네온 팔레트 (글자는 어두운색)
const PALETTE = ['#aaff6e', '#5ce1ff', '#ffe14d', '#ff8fd0', '#b388ff', '#5cffb0', '#ff9f5c', '#7af0ff'];

export function HostCalendarPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedProp, setSelectedProp] = useState<number | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    Promise.all([listMyProperties(), listHostBookings()])
      .then(([props, bks]) => {
        setProperties(props);
        setBookings(bks);
      })
      .catch(() => {});
  }, []);

  const filteredBookings = bookings.filter(b =>
    (selectedProp === null || b.property_id === selectedProp) && b.status !== 'cancelled'
  );

  // 숙소 ID -> 색상 (등록 순서 기준으로 고정 배정)
  function colorForProp(propId: number) {
    const idx = properties.findIndex(p => p.ID === propId);
    return PALETTE[(idx < 0 ? 0 : idx) % PALETTE.length];
  }
  function propTitle(propId: number) {
    return properties.find(p => p.ID === propId)?.title ?? '';
  }

  // 한 주(week) 안에서 각 예약이 차지하는 구간(시작~끝 열)과 겹침 방지용 lane 계산
  type Seg = { booking: Booking; startCol: number; endCol: number; lane: number };
  function segmentsForWeek(week: (number | null)[]): { segs: Seg[]; laneCount: number } {
    const raw: Seg[] = filteredBookings
      .map((b): Seg | null => {
        const ci = new Date(b.check_in); ci.setHours(0, 0, 0, 0);
        const co = new Date(b.check_out); co.setHours(0, 0, 0, 0); // 체크아웃 당일은 미포함(비박)
        let startCol = -1, endCol = -1;
        week.forEach((day, col) => {
          if (day == null) return;
          const d = new Date(year, month, day);
          if (d >= ci && d < co) {
            if (startCol === -1) startCol = col;
            endCol = col;
          }
        });
        return startCol === -1 ? null : { booking: b, startCol, endCol, lane: 0 };
      })
      .filter((s): s is Seg => s !== null)
      .sort((a, b) => a.startCol - b.startCol || a.endCol - b.endCol);

    const laneEnds: number[] = [];
    raw.forEach((s) => {
      let lane = laneEnds.findIndex((end) => end < s.startCol);
      if (lane === -1) { lane = laneEnds.length; laneEnds.push(s.endCol); }
      else laneEnds[lane] = s.endCol;
      s.lane = lane;
    });
    return { segs: raw, laneCount: laneEnds.length };
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 달력을 주(週) 단위로 분할 (앞/뒤 빈칸 포함)
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  return (
    <div className={styles.layout}>
      <HostSidebar />
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>달력</h1>
          <button className={styles.registerBtn} onClick={() => navigate('/host/register/select')}>+ 새 숙소 등록</button>
        </div>

        {/* 숙소 필터 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <div onClick={() => setSelectedProp(null)} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #ddd', cursor: 'pointer', fontSize: 13, background: selectedProp === null ? '#1a1a1a' : '#fff', color: selectedProp === null ? '#fff' : '#222' }}>
            전체
          </div>
          {properties.map(p => (
            <div key={p.ID} onClick={() => setSelectedProp(p.ID)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 20, border: '1px solid #ddd', cursor: 'pointer', fontSize: 13, background: selectedProp === p.ID ? '#1a1a1a' : '#fff', color: selectedProp === p.ID ? '#fff' : '#222', maxWidth: 220 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: colorForProp(p.ID), flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
            </div>
          ))}
        </div>

        {/* 달력 네비 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 16 }}>‹</button>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{year}년 {MONTH_NAMES[month]}</span>
          <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 16 }}>›</button>
        </div>

        {/* 달력 그리드 */}
        <div style={{ border: '1px solid #ebebeb', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#1a1a1a' }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#fff' }}>{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => {
            const { segs, laneCount } = segmentsForWeek(week);
            const HEADER_H = 34;   // 날짜 숫자 영역 높이
            const LANE_H = 24;     // 막대 한 줄 높이
            const rowHeight = Math.max(96, HEADER_H + laneCount * LANE_H + 10);
            const today = new Date();
            return (
              <div key={wi} style={{ position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {week.map((day, col) => {
                    const isToday = day != null && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                    const booked = day != null && segs.some(s => s.startCol <= col && col <= s.endCol);
                    return (
                      <div key={col} style={{ minHeight: rowHeight, padding: 8, borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', background: day == null ? '#fafafa' : booked ? '#f5f5f5' : '#fff' }}>
                        {day != null && (
                          <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: isToday ? 700 : 400, background: isToday ? '#1a1a1a' : 'transparent', color: isToday ? '#fff' : '#222' }}>{day}</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 체크인~체크아웃 연속 막대 (주 단위 구간) */}
                {segs.map(s => {
                  const span = s.endCol - s.startCol + 1;
                  const label = `${s.booking.guest?.name || '예약'}${propTitle(s.booking.property_id) ? ` · ${propTitle(s.booking.property_id)}` : ''}`;
                  return (
                    <div
                      key={`${s.booking.ID}-${s.startCol}`}
                      title={label}
                      style={{
                        position: 'absolute',
                        top: HEADER_H + s.lane * LANE_H,
                        left: `calc(${(s.startCol / 7) * 100}% + 4px)`,
                        width: `calc(${(span / 7) * 100}% - 8px)`,
                        height: LANE_H - 5,
                        background: colorForProp(s.booking.property_id),
                        color: '#1a1a1a',
                        borderRadius: 6,
                        padding: '0 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: `${LANE_H - 5}px`,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
