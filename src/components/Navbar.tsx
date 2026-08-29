import React, { useState } from 'react';
import { Leaf, PawPrint, Sparkles, Globe, MapPin, Bell, User, Crown, History, Heart, Calendar } from 'lucide-react';
import { LanguageCode, CountryInfo, UserProfile, CareReminder } from '../types';
import { COUNTRIES } from '../data/countries';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentCountry: CountryInfo;
  onCountryChange: (country: CountryInfo) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenPremium: () => void;
  onOpenHistory: () => void;
  onOpenSaved: () => void;
  onOpenReminders: () => void;
  reminders: CareReminder[];
  activeTab: 'home' | 'history' | 'saved' | 'reminders';
  onNavigateHome: () => void;
}

const LANGUAGES: Array<{ code: LanguageCode; name: string; nativeName: string; flag: string; dir: 'ltr' | 'rtl' }> = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (RTL)', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  currentCountry,
  onCountryChange,
  userProfile,
  onOpenProfile,
  onOpenPremium,
  onOpenHistory,
  onOpenSaved,
  onOpenReminders,
  reminders,
  activeTab,
  onNavigateHome,
}) => {
  const t = translations[currentLanguage];
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const dueRemindersCount = reminders.filter((r) => !r.isCompleted && r.nextDue <= Date.now() + 86400000 * 2).length;

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      (c.nativeName && c.nativeName.toLowerCase().includes(countrySearch.toLowerCase()))
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          id="nav-brand-btn"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 p-[1.5px] shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <Leaf className="w-5 h-5 text-emerald-600 absolute transform -rotate-12 translate-x-[-3px] translate-y-[-1px]" />
              <PawPrint className="w-3.5 h-3.5 text-amber-500 absolute transform rotate-12 translate-x-[4px] translate-y-[3px]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                BioScan AI
              </span>
              {userProfile.isPremium ? (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded uppercase tracking-wider shadow-xs">
                  PRO
                </span>
              ) : (
                <span className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  v2.5 AI
                </span>
              )}
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 truncate max-w-[210px] font-medium">
              Flora & Fauna Intelligence
            </p>
          </div>
        </button>

        {/* Center Quick Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80">
          <button
            id="nav-tab-home"
            onClick={onNavigateHome}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'home'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.scanNow}</span>
          </button>
          <button
            id="nav-tab-saved"
            onClick={onOpenSaved}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'saved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{t.savedItems}</span>
          </button>
          <button
            id="nav-tab-history"
            onClick={onOpenHistory}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.recentScans}</span>
          </button>
          <button
            id="nav-tab-reminders"
            onClick={onOpenReminders}
            className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'reminders'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.careReminders}</span>
            {dueRemindersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Right Action Controls: Language, Country, Reminders, Pro & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="lang-selector-btn"
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowCountryMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              title={t.selectLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{LANGUAGES.find((l) => l.code === currentLanguage)?.flag}</span>
              <span className="uppercase text-[11px] font-bold tracking-wider">{currentLanguage}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  {t.selectLanguage} (12 Languages)
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-opt-${lang.code}`}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {currentLanguage === lang.code && <span className="text-emerald-600 font-bold text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country Selector Dropdown */}
          <div className="relative">
            <button
              id="country-selector-btn"
              onClick={() => {
                setShowCountryMenu(!showCountryMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              title={t.selectCountry}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentCountry.flag}</span>
              <span className="hidden md:inline text-slate-700 max-w-[90px] truncate">{currentCountry.name}</span>
            </button>

            {showCountryMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {t.selectCountry}
                </div>
                <input
                  id="country-search-input"
                  type="text"
                  placeholder="Filter country..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 mb-2 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      id={`country-opt-${c.code}`}
                      onClick={() => {
                        onCountryChange(c);
                        setShowCountryMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currentCountry.code === c.code
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-base">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{c.climateZone.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Care Reminders Alert Bell */}
          <button
            id="nav-reminders-bell-btn"
            onClick={onOpenReminders}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-colors"
            title={t.careReminders}
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {dueRemindersCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm animate-bounce">
                {dueRemindersCount}
              </span>
            )}
          </button>

          {/* Premium Upgrade Button */}
          <button
            id="nav-upgrade-pro-btn"
            onClick={onOpenPremium}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02]"
          >
            <Crown className="w-3.5 h-3.5 text-amber-200" />
            <span>{userProfile.isPremium ? 'PRO Active' : t.proUpgrade}</span>
          </button>

          {/* User Profile Avatar */}
          <button
            id="nav-user-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-colors"
            title="User Profile"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
