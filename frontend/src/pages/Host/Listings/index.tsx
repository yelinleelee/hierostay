import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HostSidebar } from '../Dashboard/HostSidebar';
import styles from '../Dashboard/Dashboard.module.css';
import { deleteProperty, listMyProperties } from '../../../lib/properties';
import { ApiError } from '../../../lib/api';
import type { Property } from '../../../types/property';

export function HostListingsPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyProperties()
      .then(p => { setProperties(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(p: Property) {
    if (!window.confirm(`"${p.title}"을(를) 삭제할까요?`)) return;
    try {
      await deleteProperty(p.ID);
      setProperties(prev => prev.filter(x => x.ID !== p.ID));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : '삭제 실패');
    }
  }

  return (
    <div className={styles.layout}>
      <HostSidebar />
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>리스팅 {!loading && <span style={{ fontSize: 16, fontWeight: 400, color: '#717171' }}>{properties.length}개</span>}</h1>
          <button className={styles.registerBtn} onClick={() => navigate('/host/register/select')}>+ 새 숙소 등록</button>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#999' }}>불러오는 중…</div>
        ) : properties.length === 0 ? (
          <div className={styles.emptyState}>
            <p>등록된 숙소가 없습니다.</p>
            <button className={styles.emptyBtn} onClick={() => navigate('/host/register/select')}>첫 숙소 등록하기</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ebebeb' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#717171' }}>숙소</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#717171' }}>유형</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#717171' }}>위치</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#717171' }}>가격</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#717171' }}>상태</th>
                <th style={{ padding: '12px 16px' }} />
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.ID} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 64, height: 48, borderRadius: 8, overflow: 'hidden', background: '#eee', flexShrink: 0 }}>
                        {p.images?.[0] ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#222', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: '#717171', marginTop: 2 }}>{p.property_type}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: '#555' }}>{p.room_type || '-'}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: '#555' }}>{p.city}</td>
                  <td style={{ padding: '16px', fontSize: 13, fontWeight: 600 }}>₩{Number(p.price).toLocaleString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: p.is_available ? '#e8f5e9' : '#fafafa', color: p.is_available ? '#2e7d32' : '#999' }}>
                      {p.is_available ? '게시 중' : '비공개'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => navigate(`/stays/${p.ID}`)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', marginRight: 6 }}>보기</button>
                    <button onClick={() => handleDelete(p)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#d93025' }}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
