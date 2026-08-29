import React, { useState } from 'react';
import { Heart, History, Leaf, PawPrint, X, Trash2, ArrowRight, Search } from 'lucide-react';
import { ScanResult, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface SavedCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedScans: ScanResult[];
  initialTab?: 'saved' | 'history';
  onSelectScan: (scan: ScanResult) => void;
  onRemoveScan: (id: string) => void;
  language: LanguageCode;
}

export const SavedCollectionModal: React.FC<SavedCollectionModalProps> = ({
  isOpen,
  onClose,
  savedScans,
  initialTab = 'saved',
  onSelectScan,
  onRemoveScan,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'plant' | 'animal'>('all');

  if (!isOpen) return null;

  const displayList = savedScans.filter((scan) => {
    if (activeTab === 'saved' && !scan.isFavorite) return false;
    if (filterType !== 'all' && scan.type !== filterType) return false;

    const commonName = scan.plantData?.commonName || scan.animalData?.commonName || '';
    const sciName = scan.plantData?.scientificName || scan.animalData?.scientificName || '';
    return (
      commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sciName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[750px]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                id="collection-tab-saved"
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'saved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{t.savedItems}</span>
              </button>

              <button
                id="collection-tab-history"
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>{t.recentScans}</span>
              </button>
            </div>
          </div>

          <button
            id="collection-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث في الكائنات المحفوظة...' : 'Search saved organisms...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setFilterType('plant')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterType === 'plant' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              {t.plants}
            </button>
            <button
              onClick={() => setFilterType('animal')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterType === 'animal' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <PawPrint className="w-3.5 h-3.5 text-amber-600" />
              {t.animals}
            </button>
          </div>
        </div>

        {/* Content Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {displayList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                {activeTab === 'saved' ? <Heart className="w-6 h-6" /> : <History className="w-6 h-6" />}
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                {activeTab === 'saved'
                  ? (language === 'ar' ? 'لا توجد عناصر محفوظة في المفضلة بعد' : 'No Saved Favorites Yet')
                  : (language === 'ar' ? 'سجل الفحوصات فارغ' : 'No Scan History Found')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab === 'saved'
                  ? (language === 'ar' ? 'انقر على أيقونة القلب في أي كائن تم فحصه لحفظه في مجموعتك الشخصية الدائمة.' : 'Tap the heart icon on any scanned plant or animal to save it to your permanent collection.')
                  : (language === 'ar' ? 'ستظهر جميع الكائنات التي تفحصها تلقائياً هنا مع كامل التفاصيل والتشخيصات.' : 'Scanned organisms will automatically appear here with full history and diagnoses.')}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {displayList.map((item) => {
                const isPlant = item.type === 'plant';
                const common = item.plantData?.commonName || item.animalData?.commonName || 'Unknown';
                const scientific = item.plantData?.scientificName || item.animalData?.scientificName || '';
                const timeAgo = new Date(item.timestamp).toLocaleDateString(language === 'ar' ? 'ar-EG' : undefined);

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl flex items-center justify-between gap-3 shadow-xs group transition-all"
                  >
                    <div
                      onClick={() => {
                        onSelectScan(item);
                        onClose();
                      }}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img src={item.imageUrl} alt={common} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 end-1 p-0.5 rounded bg-white/90 shadow-2xs">
                          {isPlant ? <Leaf className="w-2.5 h-2.5 text-emerald-600" /> : <PawPrint className="w-2.5 h-2.5 text-amber-600" />}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {common}
                        </h4>
                        <p className="text-[11px] text-slate-500 italic truncate font-medium">{scientific}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{timeAgo} • {item.confidence}% {t.match}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onSelectScan(item);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-600 hover:text-white transition-colors"
                        title={t.viewDossier}
                      >
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                      <button
                        onClick={() => onRemoveScan(item.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
