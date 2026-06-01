import { useEffect, useState } from 'react';
import { HostSidebar } from '../Dashboard/HostSidebar';
import styles from '../Dashboard/Dashboard.module.css';
import { api } from '../../../lib/api';
import { listConversations, getConversation, sendMessage } from '../../../lib/messages';
import { listHostBookings } from '../../../lib/bookings';
import type { ConversationSummary, Message } from '../../../types/message';
import type { Booking } from '../../../types/booking';

const STATUS_LABEL: Record<string, string> = {
  pending: '예약 요청', confirmed: '예약 확정', completed: '이용 완료', cancelled: '취소됨',
};
const STATUS_COLOR: Record<string, string> = {
  pending: '#b8860b', confirmed: '#2e9e6b', completed: '#777', cancelled: '#c0392b',
};
function fmtRange(ci: string, co: string) {
  const f = (s: string) => { const d = new Date(s); return `${d.getMonth() + 1}월 ${d.getDate()}일`; };
  return `${f(ci)} ~ ${f(co)}`;
}

export function HostMessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [myId, setMyId] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  function loadConversations() {
    listConversations().then(setConversations).catch(() => {});
  }

  // 대화 상대(게스트)와 매칭되는 가장 최근 예약
  function bookingForPeer(peerId: number) {
    return bookings.find(b => b.guest_id === peerId);
  }

  useEffect(() => {
    api<{ id: number }>('/auth/me').then(u => setMyId(u.id)).catch(() => {});
    loadConversations();
    listHostBookings().then(setBookings).catch(() => {});
  }, []);

  function selectConv(peerId: number) {
    setSelectedPeer(peerId);
    getConversation(peerId).then(setMessages).catch(() => {});
  }

  async function sendMsg() {
    if (selectedPeer == null || !newMsg.trim()) return;
    await sendMessage({ receiver_id: selectedPeer, content: newMsg.trim() });
    setNewMsg('');
    setMessages(await getConversation(selectedPeer));
    loadConversations();
  }

  const selected = conversations.find(c => c.peer.id === selectedPeer) ?? null;

  return (
    <div className={styles.layout}>
      <HostSidebar />
      <main className={styles.main} style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #ebebeb' }}>
          <h1 className={styles.mainTitle}>메시지</h1>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* 대화 목록 */}
          <div style={{ width: 320, borderRight: '1px solid #ebebeb', overflowY: 'auto', flexShrink: 0 }}>
            {conversations.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#999', fontSize: 14 }}>메시지가 없습니다</div>
            ) : conversations.map(c => (
              <div key={c.peer.id} onClick={() => selectConv(c.peer.id)} style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: selectedPeer === c.peer.id ? '#f8f8f8' : '#fff', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e0e0', flexShrink: 0, overflow: 'hidden' }}>
                  {c.peer.avatar && <img src={c.peer.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{c.peer.name || '게스트'}</span>
                    {c.unread_count > 0 && <span style={{ background: '#1a1a1a', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread_count}</span>}
                  </div>
                  {(() => {
                    const bk = bookingForPeer(c.peer.id);
                    return bk ? (
                      <div style={{ fontSize: 12, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#555' }}>
                        <span style={{ color: STATUS_COLOR[bk.status], fontWeight: 600 }}>{STATUS_LABEL[bk.status] ?? bk.status}</span>
                        {` · ${fmtRange(bk.check_in, bk.check_out)}`}{bk.property?.title ? ` · ${bk.property.title}` : ''}
                      </div>
                    ) : null;
                  })()}
                  <div style={{ fontSize: 13, color: '#717171', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last_message}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 메시지 창 */}
          {selected ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #ebebeb', fontWeight: 600, fontSize: 15 }}>{selected.peer.name || '게스트'}</div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map(m => {
                  const isMine = m.sender_id === myId;
                  return (
                    <div key={m.ID} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '65%', padding: '10px 14px', borderRadius: 16, background: isMine ? '#1a1a1a' : '#f0f0f0', color: isMine ? '#fff' : '#222', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid #ebebeb', display: 'flex', gap: 12 }}>
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="메시지를 입력하세요..." style={{ flex: 1, padding: '10px 16px', border: '1px solid #ddd', borderRadius: 24, fontSize: 14, outline: 'none' }} />
                <button onClick={sendMsg} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>전송</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 14 }}>대화를 선택하세요</div>
          )}
        </div>
      </main>
    </div>
  );
}
