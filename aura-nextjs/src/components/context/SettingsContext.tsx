'use client';

import { AppSetting } from '@/interfaces/dto';
import { getSettings } from '@/utils/services/app-settings';
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from 'react';

type SettingsContextType = {
  settings: AppSetting;
  setSettings: Dispatch<React.SetStateAction<AppSetting>>;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

function SettingsContextProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSetting>({
    delivery_fees: 0,
    exchange_fees: 1,
    whatsapp_message: '',
    whatsapp_phone: '',
    social_links: {
      instagram: 'https://www.instagram.com/auraglowups/',
      facebook: 'https://www.facebook.com/AuraGlowUps',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await getSettings();
      if (error || !data) {
        // Handle error case
        // console.error(error);
        return;
      }
      // console.log('Fetched settings:', data);
      delete data.id;
      delete data.documentId;
      delete data.createdAt;
      delete data.updatedAt;
      setSettings(data);
    };
    fetchSettings();
  }, []);
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context as SettingsContextType;
};

export default SettingsContextProvider;
