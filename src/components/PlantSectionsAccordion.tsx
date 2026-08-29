import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Tag,
  FileText,
  Compass,
  Globe2,
  CloudSun,
  Thermometer,
  Droplets,
  Sun,
  GlassWater,
  Layers,
  FlaskConical,
  Sprout,
  Box,
  TrendingUp,
  Maximize2,
  Flower2,
  Scissors,
  AlertTriangle,
  Utensils,
  Sparkles,
  Bug,
  Stethoscope,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { PlantDetail, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface PlantSectionsAccordionProps {
  plant: PlantDetail;
  language: LanguageCode;
}

export const PlantSectionsAccordion: React.FC<PlantSectionsAccordionProps> = ({
  plant,
  language,
}) => {
  const t = translations[language];
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    8: true,
    9: true,
    18: true,
    23: true,
  });

  const toggleSection = (num: number) => {
    setOpenSections((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    for (let i = 1; i <= 25; i++) all[i] = true;
    setOpenSections(all);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const sectionsData = [
    {
      id: 1,
      title: t.plantSections[0] || '1. Identification & Taxonomy',
      icon: <Tag className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Common Name</span>
              <p className="font-bold text-slate-900 text-sm">{plant.commonName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Scientific Name</span>
              <p className="font-bold text-emerald-700 italic text-sm">{plant.scientificName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Botanical Family</span>
              <p className="font-semibold text-slate-800">{plant.family}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Genus</span>
              <p className="font-semibold text-slate-800">{plant.genus}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">English / Trade Name</span>
              <p className="font-semibold text-slate-800">{plant.englishName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">AI Confidence</span>
              <p className="font-bold text-emerald-700">{plant.confidence}% Match</p>
            </div>
          </div>
          {plant.localNames && plant.localNames.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Multilingual / Regional Names:</span>
              <div className="flex flex-wrap gap-1.5">
                {plant.localNames.map((name, i) => (
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
      title: t.plantSections[1] || '2. Description & Foliage Structure',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-normal">{plant.description}</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block mb-1">Leaf & Foliage Detail:</span>
              <p>{plant.foliageDetails}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block mb-1">Growth Form & Structure:</span>
              <p>{plant.structureAndForm}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: t.plantSections[2] || '3. Origin and Natural Habitat',
      icon: <Compass className="w-4 h-4 text-teal-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {plant.originAndNaturalHabitat}
        </p>
      ),
    },
    {
      id: 4,
      title: t.plantSections[3] || '4. Countries & Regions Where It Grows',
      icon: <Globe2 className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          {plant.countriesAndRegions.map((region, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs">
              🌍 {region}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 5,
      title: t.plantSections[4] || '5. Climate Preferences',
      icon: <CloudSun className="w-4 h-4 text-amber-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {plant.climatePreferences}
        </p>
      ),
    },
    {
      id: 6,
      title: t.plantSections[5] || '6. Temperature Requirements & Frost Tolerance',
      icon: <Thermometer className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Ideal Range</span>
            <p className="font-bold text-emerald-700">{plant.temperatureRange.idealCelsius}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Min / Max Survival</span>
            <p className="font-semibold text-slate-800">{plant.temperatureRange.minCelsius}°C to {plant.temperatureRange.maxCelsius}°C</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Frost Tolerance</span>
            <p className={`font-semibold ${plant.temperatureRange.frostTolerant ? 'text-emerald-700' : 'text-rose-600'}`}>
              {plant.temperatureRange.frostTolerant ? 'Frost Tolerant' : 'Sensitive to Frost (Keep Indoors)'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: t.plantSections[6] || '7. Humidity Requirements',
      icon: <Droplets className="w-4 h-4 text-teal-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {plant.humidityRequirements}
        </p>
      ),
    },
    {
      id: 8,
      title: t.plantSections[7] || '8. Sunlight & Lighting Requirements',
      icon: <Sun className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed">
          <p className="font-bold text-amber-800 mb-1">☀️ {plant.sunlightRequirements}</p>
          <p className="text-slate-600 text-[11px]">Ensure adequate photoperiod for robust chlorophyll production without scorching leaf margins.</p>
        </div>
      ),
    },
    {
      id: 9,
      title: t.plantSections[8] || '9. Water Requirements & Hydration Schedule',
      icon: <GlassWater className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-teal-700 font-bold uppercase block mb-1">Standard Watering Routine:</span>
            <p className="font-semibold text-slate-900">{plant.waterRequirements.schedule}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-[10px] text-rose-700 font-bold uppercase block mb-1">Signs of Overwatering:</span>
              <p className="text-rose-900 text-[11px]">{plant.waterRequirements.signsOfOverwatering}</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] text-amber-700 font-bold uppercase block mb-1">Signs of Underwatering:</span>
              <p className="text-amber-900 text-[11px]">{plant.waterRequirements.signsOfUnderwatering}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: t.plantSections[9] || '10. Soil Type & Substrate Blend',
      icon: <Layers className="w-4 h-4 text-amber-700" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {plant.soilType}
        </p>
      ),
    },
    {
      id: 11,
      title: t.plantSections[10] || '11. Soil pH Range',
      icon: <FlaskConical className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Optimal pH:</span>
          <p className="text-sm font-bold text-teal-800 mt-0.5">{plant.soilPh}</p>
        </div>
      ),
    },
    {
      id: 12,
      title: t.plantSections[11] || '12. Fertilizer & Nutrient Needs',
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="grid sm:grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Recommended Formulation</span>
            <p className="font-bold text-slate-900">{plant.fertilizerNeeds.type}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Feeding Frequency</span>
            <p className="font-semibold text-emerald-700">{plant.fertilizerNeeds.frequency}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Application Ratio</span>
            <p className="font-medium text-slate-700">{plant.fertilizerNeeds.ratio}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Seasonal Dormancy Note</span>
            <p className="font-medium text-slate-700">{plant.fertilizerNeeds.seasonalNotes}</p>
          </div>
        </div>
      ),
    },
    {
      id: 13,
      title: t.plantSections[12] || '13. Pot & Planting Requirements',
      icon: <Box className="w-4 h-4 text-amber-600" />,
      content: (
        <p className="text-xs text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
          {plant.potAndPlantingRequirements}
        </p>
      ),
    },
    {
      id: 14,
      title: t.plantSections[13] || '14. Growth Rate',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Speed:</span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
            {plant.growthRate} Growth Rate
          </span>
        </div>
      ),
    },
    {
      id: 15,
      title: t.plantSections[14] || '15. Mature Size (Height & Spread)',
      icon: <Maximize2 className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="grid sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Height</span>
            <p className="font-bold text-slate-900">{plant.matureSize.height}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Canopy Spread</span>
            <p className="font-bold text-slate-900">{plant.matureSize.spread}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Indoor vs Outdoor</span>
            <p className="font-medium text-slate-700">{plant.matureSize.indoorVsOutdoor}</p>
          </div>
        </div>
      ),
    },
    {
      id: 16,
      title: t.plantSections[15] || '16. Flowering & Fruiting',
      icon: <Flower2 className="w-4 h-4 text-pink-600" />,
      content: (
        <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="grid sm:grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Blooming Season</span>
              <p className="font-bold text-pink-700">{plant.floweringAndFruiting.bloomingSeason}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Flower Color & Type</span>
              <p className="font-bold text-slate-900">{plant.floweringAndFruiting.flowerColor}</p>
            </div>
          </div>
          {plant.floweringAndFruiting.fruitDescription && (
            <div className="pt-2.5 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Fruit & Seeds:</span>
              <p className="text-slate-700">{plant.floweringAndFruiting.fruitDescription}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 17,
      title: t.plantSections[16] || '17. Propagation Methods',
      icon: <Scissors className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          {plant.propagationMethods.map((method, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-slate-800">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{method}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 18,
      title: t.plantSections[17] || '18. Toxicity (Humans & Pets)',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className={`p-2.5 rounded-xl text-center ${plant.toxicity.toxicToHumans ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
              <span className="text-[10px] block uppercase font-bold">Humans</span>
              <span className="text-xs font-extrabold">{plant.toxicity.toxicToHumans ? '⚠️ Toxic' : '✅ Safe'}</span>
            </div>
            <div className={`p-2.5 rounded-xl text-center ${plant.toxicity.toxicToDogs ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
              <span className="text-[10px] block uppercase font-bold">Dogs</span>
              <span className="text-xs font-extrabold">{plant.toxicity.toxicToDogs ? '⚠️ Toxic' : '✅ Safe'}</span>
            </div>
            <div className={`p-2.5 rounded-xl text-center ${plant.toxicity.toxicToCats ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
              <span className="text-[10px] block uppercase font-bold">Cats</span>
              <span className="text-xs font-extrabold">{plant.toxicity.toxicToCats ? '⚠️ Toxic' : '✅ Safe'}</span>
            </div>
            <div className={`p-2.5 rounded-xl text-center ${plant.toxicity.toxicToHorses ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
              <span className="text-[10px] block uppercase font-bold">Horses</span>
              <span className="text-xs font-extrabold">{plant.toxicity.toxicToHorses ? '⚠️ Toxic' : '✅ Safe'}</span>
            </div>
          </div>
          <div className="pt-2.5 border-t border-slate-200">
            <p className="text-slate-700 text-[11px]"><strong className="text-rose-700">Active Compounds:</strong> {plant.toxicity.toxicCompounds}</p>
            <p className="text-slate-700 text-[11px] mt-0.5"><strong className="text-amber-800">Severity:</strong> {plant.toxicity.severityLevel}</p>
          </div>
        </div>
      ),
    },
    {
      id: 19,
      title: t.plantSections[18] || '19. Is It Edible?',
      icon: <Utensils className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${plant.edibility.isEdible ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
              {plant.edibility.isEdible ? 'Edible (Under Specific Conditions)' : 'Non-Edible / Toxic'}
            </span>
          </div>
          {plant.edibility.edibleParts && (
            <p className="text-slate-700"><strong className="text-slate-900">Edible Parts:</strong> {plant.edibility.edibleParts.join(', ')}</p>
          )}
          <p className="text-amber-900 text-[11px] bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-normal">
            ⚠️ {plant.edibility.edibilityWarnings}
          </p>
        </div>
      ),
    },
    {
      id: 20,
      title: t.plantSections[19] || '20. Practical & Ornamental Uses',
      icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          {plant.uses.map((use, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs">
              ✨ {use}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 21,
      title: t.plantSections[20] || '21. Common Diseases',
      icon: <Stethoscope className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          {plant.commonDiseases.map((dis, idx) => (
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
      title: t.plantSections[21] || '22. Common Pests',
      icon: <Bug className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          {plant.commonPests.map((pest, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs">
              🐛 {pest}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 23,
      title: t.plantSections[22] || '23. Disease Diagnosis from Photo',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      content: (
        <div className={`p-3.5 rounded-xl border text-xs space-y-2.5 ${plant.diseaseDiagnosis.isHealthy ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-300'}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">
              {plant.diseaseDiagnosis.isHealthy ? '✅ Specimen Appears Healthy' : `⚠️ Problem: ${plant.diseaseDiagnosis.problemName}`}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${plant.diseaseDiagnosis.severity === 'healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              Severity: {plant.diseaseDiagnosis.severity}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Visual Symptoms Observed:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
              {plant.diseaseDiagnosis.symptomsDetected.map((symp, i) => (
                <li key={i}>{symp}</li>
              ))}
            </ul>
          </div>

          {plant.diseaseDiagnosis.possibleCauses.length > 0 && (
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Possible Causes:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                {plant.diseaseDiagnosis.possibleCauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <span className="text-[10px] text-emerald-700 uppercase font-bold block mb-1">Recommended Next Steps:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-800">
              {plant.diseaseDiagnosis.recommendedNextSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 24,
      title: t.plantSections[23] || '24. Treatment & Care Recommendations',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
          {plant.treatmentAndCare.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-800">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 25,
      title: t.plantSections[24] || '25. Important Botanical Warnings',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5">
          {plant.importantWarnings.map((warn, idx) => (
            <p key={idx} className="text-amber-900 text-[11px] leading-relaxed font-normal">
              ⚠️ {warn}
            </p>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Accordion Controls */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>{t.plantSectionsTitle}</span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            id="plant-expand-all-btn"
            onClick={expandAll}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            {t.expandAll}
          </button>
          <span className="text-slate-300">|</span>
          <button
            id="plant-collapse-all-btn"
            onClick={collapseAll}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            {t.collapseAll}
          </button>
        </div>
      </div>

      {/* 25 Accordion Cards */}
      <div className="space-y-2">
        {sectionsData.map((sec) => {
          const isOpen = Boolean(openSections[sec.id]);
          return (
            <div
              key={sec.id}
              id={`plant-section-${sec.id}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
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
