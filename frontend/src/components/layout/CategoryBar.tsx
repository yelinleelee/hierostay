import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../context/SearchModalContext';
import styles from './CategoryBar.module.css';

const CATEGORIES = [
  { label: 'FIND STAY', path: null },
  { label: 'BRAND STORY', path: '/brand-story' },
  { label: 'JOURNAL', path: null },
  { label: 'CONTACT', path: null },
];

export function CategoryBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useSearchModal();

  function handleClick(cat: typeof CATEGORIES[number]) {
    if (cat.label === 'FIND STAY') {
      open();
    } else if (cat.path) {
      navigate(cat.path);
    }
  }

  function isActive(cat: typeof CATEGORIES[number]) {
    if (cat.label === 'FIND STAY') return location.pathname === '/' || location.pathname.startsWith('/stays');
    if (cat.path) return location.pathname === cat.path;
    return false;
  }

  return (
    <div className={styles.categoryBar}>
      {CATEGORIES.map(cat => (
        <div
          key={cat.label}
          className={`${styles.catItem} ${isActive(cat) ? styles.active : ''}`}
          onClick={() => handleClick(cat)}
        >
          {cat.label}
        </div>
      ))}
    </div>
  );
}
