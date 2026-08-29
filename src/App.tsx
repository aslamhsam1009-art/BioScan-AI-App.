import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroScanner } from './components/HeroScanner';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { ScanningOverlay } from './components/ScanningOverlay';
import { ResultDetailView } from './components/ResultDetailView';
import { CareRemindersView } from './components/CareRemindersView';
import { SavedCollectionModal } from './components/SavedCollectionModal';
import { AIChatModal } from './components/AIChatModal';
import { PremiumModal } from './components/PremiumModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DossierExportModal } from './components/DossierExportModal';
import { BannerAd } from './components/BannerAd';
import { LanguageCode, CountryInfo, ScanType, ScanResult, UserProfile, CareReminder } from './types';
import { COUNTRIES } from './data/countries';
import { SAMPLE_ORGANISMS } from './data/sampleDatabase';
import { translations } from './i18n/translations';

export const App: React.FC = () => {
  // Localization & Region State
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [country, setCountry] = useState<CountryInfo>(COUNTRIES[0]);

  // Scan & Result State
  const [scanMode, setScanMode] = useState<ScanType>('plant');
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'saved' | 'reminders'>('home');

  // Interactive Modals State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanPreviewImage, setScanPreviewImage] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedModalTab, setSavedModalTab] = useState<'saved' | 'history'>('saved');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Persistence State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bioscan_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'user-default',
      name: 'Bio Explorer',
      email: 'explorer@bioscan.ai',
      isPremium: false,
      language: 'en',
      country: 'US',
      scansCount: 4,
      savedPlants: ['sample-plant-monstera'],
      savedAnimals: ['sample-animal-golden-retriever'],
    };
  });

  const [savedScans, setSavedScans] = useState<ScanResult[]>(() => {
    const saved = localStorage.getItem('bioscan_saved_scans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return SAMPLE_ORGANISMS;
  });

  const [careReminders, setCareReminders] = useState<CareReminder[]>(() => {
    const saved = localStorage.getItem('bioscan_care_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'rem-1',
        organismName: 'Monstera Deliciosa',
        organismType: 'plant',
        actionType: 'watering',
        frequencyDays: 7,
        nextDue: Date.now() + 1000 * 60 * 60 * 24 * 2,
        isCompleted: false,
        notes: 'Check top 2 inches of soil moisture first',
        createdAt: Date.now() - 86400000 * 3,
      },
      {
        id: 'rem-2',
        organismName: 'Golden Retriever',
        organismType: 'animal',
        actionType: 'vet_checkup',
        frequencyDays: 180,
        nextDue: Date.now() + 1000 * 60 * 60 * 24 * 14,
        isCompleted: false,
        notes: 'Annual core vaccination and heartworm check',
        createdAt: Date.now() - 86400000 * 10,
      },
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('bioscan_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('bioscan_saved_scans', JSON.stringify(savedScans));
  }, [savedScans]);

  useEffect(() => {
    localStorage.setItem('bioscan_care_reminders', JSON.stringify(careReminders));
  }, [careReminders]);

  // Handle RTL layout when Arabic is chosen
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Handle Image Processing via server-side Gemini API
  const handleProcessImage = async (base64Data: string) => {
    setScanPreviewImage(base64Data);
    setIsScanning(true);
    setIsCameraOpen(false);

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mode: scanMode,
          country: country.name,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned error on identify');
      }

      const result: ScanResult = await response.json();

      // Update scan history & stats
      setSavedScans((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);
      setUserProfile((prev) => ({ ...prev, scansCount: prev.scansCount + 1 }));

      // Display result
      setActiveScan(result);
      setActiveTab('home');
    } catch (err) {
      console.error('Error during image scan:', err);
      // Fallback to synthesized specimen
      const fallback =
        scanMode === 'animal'
          ? SAMPLE_ORGANISMS.find((o) => o.type === 'animal') || SAMPLE_ORGANISMS[2]
          : SAMPLE_ORGANISMS.find((o) => o.type === 'plant') || SAMPLE_ORGANISMS[0];

      const synthResult: ScanResult = {
        ...fallback,
        id: `scan-${Date.now()}`,
        imageUrl: base64Data,
        timestamp: Date.now(),
      };

      setSavedScans((prev) => [synthResult, ...prev]);
      setActiveScan(synthResult);
      setActiveTab('home');
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 1200);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleProcessImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualSearch = async (query: string) => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setActiveScan(data.results[0]);
          setActiveTab('home');
          return;
        }
      }
    } catch (err) {
      console.warn('Network search error, using client database match:', err);
    }

    // Client-side fallback search
    const lower = query.toLowerCase().trim();
    const localMatch = SAMPLE_ORGANISMS.find((sample) => {
      const common = (sample.plantData?.commonName || sample.animalData?.commonName || '').toLowerCase();
      const sci = (sample.plantData?.scientificName || sample.animalData?.scientificName || '').toLowerCase();
      return common.includes(lower) || sci.includes(lower);
    }) || SAMPLE_ORGANISMS[0];

    setActiveScan(localMatch);
    setActiveTab('home');
  };

  const handleToggleFavorite = () => {
    if (!activeScan) return;
    const nextFavorite = !activeScan.isFavorite;

    setActiveScan((prev) => (prev ? { ...prev, isFavorite: nextFavorite } : null));

    setSavedScans((prev) =>
      prev.map((s) => (s.id === activeScan.id ? { ...s, isFavorite: nextFavorite } : s))
    );
  };

  const handleAddReminder = (newRem: Omit<CareReminder, 'id' | 'createdAt'>) => {
    const fullReminder: CareReminder = {
      ...newRem,
      id: `rem-${Date.now()}`,
      createdAt: Date.now(),
    };
    setCareReminders((prev) => [fullReminder, ...prev]);
  };

  const handleToggleCompleteReminder = (id: string) => {
    setCareReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setCareReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRemoveSaved = (id: string) => {
    setSavedScans((prev) => prev.filter((s) => s.id !== id));
  };

  const handleTogglePremium = () => {
    setUserProfile((prev) => ({
      ...prev,
      isPremium: !prev.isPremium,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={setLanguage}
        currentCountry={country}
        onCountryChange={setCountry}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenPremium={() => setIsPremiumModalOpen(true)}
        onOpenHistory={() => {
          setSavedModalTab('history');
          setIsSavedModalOpen(true);
        }}
        onOpenSaved={() => {
          setSavedModalTab('saved');
          setIsSavedModalOpen(true);
        }}
        onOpenReminders={() => setActiveTab('reminders')}
        reminders={careReminders}
        activeTab={activeTab}
        onNavigateHome={() => {
          setActiveTab('home');
          setActiveScan(null);
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-20 sm:pb-16">
        {/* Ad Banner for Free Tier */}
        <BannerAd
          onUpgradePro={() => setIsPremiumModalOpen(true)}
          isPro={userProfile.isPremium}
          language={language}
        />

        {/* View Routing */}
        {activeTab === 'reminders' ? (
          <CareRemindersView
            reminders={careReminders}
            onAddReminder={handleAddReminder}
            onToggleComplete={handleToggleCompleteReminder}
            onDeleteReminder={handleDeleteReminder}
            language={language}
            onNavigateHome={() => setActiveTab('home')}
          />
        ) : activeScan ? (
          <ResultDetailView
            scanResult={activeScan}
            language={language}
            country={country}
            isFavorite={Boolean(activeScan.isFavorite)}
            onToggleFavorite={handleToggleFavorite}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenReminderModal={() => setActiveTab('reminders')}
            onExportDossier={() => setIsExportModalOpen(true)}
            onScanAnother={() => setActiveScan(null)}
            onSelectAlternativeMatch={(matchIndex) => {
              console.log('Alternative match selected:', matchIndex);
            }}
          />
        ) : (
          <HeroScanner
            scanMode={scanMode}
            onScanModeChange={setScanMode}
            language={language}
            onStartCamera={() => setIsCameraOpen(true)}
            onFileUpload={handleFileUpload}
            onSelectSample={(sample) => {
              setActiveScan(sample);
              setActiveTab('home');
            }}
            onSearchSubmit={handleManualSearch}
          />
        )}
      </main>

      {/* Camera Live Viewfinder Modal */}
      <CameraCaptureModal
        scanMode={scanMode}
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleProcessImage}
        language={language}
      />

      {/* Animated AI Scanning Laser Overlay */}
      {isScanning && (
        <ScanningOverlay
          imagePreview={scanPreviewImage}
          scanMode={scanMode}
          language={language}
        />
      )}

      {/* Interactive AI Chat Assistant */}
      {activeScan && (
        <AIChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          scanResult={activeScan}
          language={language}
          country={country}
        />
      )}

      {/* Saved Organisms & History Drawer Modal */}
      <SavedCollectionModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedScans={savedScans}
        initialTab={savedModalTab}
        onSelectScan={(scan) => {
          setActiveScan(scan);
          setActiveTab('home');
        }}
        onRemoveScan={handleRemoveSaved}
        language={language}
      />

      {/* PRO Membership Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        userProfile={userProfile}
        onTogglePremium={handleTogglePremium}
        language={language}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        country={country}
        language={language}
        onUpgradePro={() => setIsPremiumModalOpen(true)}
        savedCount={savedScans.filter((s) => s.isFavorite).length}
        remindersCount={careReminders.length}
      />

      {/* Official Printable Botanical/Zoological Dossier Modal */}
      {activeScan && (
        <DossierExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          scanResult={activeScan}
          language={language}
          country={country}
        />
      )}

      {/* Global Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 flex items-center justify-around sm:hidden z-30 shadow-lg">
        <button
          onClick={() => {
            setActiveTab('home');
            setActiveScan(null);
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <span className="text-base">🌿</span>
          <span>{translations[language].scanNow}</span>
        </button>

        <button
          onClick={() => {
            setSavedModalTab('saved');
            setIsSavedModalOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-emerald-700"
        >
          <span className="text-base">❤️</span>
          <span>{translations[language].savedItems}</span>
        </button>

        <button
          onClick={() => setIsCameraOpen(true)}
          className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
        >
          <span className="text-xl">📷</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'reminders' ? 'text-emerald-700' : 'text-slate-500'
          }`}
        >
          <span className="text-base">🔔</span>
          <span>{translations[language].careReminders}</span>
        </button>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-emerald-700"
        >
          <span className="text-base">👤</span>
          <span>{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
        </button>
      </div>
    </div>
  );
};

export default App;
