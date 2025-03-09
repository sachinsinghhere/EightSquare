import React, { createContext, useContext, useState, useEffect } from 'react';
import { setSoundEnabled } from '../../utils/sounds';

interface SoundContextType {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(isSoundEnabled);
  }, [isSoundEnabled]);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, setIsSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundSettings = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundSettings must be used within a SoundProvider');
  }
  return context;
}; 