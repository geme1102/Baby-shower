
import React, { useState, useEffect } from 'react';
import { ViewMode, Gift, AppSettings } from './types';
import Header from './components/Header';
import GuestView from './components/GuestView';
import AdminView from './components/AdminView';

const STORAGE_KEY = 'baby_shower_registry_data';
const ADMIN_PIN = '1234';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GUEST);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    babyName: "¡Nuestra Bendición!",
    hostPhone: ""
  });
  const [loading, setLoading] = useState(true);

  // Carga inicial (priorizando URL si viene con datos, luego LocalStorage)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('d');
    
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam));
        setGifts(decoded.gifts || []);
        setSettings(decoded.settings || { babyName: "¡Nuestra Bendición!", hostPhone: "" });
        setLoading(false);
        return;
      } catch (e) {
        console.error("Error decoding URL data", e);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGifts(parsed.gifts || []);
        setSettings(parsed.settings || { babyName: "¡Nuestra Bendición!", hostPhone: "" });
      } catch (e) {
        console.error("Error loading registry", e);
      }
    }
    setLoading(false);
  }, []);

  // Guardar en LocalStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ gifts, settings }));
    }
  }, [gifts, settings, loading]);

  const handleUpdateGifts = (newList: Gift[]) => setGifts(newList);
  
  const handleClaimGift = (giftId: string, guestName: string) => {
    setGifts(prev => prev.map(g => 
      g.id === giftId ? { ...g, isClaimed: true, claimedBy: guestName } : g
    ));
  };

  const handleReleaseGift = (giftId: string) => {
    setGifts(prev => prev.map(g => 
      g.id === giftId ? { ...g, isClaimed: false, claimedBy: undefined } : g
    ));
  };

  const toggleMode = () => {
    if (viewMode === ViewMode.GUEST) {
      if (isAdminAuthenticated) {
        setViewMode(ViewMode.ADMIN);
      } else {
        const pin = prompt("Introduce el PIN de Organizador:");
        if (pin === ADMIN_PIN) {
          setIsAdminAuthenticated(true);
          setViewMode(ViewMode.ADMIN);
        } else if (pin !== null) {
          alert("PIN incorrecto.");
        }
      }
    } else {
      setViewMode(ViewMode.GUEST);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="animate-pulse text-pink-400 font-bold text-2xl">BabyRegalo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcfb] pb-12">
      <Header 
        babyName={settings.babyName} 
        viewMode={viewMode} 
        onToggleMode={toggleMode} 
      />
      
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {viewMode === ViewMode.ADMIN ? (
          <AdminView 
            gifts={gifts} 
            onUpdateGifts={handleUpdateGifts} 
            settings={settings}
            onUpdateSettings={setSettings}
          />
        ) : (
          <GuestView 
            gifts={gifts} 
            hostPhone={settings.hostPhone}
            onClaimGift={handleClaimGift} 
            onReleaseGift={handleReleaseGift}
          />
        )}
      </main>

      <footer className="mt-20 text-center text-gray-400 text-xs">
        <p>© 2024 BabyRegalo - Los datos se guardan en este dispositivo.</p>
      </footer>
    </div>
  );
};

export default App;
