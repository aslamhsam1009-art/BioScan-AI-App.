import React, { useState } from 'react';
import { Crown, X, Zap, ShieldCheck } from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onTogglePremium: () => void;
  language: LanguageCode;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onTogglePremium,
  language,
}) => {
  const t = translations[language];
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly' | 'lifetime'>('annual');

  if (!isOpen) return null;

  const features = [
    {
      name: language === 'ar' ? 'فحوصات نباتية وحيوانية غير محدودة بالذكاء الاصطناعي' : 'Unlimited AI Plant & Animal Scans',
      free: language === 'ar' ? '5 يومياً' : '5 scans/day',
      pro: language === 'ar' ? 'غير محدود' : 'Unlimited',
    },
    {
      name: language === 'ar' ? 'الموسوعة الكاملة (أكثر من 50 قسماً علمياً شاملاً)' : 'Full 25-Section Plant & 26-Section Animal Dossiers',
      free: language === 'ar' ? 'أساسي' : 'Basic',
      pro: language === 'ar' ? 'شامل' : 'Full 50+ Sections',
    },
    {
      name: language === 'ar' ? 'تشخيص دقيق لأمراض الأوراق والآفات بالذكاء الاصطناعي' : 'Advanced Disease & Pest Pathology Diagnosis',
      free: language === 'ar' ? 'فحص مبدئي' : 'Basic Check',
      pro: language === 'ar' ? 'تشخيص متقدم' : 'Deep Pathology',
    },
    {
      name: language === 'ar' ? 'مساعد دردشة الذكاء الاصطناعي النباتي والبيطري على مدار الساعة' : 'Unlimited BioScan AI Chat Assistant',
      free: language === 'ar' ? '3 رسائل/يوم' : '3 msgs/day',
      pro: language === 'ar' ? 'محادثات غير محدودة' : 'Unlimited 24/7',
    },
    {
      name: language === 'ar' ? 'جدولة رعاية آلية وتنبيهات السقاية والتسميد' : 'Automated Care Schedules & Reminders',
      free: language === 'ar' ? 'تذكيران' : '2 reminders',
      pro: language === 'ar' ? 'غير محدود' : 'Unlimited',
    },
    {
      name: language === 'ar' ? 'تجربة خالية تماماً 100% من أي إعلانات' : '100% Ad-Free Experience',
      free: language === 'ar' ? 'مدعوم بالإعلانات' : 'Ad Supported',
      pro: language === 'ar' ? 'بدون إعلانات' : 'Zero Ads',
    },
    {
      name: language === 'ar' ? 'تصدير التقارير العلمية والطبية بدقة عالية للطباعة والحفظ' : 'High-Resolution Printable Dossier Export',
      free: language === 'ar' ? 'علامة مائية' : 'Watermarked',
      pro: language === 'ar' ? 'تقرير PDF معتمد' : 'Full PDF / Print',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 text-center relative border-b border-slate-100 bg-amber-50/40">
          <button
            id="premium-close-btn"
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shadow-2xs"
            title={t.close}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 shadow-md shadow-amber-400/20 mb-3">
            <Crown className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.proModalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 font-normal">
            {t.proModalSubtitle}
          </p>
        </div>

        {/* Pricing Selector Cards */}
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            {/* Monthly */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all text-left rtl:text-right relative flex flex-col justify-between ${
                selectedPlan === 'monthly'
                  ? 'bg-amber-50/80 border-2 border-amber-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-700 block">{t.monthlyPlan.split('(')[0]}</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900">$4.99</span>
                  <span className="text-[11px] text-slate-500">{language === 'ar' ? '/ شهر' : '/ mo'}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                {language === 'ar' ? 'تجديد شهري، إلغاء في أي وقت' : 'Billed monthly. Cancel anytime.'}
              </span>
            </div>

            {/* Annual (Best Value) */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-left rtl:text-right relative flex flex-col justify-between ${
                selectedPlan === 'annual'
                  ? 'bg-amber-50 border-amber-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-400'
              }`}
            >
              <div className="absolute -top-2.5 end-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-xs">
                {t.save50Percent}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">{t.yearlyPlan.split('(')[0]}</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900">$29.99</span>
                  <span className="text-[11px] text-slate-500">{language === 'ar' ? '/ سنة' : '/ yr'}</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-2 block">
                {language === 'ar' ? 'فقط $2.49 / شهر' : 'Just $2.49 / month'}
              </span>
            </div>

            {/* Lifetime */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all text-left rtl:text-right relative flex flex-col justify-between ${
                selectedPlan === 'lifetime'
                  ? 'bg-amber-50/80 border-2 border-amber-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-700 block">{t.lifetimePlan.split('(')[0]}</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900">$69.99</span>
                  <span className="text-[11px] text-slate-500">{language === 'ar' ? 'دفعة واحدة' : 'one-time'}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                {language === 'ar' ? 'وصول دائم مدى الحياة' : 'Pay once, own forever.'}
              </span>
            </div>
          </div>

          {/* Feature Matrix Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              {t.freeVsPro}
            </h4>
            <div className="space-y-2">
              {features.map((feat, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-slate-200 text-[11px]">
                  <span className="text-slate-700 font-medium">{feat.name}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400 font-medium">{feat.free}</span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      {feat.pro}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 space-y-3">
            <button
              id="premium-subscribe-btn"
              onClick={() => {
                onTogglePremium();
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-400 text-amber-950 font-extrabold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5 text-amber-950" />
              <span>
                {userProfile.isPremium
                  ? (language === 'ar' ? 'التبديل إلى الخطة المجانية' : 'Switch to Free Tier')
                  : (language === 'ar' ? `ترقية الحساب الآن (${selectedPlan === 'annual' ? '29.99$/سنة' : selectedPlan === 'monthly' ? '4.99$/شهر' : '69.99$'})` : `Upgrade to PRO (${selectedPlan === 'annual' ? '$29.99/yr' : selectedPlan === 'monthly' ? '$4.99/mo' : '$69.99'})`)}
              </span>
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {t.moneyBackGuarantee}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                {t.instantAccess}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
