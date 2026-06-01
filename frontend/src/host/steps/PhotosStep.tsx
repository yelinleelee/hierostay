import { useEffect, useMemo, useRef } from 'react';
import styles from '../Register.module.css';
import { useRegister } from '../RegisterContext';

export function PhotosStep() {
  const { data, addPhotos, removePhoto } = useRegister();
  const inputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(
    () => data.photos.map(file => URL.createObjectURL(file)),
    [data.photos]
  );
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (arr.length) addPhotos(arr);
  }

  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>숙소 사진을 추가해주세요</h1>
      <p className={styles.stepDesc}>최소 1장 이상의 사진을 업로드해주세요. 첫 번째 사진이 대표 사진으로 사용됩니다.</p>

      <div
        className={styles.photoDrop}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <div className={styles.photoDropIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div className={styles.photoDropTitle}>사진을 여기에 드래그하거나 클릭하여 업로드</div>
        <div className={styles.photoDropDesc}>JPG, PNG, WEBP (최대 10MB)</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
          {previews.map((src, i) => (
            <div key={src} style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 10, overflow: 'hidden', background: '#eee' }}>
              <img src={src} alt={`업로드 ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === 0 && (
                <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--dark)', color: 'white', fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 6 }}>대표</span>
              )}
              <button
                onClick={() => removePhoto(i)}
                style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: 'white', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                aria-label="삭제"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
