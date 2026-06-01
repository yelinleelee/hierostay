import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SearchModal } from '../search/SearchModal';
import { ScrollTopButton } from '../common/ScrollTopButton';
import { SearchModalProvider } from '../../context/SearchModalContext';

export function MainLayout() {
  return (
    <SearchModalProvider>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <Outlet />
      </div>
      <Footer />
      <ScrollTopButton />
      <SearchModal />
    </SearchModalProvider>
  );
}
