import React, { useEffect, useState } from 'react';
import { Sparkles, Dna, Activity, Scan, ShieldCheck } from 'lucide-react';
import { ScanType, LanguageCode } from '../types';

interface ScanningOverlayProps {
  imagePreview: string;
  scanMode: ScanType;
  language: LanguageCode;
}

const SCAN_STEPS_EN = [
  'Isolating specimen contour & texture...',
  'Extracting morphological taxonomy markers...',
  'Cross-referencing global biological database...',
  'Evaluating disease pathogens & health symptoms...',
  'Synthesizing 25+ section botanical/zoological dossier...',
];

const SCAN_STEPS_AR = [
  'عزل تفاصيل العينة والملمس بدقة فائقة...',
  'استخراج السمات المورفولوجية والتصنيفية...',
  'مطابقة البيانات مع القاعدة البيولوجية العالمية...',
  'تحليل المسببات المرضية والأعراض الصحية...',
  'إعداد التقرير البيولوجي الشامل (أكثر من 25 قسماً)...',
];

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({
  imagePreview,
  scanMode,
  language,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = language === 'ar' ? SCAN_STEPS_AR : SCAN_STEPS_EN;

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center flex flex-col items-center">
        {/* Soft background accents */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Scanned Image Container with Laser Sweep */}
        <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 mb-6 group">
          <img
            src={imagePreview}
            alt="Analyzing Specimen"
            className="w-full h-full object-cover filter contrast-105"
          />

          {/* Animated Laser Beam */}
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_#10b981] animate-scan-beam" />

          {/* Holographic Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

          {/* Target Reticles */}
          <div className="absolute top-2 start-2 w-4 h-4 border-t-2 border-s-2 border-emerald-500" />
          <div className="absolute top-2 end-2 w-4 h-4 border-t-2 border-e-2 border-emerald-500" />
          <div className="absolute bottom-2 start-2 w-4 h-4 border-b-2 border-s-2 border-emerald-500" />
          <div className="absolute bottom-2 end-2 w-4 h-4 border-b-2 border-e-2 border-emerald-500" />
        </div>

        {/* Live Analysis Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{language === 'ar' ? 'المحرك العصبي للتعرف نشط' : 'BioScan Neural Engine Active'}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>
            {language === 'ar'
              ? `جارٍ التعرف على ${scanMode === 'plant' ? 'النبات' : scanMode === 'animal' ? 'الحيوان' : 'الكائن الحي'}...`
              : `Identifying ${scanMode === 'plant' ? 'Plant' : scanMode === 'animal' ? 'Animal' : 'Organism'}...`}
          </span>
        </h3>

        <p className="text-xs text-emerald-800 font-medium font-mono h-6 transition-all duration-300 mb-5">
          {steps[stepIndex]}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div
            className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(95, ((stepIndex + 1) / steps.length) * 100)}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <Dna className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'ar' ? 'تطابق تصنيفي' : 'Taxonomy Match'}
          </span>
          <span className="flex items-center gap-1">
            <Scan className="w-3.5 h-3.5 text-teal-600" />
            {language === 'ar' ? 'فحص صحي' : 'Pathology Check'}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            {language === 'ar' ? 'أمان السمية' : 'Toxicity Safety'}
          </span>
        </div>
      </div>
    </div>
  );
};
