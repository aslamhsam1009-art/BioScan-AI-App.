import React from 'react';
import { User, Crown, X } from 'lucide-react';
import { UserProfile, LanguageCode, CountryInfo } from '../types';
import { translations } from '../i18n/translations';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  country: CountryInfo;
  language: LanguageCode;
  onUpgradePro: () => void;
  savedCount: number;
  remindersCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  country,
  language,
  onUpgradePro,
  savedCount,
  remindersCount,
}) => {
  const t = translations[language];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6">
        <button
          id="profile-close-btn"
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-2xs"
          title={t.close}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Avatar & Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-1 mb-3 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-emerald-700">
              <User className="w-10 h-10" />
            </div>
            {userProfile.isPremium && (
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-400 text-amber-950 shadow-xs border-2 border-white">
                <Crown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900">{userProfile.name}</h3>
          <p className="text-xs text-slate-500 font-medium">{userProfile.email}</p>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
            <span>{country.flag}</span>
            <span>{country.name}</span>
            <span className="text-slate-400">•</span>
            <span className="uppercase text-emerald-700 font-bold">{language}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-lg font-black text-emerald-700">{userProfile.scansCount}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mt-0.5">{t.totalScans}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-lg font-black text-amber-700">{savedCount}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mt-0.5">{t.savedOrganismsCount}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-lg font-black text-teal-700">{remindersCount}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mt-0.5">{t.activeReminders}</span>
          </div>
        </div>

        {/* Membership Status Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{t.planStatus}</span>
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              {userProfile.isPremium ? (
                <>
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700 font-extrabold">{t.proUnlimited}</span>
                </>
              ) : (
                <span>{t.freePlanAd}</span>
              )}
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onUpgradePro();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 text-xs font-bold shadow-xs hover:scale-105 transition-all"
          >
            {userProfile.isPremium ? t.manage : t.upgradePro}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
