import React from 'react';
import { FileDown, Printer, X } from 'lucide-react';
import { ScanResult, LanguageCode, CountryInfo } from '../types';
import { translations } from '../i18n/translations';

interface DossierExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult;
  language: LanguageCode;
  country: CountryInfo;
}

export const DossierExportModal: React.FC<DossierExportModalProps> = ({
  isOpen,
  onClose,
  scanResult,
  language,
  country,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const isPlant = scanResult.type === 'plant';
  const plant = scanResult.plantData;
  const animal = scanResult.animalData;

  const common = plant?.commonName || animal?.commonName || (language === 'ar' ? 'عينة غير محددة' : 'Unknown Specimen');
  const scientific = plant?.scientificName || animal?.scientificName || '';
  const dateStr = new Date(scanResult.timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : undefined);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <FileDown className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'تصدير التقرير العلمي البيولوجي (Dossier)' : 'Botanical / Zoological Dossier Export'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'طباعة / حفظ كـ PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Stage */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-800 font-sans space-y-6 print:p-0 print:bg-white print:text-black">
          {/* Document Header */}
          <div className="border-b-2 border-emerald-600 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-emerald-700">BioScan AI</span>
                <span className="text-xs text-slate-500 uppercase font-bold">
                  {language === 'ar' ? 'التقرير البيولوجي المعتمد' : 'Official Biological Dossier'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {language === 'ar'
                  ? `سجل معتمد وموثق لتعريف الكائنات الحية • الدولة: ${country.name}`
                  : `Validated specimen identification record • Country: ${country.name}`}
              </p>
            </div>
            <div className="text-end text-[11px] text-slate-500 font-medium">
              <p>{language === 'ar' ? `تاريخ الإصدار: ${dateStr}` : `Generated: ${dateStr}`}</p>
              <p>ID: {scanResult.id}</p>
            </div>
          </div>

          {/* Core Visual & Taxonomy Summary */}
          <div className="grid sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-4 rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
              <img src={scanResult.imageUrl} alt={common} className="w-full h-full object-cover" />
            </div>

            <div className="sm:col-span-8 space-y-2 text-xs">
              <h2 className="text-2xl font-extrabold text-slate-900">{common}</h2>
              <p className="text-sm font-semibold text-emerald-700 italic">{scientific}</p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase text-[9px] font-bold">
                    {language === 'ar' ? 'التصنيف' : 'Category'}
                  </span>
                  <span className="font-bold uppercase text-slate-900">
                    {scanResult.type === 'plant' ? (language === 'ar' ? 'نباتي' : 'Plant') : (language === 'ar' ? 'حيواني' : 'Animal')}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase text-[9px] font-bold">
                    {t.accuracy}
                  </span>
                  <span className="font-bold text-emerald-700">{scanResult.confidence}%</span>
                </div>
              </div>

              {isPlant && plant && (
                <div className="pt-2 text-slate-700 text-xs space-y-1">
                  <p><strong>{language === 'ar' ? 'الفصيلة:' : 'Family:'}</strong> {plant.family} | <strong>{language === 'ar' ? 'الجنس:' : 'Genus:'}</strong> {plant.genus}</p>
                  <p><strong>{language === 'ar' ? 'ضوء الشمس:' : 'Sunlight:'}</strong> {plant.sunlightRequirements}</p>
                  <p><strong>{language === 'ar' ? 'السقاية:' : 'Watering:'}</strong> {plant.waterRequirements.schedule}</p>
                </div>
              )}

              {!isPlant && animal && (
                <div className="pt-2 text-slate-700 text-xs space-y-1">
                  <p><strong>{language === 'ar' ? 'النظام الغذائي:' : 'Diet:'}</strong> {animal.diet.type} | <strong>{language === 'ar' ? 'العمر المتوقع:' : 'Lifespan:'}</strong> {animal.lifespan.captivityOrDomestic || animal.lifespan.wild}</p>
                  <p><strong>{language === 'ar' ? 'ساعات النوم:' : 'Sleep:'}</strong> {animal.sleepPatterns.durationHoursPerDay}</p>
                  <p><strong>{language === 'ar' ? 'الحرارة المثالية:' : 'Ideal Temp:'}</strong> {animal.temperatureRequirements.idealCelsius}</p>
                </div>
              )}
            </div>
          </div>

          {/* Health & Pathology Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {language === 'ar' ? 'نتائج الفحص والتشخيص الصحي' : 'Pathology & Health Diagnostic Findings'}
            </h4>
            {isPlant && plant && (
              <div className="space-y-1 text-slate-700">
                <p>
                  <strong>{language === 'ar' ? 'الحالة الصحية:' : 'Status:'}</strong> {plant.diseaseDiagnosis.isHealthy ? (language === 'ar' ? 'عينة سليمة وصحية' : 'Healthy specimen') : plant.diseaseDiagnosis.problemName}
                </p>
                <p>
                  <strong>{language === 'ar' ? 'الأعراض المرصودة:' : 'Symptoms:'}</strong> {(plant.diseaseDiagnosis.symptomsDetected || []).join('، ') || (language === 'ar' ? 'لا توجد أعراض مرضية' : 'None reported')}
                </p>
                <p>
                  <strong>{language === 'ar' ? 'الخطوات الموصى بها:' : 'Recommended Next Steps:'}</strong> {(plant.diseaseDiagnosis.recommendedNextSteps || []).join('؛ ') || (language === 'ar' ? 'متابعة العناية الدورية القياسية' : 'Standard ongoing care')}
                </p>
              </div>
            )}
            {!isPlant && animal && (
              <div className="space-y-1 text-slate-700">
                <p>
                  <strong>{language === 'ar' ? 'الحالة الصحية:' : 'Status:'}</strong> {animal.diseaseDiagnosis.isHealthy ? (language === 'ar' ? 'عينة سليمة وصحية' : 'Healthy specimen') : animal.diseaseDiagnosis.problemName}
                </p>
                <p>
                  <strong>{language === 'ar' ? 'تقييم المخاطر:' : 'Risk Assessment:'}</strong> {animal.healthRiskLevel}
                </p>
                <p>
                  <strong>{language === 'ar' ? 'ملاحظة بيطرية:' : 'Veterinary Note:'}</strong> {animal.veterinaryWarning}
                </p>
              </div>
            )}
          </div>

          {/* Climate Adaptation */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {language === 'ar' ? `إرشادات المناخ الإقليمي (${country.name})` : `Regional Climate Guidance (${country.name})`}
            </h4>
            <p className="text-slate-700">
              {scanResult.countryAdapted?.zoneAdvice || country.localNotes}
            </p>
          </div>

          {/* Official Verification Seal */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>BioScan AI Neural Biological Engine • v2.5 Enterprise</span>
            <span>{language === 'ar' ? 'تقرير بحثي وعلمي إرشادي' : 'Educational and scientific research dossier'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
