import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Search, Leaf, PawPrint, ShieldAlert, ArrowRight } from 'lucide-react';
import { ScanType, LanguageCode, ScanResult } from '../types';
import { translations } from '../i18n/translations';
import { SAMPLE_ORGANISMS } from '../data/sampleDatabase';

interface HeroScannerProps {
  scanMode: ScanType;
  onScanModeChange: (mode: ScanType) => void;
  language: LanguageCode;
  onStartCamera: () => void;
  onFileUpload: (file: File) => void;
  onSelectSample: (sample: ScanResult) => void;
  onSearchSubmit: (query: string) => void;
}

export const HeroScanner: React.FC<HeroScannerProps> = ({
  scanMode,
  onScanModeChange,
  language,
  onStartCamera,
  onFileUpload,
  onSelectSample,
  onSearchSubmit,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragOver(true);
    } else if (e.type === 'dragleave') {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mode Selector Switcher */}
      <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6">
        <button
          id="mode-btn-plant"
          onClick={() => onScanModeChange('plant')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            scanMode === 'plant'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>{t.plantScan}</span>
        </button>

        <button
          id="mode-btn-animal"
          onClick={() => onScanModeChange('animal')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            scanMode === 'animal'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <PawPrint className="w-4 h-4" />
          <span>{t.animalScan}</span>
        </button>

        <button
          id="mode-btn-auto"
          onClick={() => onScanModeChange('auto')}
          className={`hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            scanMode === 'auto'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t.autoDetect}</span>
        </button>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
        {scanMode === 'plant' ? (
          <>
            {language === 'ar' ? (
              <>
                تعرّف على أي <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">نبات واكتشف أمراض الأوراق</span>
              </>
            ) : (
              <>
                Identify Any <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Plant & Leaf Disease</span>
              </>
            )}
          </>
        ) : scanMode === 'animal' ? (
          <>
            {language === 'ar' ? (
              <>
                تعرّف على أي <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">حيوان أو سلالة أليفة</span>
              </>
            ) : (
              <>
                Identify Any <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Animal, Pet & Breed</span>
              </>
            )}
          </>
        ) : (
          <>
            {language === 'ar' ? (
              <>
                تعرّف على <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">النباتات والحيوانات</span> فوراً
              </>
            ) : (
              <>
                Identify <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Plants & Animals</span> Instantly
              </>
            )}
          </>
        )}
      </h1>

      <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
        {t.tagline}
      </p>

      {/* Primary Scanner Viewfinder Hero Action */}
      <div className="relative max-w-xl mx-auto mb-10">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/70 shadow-lg scale-[1.02]'
              : 'border-slate-200 bg-white hover:border-emerald-400 shadow-md hover:shadow-lg'
          }`}
        >
          {/* Decorative Corner Brackets */}
          <div className="absolute top-4 start-4 w-6 h-6 border-t-2 border-s-2 border-emerald-500 rounded-ts-lg" />
          <div className="absolute top-4 end-4 w-6 h-6 border-t-2 border-e-2 border-emerald-500 rounded-te-lg" />
          <div className="absolute bottom-4 start-4 w-6 h-6 border-b-2 border-s-2 border-emerald-500 rounded-bs-lg" />
          <div className="absolute bottom-4 end-4 w-6 h-6 border-b-2 border-e-2 border-emerald-500 rounded-be-lg" />

          {/* Central Pulsing Scan Button */}
          <div className="flex flex-col items-center justify-center my-3">
            <button
              id="hero-camera-scan-btn"
              onClick={onStartCamera}
              className="group relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-300 mb-4"
              title={t.takePhoto}
            >
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-25 group-hover:animate-ping" />
              <div className="relative flex flex-col items-center justify-center">
                <Camera className="w-9 h-9 sm:w-11 sm:h-11 transform group-hover:rotate-6 transition-transform" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1">
                  {t.scanNow}
                </span>
              </div>
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-1">
              {scanMode === 'plant'
                ? (language === 'ar' ? 'وجّه الكاميرا نحو الورقة أو النبتة' : 'Point Camera at Leaf or Plant')
                : scanMode === 'animal'
                  ? (language === 'ar' ? 'وجّه الكاميرا نحو الحيوان أو الطائر' : 'Point Camera at Animal or Pet')
                  : (language === 'ar' ? 'التقط أو ارفع صورة للتعرف الفوري' : 'Take or Upload Photo')}
            </h3>
            <p className="text-xs text-slate-500 mb-5 max-w-sm">
              {t.dropImageHere}
            </p>

            {/* Upload from device button */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload-input"
              />
              <button
                id="hero-upload-device-btn"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{t.chooseFromDevice}</span>
              </button>

              <button
                id="hero-open-camera-btn"
                onClick={onStartCamera}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>{t.takePhoto}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Search Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="hero-manual-search-input"
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKey}
            className="w-full ps-11 pe-24 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          />
          <button
            id="hero-search-submit-btn"
            onClick={() => onSearchSubmit(searchQuery)}
            className="absolute end-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>{t.search}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Sample Presets Quick Demo Carousel */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.quickTrySamples}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {language === 'ar' ? 'انقر على أي عينة للتجربة الفورية بالذكاء الاصطناعي' : 'Click any card to run instant AI test'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {SAMPLE_ORGANISMS.map((sample) => {
            const isPlant = sample.type === 'plant';
            const commonName = sample.plantData?.commonName || sample.animalData?.commonName || '';
            const sciName = sample.plantData?.scientificName || sample.animalData?.scientificName || '';
            const isSick = isPlant
              ? !sample.plantData?.diseaseDiagnosis?.isHealthy
              : !sample.animalData?.diseaseDiagnosis?.isHealthy;

            return (
              <button
                key={sample.id}
                id={`sample-card-${sample.id}`}
                onClick={() => onSelectSample(sample)}
                className="group relative text-left rtl:text-right bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-400 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-xs hover:shadow-md flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={sample.imageUrl}
                    alt={commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 start-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800 shadow-xs">
                    {isPlant ? <Leaf className="w-3 h-3 text-emerald-600" /> : <PawPrint className="w-3 h-3 text-amber-600" />}
                    <span className="capitalize">{isPlant ? t.plants : t.animals}</span>
                  </div>
                  {isSick && (
                    <div className="absolute bottom-2 start-2 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-300 text-rose-700 text-[9px] font-bold flex items-center gap-1 shadow-xs">
                      <ShieldAlert className="w-2.5 h-2.5" />
                      <span>{t.issueDetected}</span>
                    </div>
                  )}
                  <div className="absolute top-2 end-2 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shadow-xs">
                    {sample.confidence}%
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {commonName}
                    </h4>
                    <p className="text-[10px] text-slate-500 italic line-clamp-1">
                      {sciName}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-600 font-bold">
                    <span>{language === 'ar' ? 'استكشف أكثر من 25 قسماً' : 'Explore 25+ Sections'}</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
