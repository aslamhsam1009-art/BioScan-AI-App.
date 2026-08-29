import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  MessageSquare,
  FileDown,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Leaf,
  PawPrint,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { ScanResult, LanguageCode, CountryInfo } from '../types';
import { translations } from '../i18n/translations';
import { PlantSectionsAccordion } from './PlantSectionsAccordion';
import { AnimalSectionsAccordion } from './AnimalSectionsAccordion';

interface ResultDetailViewProps {
  scanResult: ScanResult;
  language: LanguageCode;
  country: CountryInfo;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenChat: () => void;
  onOpenReminderModal: () => void;
  onExportDossier: () => void;
  onScanAnother: () => void;
  onSelectAlternativeMatch: (matchIndex: number) => void;
}

export const ResultDetailView: React.FC<ResultDetailViewProps> = ({
  scanResult,
  language,
  country,
  isFavorite,
  onToggleFavorite,
  onOpenChat,
  onOpenReminderModal,
  onExportDossier,
  onScanAnother,
  onSelectAlternativeMatch,
}) => {
  const t = translations[language];
  const [showAlternativeMatches, setShowAlternativeMatches] = useState(false);

  const isPlant = scanResult.type === 'plant';
  const plant = scanResult.plantData;
  const animal = scanResult.animalData;

  const commonName = plant?.commonName || animal?.commonName || 'Unknown Specimen';
  const scientificName = plant?.scientificName || animal?.scientificName || 'Incertae sedis';
  const englishName = plant?.englishName || animal?.englishName || '';
  const localNames = plant?.localNames || animal?.localNames || [];
  const confidence = scanResult.confidence || 95;

  const diagnosis = plant?.diseaseDiagnosis || animal?.diseaseDiagnosis;
  const isHealthy = diagnosis ? diagnosis.isHealthy : true;
  const severity = diagnosis?.severity || 'healthy';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="detail-back-btn"
          onClick={onScanAnother}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600 rtl:rotate-180" />
          <span>{t.scanAnother}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          <button
            id="detail-favorite-btn"
            onClick={onToggleFavorite}
            className={`p-2 rounded-xl border shadow-xs transition-all ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Export Dossier */}
          <button
            id="detail-export-btn"
            onClick={onExportDossier}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{t.printDossier}</span>
          </button>

          {/* Ask AI Assistant */}
          <button
            id="detail-ask-ai-btn"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs shadow-emerald-600/20 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.askAiQuestion}</span>
          </button>
        </div>
      </div>

      {/* Hero Organism Header Banner */}
      <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
        <div className="grid md:grid-cols-12 gap-0">
          {/* Organism Image Showcase */}
          <div className="md:col-span-5 relative aspect-square sm:aspect-[4/3] md:aspect-auto min-h-[260px] bg-slate-100 overflow-hidden">
            <img
              src={
                isPlant && (!scanResult.imageUrl || scanResult.imageUrl.includes('tiger') || scanResult.imageUrl.includes('animal'))
                  ? 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80'
                  : scanResult.imageUrl || (isPlant ? 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80' : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80')
              }
              alt={commonName}
              className="w-full h-full object-cover"
            />
            {/* Top Badge */}
            <div className="absolute top-3 start-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-slate-800 shadow-sm border border-slate-200">
              {isPlant ? <Leaf className="w-3.5 h-3.5 text-emerald-600" /> : <PawPrint className="w-3.5 h-3.5 text-amber-600" />}
              <span className="capitalize">{isPlant ? t.plants : t.animals}</span>
            </div>

            {/* Health Overlay Pill on Image */}
            <div className="absolute bottom-3 start-3">
              {isHealthy ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.healthySpecimen}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-rose-300 text-rose-700 text-xs font-bold shadow-sm animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>{diagnosis?.problemName || t.issueDetected}</span>
                </div>
              )}
            </div>
          </div>

          {/* Identity & Core Metrics Card */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Confidence Meter Bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {t.identificationAccuracy}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                  {confidence}% {t.match}
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full"
                  style={{ width: `${confidence}%` }}
                />
              </div>

              {/* Names */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {commonName}
              </h1>
              <p className="text-sm font-semibold text-emerald-700 italic mt-0.5">
                {scientificName}
              </p>
              {englishName && englishName !== commonName && (
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{t.alsoKnownAs}</strong> {englishName}
                </p>
              )}

              {/* Multilingual / Local names */}
              {localNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {localNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
              <button
                id="hero-set-reminder-btn"
                onClick={onOpenReminderModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.setReminder}</span>
              </button>

              <button
                id="hero-chat-prompt-btn"
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.askAiQuestion}</span>
              </button>

              <button
                id="hero-export-dossier-btn"
                onClick={onExportDossier}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.printDossier}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Accuracy Disclaimer Banner */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-normal">
          <strong>{t.bioScanDisclaimer}</strong> {t.accuracyWarning}
        </p>
      </div>

      {/* Alternative Possible Matches Card (if present) */}
      {scanResult.matches && scanResult.matches.length > 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <button
            onClick={() => setShowAlternativeMatches(!showAlternativeMatches)}
            className="w-full flex items-center justify-between text-left rtl:text-right"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t.otherMatches} ({scanResult.matches.length} {t.candidates})
              </span>
            </div>
            {showAlternativeMatches ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showAlternativeMatches && (
            <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 animate-in fade-in duration-150">
              {scanResult.matches.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between ${
                    idx === 0
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{m.commonName}</h4>
                      <p className="text-emerald-700 italic text-[11px]">{m.scientificName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-slate-700 border border-slate-200 shadow-xs">
                      {m.confidence}%
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-2 leading-relaxed">{m.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Country Climate Adaptation Box */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 shadow-xs">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900 text-sm">
              {t.climateGuideFor} {country.flag} {country.name}
            </h4>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-amber-800 font-bold border border-slate-200">
              {country.climateZone}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed font-normal">
            {scanResult.countryAdapted?.zoneAdvice || country.localNotes}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-slate-500 font-medium">
            <span><strong>USDA:</strong> {country.usdaZones}</span>
            <span><strong>Temp:</strong> {country.avgTempRange}</span>
            <span><strong>Suitability:</strong> {scanResult.countryAdapted?.climateSuitability || 'High'}</span>
          </div>
        </div>
      </div>

      {/* Health & Disease Diagnosis Highlight Section */}
      {diagnosis && (
        <div
          className={`p-5 rounded-3xl border-2 shadow-sm ${
            diagnosis.isHealthy
              ? 'bg-emerald-50/50 border-emerald-200'
              : severity === 'emergency'
                ? 'bg-rose-50 border-rose-400 shadow-sm animate-pulse'
                : 'bg-rose-50/70 border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {diagnosis.isHealthy ? (
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {diagnosis.isHealthy ? t.specimenHealthyVigorous : `${t.diagnosisTitle} ${diagnosis.problemName || t.issueDetected}`}
                </h3>
                <p className="text-xs text-slate-600">
                  {isPlant ? t.botanicalEvaluationSubtitle : t.zoologicalEvaluationSubtitle}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                diagnosis.isHealthy
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {t.severity} {diagnosis.isHealthy ? t.healthy : severity}
            </span>
          </div>

          {/* Symptoms Detected */}
          <div className="grid sm:grid-cols-2 gap-3 text-xs mb-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                {t.visualSymptomsDetected}
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-normal">
                {(diagnosis.symptomsDetected || []).map((symp, i) => (
                  <li key={i}>{symp}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                {t.recommendedImmediateActions}
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-normal">
                {(diagnosis.recommendedNextSteps || []).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safe Treatment / Care options */}
          {diagnosis.treatmentInformation && (
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                {t.safeBotanicalCareOptions}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(diagnosis.treatmentInformation.safeOptions || []).map((opt, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                  >
                    ✓ {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Critical Veterinary / Botanical Warning */}
          {!isPlant && animal && (
            <div className="mt-3 p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>
                <strong>{t.veterinaryNotice}</strong> {animal.veterinaryWarning}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Render 25-Section Plant Accordion OR 26-Section Animal Accordion */}
      {isPlant && plant && (
        <PlantSectionsAccordion plant={plant} language={language} />
      )}

      {!isPlant && animal && (
        <AnimalSectionsAccordion animal={animal} language={language} />
      )}
    </div>
  );
};
