import { createContext, useContext, useState } from 'react';

interface SearchModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SearchModalContext = createContext<SearchModalContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function SearchModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <SearchModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  return useContext(SearchModalContext);
}
