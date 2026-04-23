'use client';

import { createContext, Dispatch, useContext, useState } from 'react';

interface AsideContextType {
  isAsideOpen: boolean;
  toggleAside: () => void;
  setIsAsideOpen: Dispatch<boolean>;
}

const AsideContext = createContext<AsideContextType | undefined>(undefined);

export function useAsideContext() {
  const context = useContext(AsideContext);

  if (context === undefined) {
    throw new Error('useAsideContext must be used within a RootProvider');
  }

  return context;
}

export const AsideContextProvider = ({ isOpen, children }: { isOpen?: boolean; children: React.ReactNode }) => {
  const [isAsideOpen, setIsAsideOpen] = useState(isOpen ?? true);

  const toggleAside = () => {
    setIsAsideOpen((prev) => !prev);
  };

  return <AsideContext.Provider value={{ isAsideOpen, toggleAside, setIsAsideOpen }}>{children}</AsideContext.Provider>;
};
