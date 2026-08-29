import React from 'react';
import { Crown } from 'lucide-react';
import { LanguageCode } from '../types';

interface BannerAdProps {
  onUpgradePro: () => void;
  isPro: boolean;
  language?: LanguageCode;
}

export const BannerAd: React.FC<BannerAdProps> = ({ onUpgradePro, isPro, language = 'en' }) => {
  if (isPro) return null;
  const isAr = language === 'ar';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 my-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-emerald-50/80 border border-emerald-200/80 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                {isAr ? 'مزايا النسخة الاحترافية' : 'PRO Features'}
              </span>
              <span className="text-xs font-bold text-slate-900">
                {isAr ? 'هل تستمتع باستخدام BioScan AI؟' : 'Enjoying BioScan AI?'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 font-normal">
              {isAr
                ? 'قم بالترقية إلى BioScan PRO لإزالة الإعلانات، وفتح عمليات مسح غير محدودة وتشخيصات بيولوجية متقدمة.'
                : 'Upgrade to BioScan PRO to remove all ads, unlock unlimited daily scans & expert AI pathology.'}
            </p>
          </div>
        </div>

        <button
          id="banner-ad-upgrade-btn"
          onClick={onUpgradePro}
          className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
        >
          {isAr ? 'إزالة الإعلانات (2.49$/شهر)' : 'Remove Ads ($2.49/mo)'}
        </button>
      </div>
    </div>
  );
};
