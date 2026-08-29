import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Tag,
  Dna,
  Binary,
  Compass,
  Globe2,
  Scale,
  Hourglass,
  Utensils,
  ShieldCheck,
  GlassWater,
  Thermometer,
  Droplets,
  Home,
  Smile,
  Volume2,
  Radio,
  Moon,
  Zap,
  Users2,
  HeartHandshake,
  Stethoscope,
  Eye,
  AlertCircle,
  Pill,
  ShieldAlert,
  Skull,
} from 'lucide-react';
import { AnimalDetail, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface AnimalSectionsAccordionProps {
  animal: AnimalDetail;
  language: LanguageCode;
}

export const AnimalSectionsAccordion: React.FC<AnimalSectionsAccordionProps> = ({
  animal,
  language,
}) => {
  const t = translations[language];
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    8: true,
    9: true,
    14: true,
    16: true,
    25: true,
  });

  const toggleSection = (num: number) => {
    setOpenSections((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    for (let i = 1; i <= 26; i++) all[i] = true;
    setOpenSections(all);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const sectionsData = [
    {
      id: 1,
      title: t.animalSections[0] || '1. Identification',
      icon: <Tag className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Common Name</span>
              <p className="font-bold text-slate-900 text-sm">{animal.commonName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Scientific Name</span>
              <p className="font-bold text-amber-800 italic text-sm">{animal.scientificName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">English Name</span>
              <p className="font-semibold text-slate-800">{animal.englishName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Species</span>
              <p className="font-semibold text-slate-800">{animal.species}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Breed / Subspecies</span>
              <p className="font-semibold text-slate-800">{animal.breedOrSubspecies || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Confidence Score</span>
              <p className="font-bold text-emerald-700">{animal.confidence}% Match</p>
            </div>
          </div>
          {animal.localNames && animal.localNames.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Regional / Multilingual Names:</span>
              <div className="flex flex-wrap gap-1.5">
                {animal.localNames.map((name, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 2,
      title: t.animalSections[1] || '2. Species and Breed Details',
      icon: <Dna className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <p>{animal.speciesAndBreedDetails}</p>
        </div>
      ),
    },
    {
      id: 3,
      title: t.animalSections[2] || '3. Scientific Name & Taxonomy',
      icon: <Binary className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <p className="font-bold text-amber-800 text-sm mb-2.5 italic">{animal.scientificName}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div><span className="text-[10px] text-slate-500 uppercase font-bold">Kingdom:</span> <p className="font-semibold text-slate-800">{animal.taxonomy.kingdom}</p></div>
            <div><span className="text-[10px] text-slate-500 uppercase font-bold">Phylum:</span> <p className="font-semibold text-slate-800">{animal.taxonomy.phylum}</p></div>
            <div><span className="text-[10px] text-slate-500 uppercase font-bold">Class:</span> <p className="font-semibold text-slate-800">{animal.taxonomy.class}</p></div>
            <div><span className="text-[10px] text-slate-500 uppercase font-bold">Order:</span> <p className="font-semibold text-slate-800">{animal.taxonomy.order}</p></div>
            <div><span className="text-[10px] text-slate-500 uppercase font-bold">Family:</span> <p className="font-semibold text-slate-800">{animal.taxonomy.family}</p></div>
            <div><span className="text-[10px] text-slate-500 uppercase font-bold">Genus:</span> <p className="font-semibold text-slate-800">{animal.taxonomy.genus}</p></div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: t.animalSections[3] || '4. Origin & History',
      icon: <Compass className="w-4 h-4 text-teal-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {animal.originAndHistory}
        </p>
      ),
    },
    {
      id: 5,
      title: t.animalSections[4] || '5. Countries and Habitat',
      icon: <Globe2 className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          {animal.countriesAndHabitat.map((item, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs">
              🐾 {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 6,
      title: t.animalSections[5] || '6. Size and Weight',
      icon: <Scale className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="grid sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Male Weight</span>
            <p className="font-bold text-slate-900">{animal.sizeAndWeight.maleWeight}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Female Weight</span>
            <p className="font-bold text-slate-900">{animal.sizeAndWeight.femaleWeight}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Height / Dimensions</span>
            <p className="font-medium text-slate-800">{animal.sizeAndWeight.heightOrLength}</p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: t.animalSections[6] || '7. Lifespan',
      icon: <Hourglass className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="grid sm:grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          {animal.lifespan.wild && (
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">In Wild</span>
              <p className="font-bold text-slate-900">{animal.lifespan.wild}</p>
            </div>
          )}
          {animal.lifespan.captivityOrDomestic && (
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Domestic / Captivity</span>
              <p className="font-bold text-emerald-700">{animal.lifespan.captivityOrDomestic}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 8,
      title: t.animalSections[7] || '8. Diet & Nutrition',
      icon: <Utensils className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Dietary Classification:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {animal.diet.type}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Primary Foods:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
              {animal.diet.primaryFoods.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
          <p className="text-slate-700 pt-2 border-t border-slate-200">
            <strong>Feeding Schedule:</strong> {animal.diet.feedingFrequency}
          </p>
        </div>
      ),
    },
    {
      id: 9,
      title: t.animalSections[8] || '9. Safe and Dangerous Foods (Toxicity Alert)',
      icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
            <span className="text-[10px] text-emerald-800 uppercase font-bold flex items-center gap-1">
              ✅ Safe & Nutritious Foods:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-emerald-900 text-[11px]">
              {animal.foodSafety.safeFoods.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
            <span className="text-[10px] text-rose-800 uppercase font-bold flex items-center gap-1">
              ❌ Dangerous & Toxic Foods:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-rose-900 text-[11px]">
              {animal.foodSafety.dangerousFoods.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: t.animalSections[9] || '10. Water & Hydration Requirements',
      icon: <GlassWater className="w-4 h-4 text-teal-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {animal.waterRequirements}
        </p>
      ),
    },
    {
      id: 11,
      title: t.animalSections[10] || '11. Temperature Requirements & Thermal Safety',
      icon: <Thermometer className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Ideal Temperature</span>
              <p className="font-bold text-emerald-700">{animal.temperatureRequirements.idealCelsius}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Comfort Range</span>
              <p className="font-semibold text-slate-800">{animal.temperatureRequirements.minCelsius}°C to {animal.temperatureRequirements.maxCelsius}°C</p>
            </div>
          </div>
          {animal.temperatureRequirements.heatOrColdWarning && (
            <p className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
              ⚠️ {animal.temperatureRequirements.heatOrColdWarning}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 12,
      title: t.animalSections[11] || '12. Humidity Requirements',
      icon: <Droplets className="w-4 h-4 text-teal-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {animal.humidityRequirements}
        </p>
      ),
    },
    {
      id: 13,
      title: t.animalSections[12] || '13. Habitat & Housing Needs',
      icon: <Home className="w-4 h-4 text-amber-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {animal.habitatNeeds}
        </p>
      ),
    },
    {
      id: 14,
      title: t.animalSections[13] || '14. Behavior & Temperament',
      icon: <Smile className="w-4 h-4 text-amber-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {animal.behavior}
        </p>
      ),
    },
    {
      id: 15,
      title: t.animalSections[14] || '15. Communication & Body Language',
      icon: <Volume2 className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Vocal Sounds & Audio:</span>
            <div className="flex flex-wrap gap-1.5">
              {animal.communicationAndSounds.primarySounds.map((snd, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                  🔊 {snd}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Postures & Visual Signals:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
              {animal.communicationAndSounds.bodyLanguage.map((bl, i) => (
                <li key={i}>{bl}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 16,
      title: t.animalSections[15] || '16. Sound Meanings & Audio Decoder',
      icon: <Radio className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="space-y-2.5 text-xs">
          <p className="text-[11px] text-slate-600 mb-2">Decodes what different animal sounds, barks, meows, or chirps mean in specific contexts:</p>
          <div className="space-y-2">
            {animal.soundMeanings.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 flex items-center gap-1.5">
                    🔊 {item.sound}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {item.meaning}
                  </span>
                </div>
                <p className="text-slate-700 text-[11px]"><strong className="text-slate-900">Context:</strong> {item.context}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 17,
      title: t.animalSections[16] || '17. Sleep Duration & Sleep Patterns',
      icon: <Moon className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="grid sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Sleep Hours</span>
            <p className="font-bold text-slate-900">{animal.sleepPatterns.durationHoursPerDay}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Sleep Pattern</span>
            <p className="font-semibold text-teal-800">{animal.sleepPatterns.patternType}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Habits</span>
            <p className="text-slate-700 text-[11px]">{animal.sleepPatterns.habits}</p>
          </div>
        </div>
      ),
    },
    {
      id: 18,
      title: t.animalSections[17] || '18. Activity Periods',
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {animal.activityPeriods}
        </p>
      ),
    },
    {
      id: 19,
      title: t.animalSections[18] || '19. Social Behavior',
      icon: <Users2 className="w-4 h-4 text-teal-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {animal.socialBehavior}
        </p>
      ),
    },
    {
      id: 20,
      title: t.animalSections[19] || '20. Reproduction & Breeding',
      icon: <HeartHandshake className="w-4 h-4 text-pink-600" />,
      content: (
        <div className="grid sm:grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Gestation / Incubation</span>
            <p className="font-bold text-slate-900">{animal.reproduction.gestationOrIncubation}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Litter / Clutch Size</span>
            <p className="font-bold text-slate-900">{animal.reproduction.litterOrClutchSize}</p>
          </div>
          {animal.reproduction.breedingNotes && (
            <div className="sm:col-span-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Breeding Notes:</span>
              <p className="text-slate-700 text-[11px]">{animal.reproduction.breedingNotes}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 21,
      title: t.animalSections[20] || '21. Common Diseases & Health Conditions',
      icon: <Stethoscope className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          {animal.commonDiseases.map((dis, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{dis}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 22,
      title: t.animalSections[21] || '22. Symptoms to Watch For',
      icon: <Eye className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          {animal.symptomsToWatchFor.map((symp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-800">
              <span className="text-amber-600 font-bold">⚠️</span>
              <span>{symp}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 23,
      title: t.animalSections[22] || '23. Health Risk Level',
      icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
          <span className="text-slate-700 font-bold">Evaluated Risk Assessment:</span>
          <span className={`px-3 py-1 rounded-full font-bold uppercase text-xs ${animal.healthRiskLevel === 'healthy' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
            {animal.healthRiskLevel}
          </span>
        </div>
      ),
    },
    {
      id: 24,
      title: t.animalSections[23] || '24. Possible Treatments & Supportive Care',
      icon: <Pill className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          {animal.possibleTreatments.map((treat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-800">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{treat}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 25,
      title: t.animalSections[24] || '25. Critical Veterinary Warning',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>MANDATORY VETERINARY HEALTH ADVISORY</span>
          </div>
          <p className="text-rose-900 leading-relaxed font-medium">
            {animal.veterinaryWarning}
          </p>
          <div className="p-2.5 bg-white rounded-xl text-[11px] text-rose-800 border border-rose-200">
            🚨 <strong>Emergency Notice:</strong> Never attempt to guess dosages or give human medications (e.g., Tylenol, Aspirin, Ibuprofen) to animals without explicit instruction from a licensed veterinarian.
          </div>
        </div>
      ),
    },
    {
      id: 26,
      title: t.animalSections[25] || '26. Toxic Substances & Household Dangers',
      icon: <Skull className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1.5">
          {animal.toxicSubstancesAndDangers.map((danger, idx) => (
            <div key={idx} className="flex items-start gap-2 text-rose-900">
              <span className="text-rose-600 font-bold">☠️</span>
              <span>{danger}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Accordion Header Controls */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
          <Dna className="w-4 h-4 text-amber-600" />
          <span>{t.animalSectionsTitle}</span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            id="animal-expand-all-btn"
            onClick={expandAll}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            {t.expandAll}
          </button>
          <span className="text-slate-300">|</span>
          <button
            id="animal-collapse-all-btn"
            onClick={collapseAll}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            {t.collapseAll}
          </button>
        </div>
      </div>

      {/* 26 Accordion Cards */}
      <div className="space-y-2">
        {sectionsData.map((sec) => {
          const isOpen = Boolean(openSections[sec.id]);
          return (
            <div
              key={sec.id}
              id={`animal-section-${sec.id}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                    {sec.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {sec.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 animate-in fade-in duration-150">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
