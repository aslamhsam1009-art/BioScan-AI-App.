import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_ORGANISMS } from './src/data/sampleDatabase.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy init Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    time: new Date().toISOString(),
  });
});

// Search API
app.get('/api/search', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  if (!query) {
    return res.json({ results: SAMPLE_ORGANISMS });
  }

  const results = SAMPLE_ORGANISMS.filter((org) => {
    const p = org.plantData;
    const a = org.animalData;
    const commonName = p?.commonName || a?.commonName || '';
    const sciName = p?.scientificName || a?.scientificName || '';
    const engName = p?.englishName || a?.englishName || '';
    const localNames = (p?.localNames || a?.localNames || []).join(' ');
    const desc = p?.description || a?.behavior || '';
    const disease = p?.diseaseDiagnosis.problemName || a?.diseaseDiagnosis.problemName || '';

    return (
      commonName.toLowerCase().includes(query) ||
      sciName.toLowerCase().includes(query) ||
      engName.toLowerCase().includes(query) ||
      localNames.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query) ||
      disease.toLowerCase().includes(query)
    );
  });

  res.json({ results });
});

// Identify Organism Endpoint
app.post('/api/identify', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', mode = 'auto', country = 'United States', language = 'en' } = req.body;

    const ai = getGeminiClient();

    // If Gemini key is available and image is provided, call Gemini 3.7 Flash
    if (ai && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

        const prompt = `You are BioScan AI, a world-class botanical and zoological AI identification engine and health diagnosis system.
Analyze the provided image of a biological specimen (Plant or Animal).
User's Country: "${country}".
User's Language Code: "${language}".
Requested Scan Mode: "${mode}".

Determine whether this is a PLANT or an ANIMAL.
Perform an extremely comprehensive, scientific, and thorough analysis with high precision.

CRITICAL HEALTH & VETERINARY RULES:
- If the organism appears sick, damaged, infested, or distressed, thoroughly diagnose the symptoms and cause.
- For animals, NEVER present a diagnosis or medication dosage as certain based only on an image. Always strongly advise consulting a licensed veterinarian for serious symptoms or medical prescriptions. Never invent fake medication names or dosages.
- For plants, provide safe, established botanical treatments, organic options, and cultural care corrections.

Return STRICT JSON matching the following structure exactly:
{
  "type": "plant" or "animal",
  "confidence": 98,
  "matches": [
    {
      "commonName": "Primary match name",
      "scientificName": "Genus species Author",
      "confidence": 98,
      "reason": "Why this matches visual features",
      "type": "plant" or "animal"
    },
    {
      "commonName": "Alternative possible match",
      "scientificName": "Alternative species",
      "confidence": 55,
      "reason": "Why it might be confused",
      "type": "plant" or "animal"
    }
  ],
  "plantData": {
    "commonName": "Common name",
    "scientificName": "Scientific name",
    "englishName": "English name",
    "localNames": ["Name in Arabic/Spanish/French/etc."],
    "family": "Family name",
    "genus": "Genus name",
    "confidence": 98,
    "description": "Comprehensive physical and botanical description",
    "foliageDetails": "Leaf shape, arrangement, margin, texture, venation",
    "structureAndForm": "Growth form (herbaceous, shrub, tree, vine, epiphyte)",
    "originAndNaturalHabitat": "Geographical origin and native biomes",
    "countriesAndRegions": ["List of countries and climate regions"],
    "climatePreferences": "Ideal climate zones and environmental parameters",
    "temperatureRange": {
      "minCelsius": 10,
      "maxCelsius": 35,
      "idealCelsius": "18°C - 28°C",
      "frostTolerant": false
    },
    "humidityRequirements": "Required relative humidity percentage",
    "sunlightRequirements": "Lighting requirements (Full sun, Partial shade, Bright indirect)",
    "waterRequirements": {
      "schedule": "Watering frequency and moisture depth",
      "seasonAdjustment": "Winter vs summer changes",
      "signsOfOverwatering": "Specific signs of excess water",
      "signsOfUnderwatering": "Specific signs of water deficit"
    },
    "soilType": "Ideal soil texture and aeration mix",
    "soilPh": "Ideal pH range",
    "fertilizerNeeds": {
      "type": "Fertilizer formulation (NPK ratio)",
      "frequency": "Application schedule",
      "ratio": "Dilution or dosage",
      "seasonalNotes": "Dormancy precautions"
    },
    "potAndPlantingRequirements": "Pot drainage, material, planting depth, repotting",
    "growthRate": "Slow" or "Moderate" or "Fast",
    "matureSize": {
      "height": "Mature height",
      "spread": "Canopy spread",
      "indoorVsOutdoor": "Indoor vs outdoor dimensions"
    },
    "floweringAndFruiting": {
      "bloomingSeason": "Flowering season",
      "flowerColor": "Bloom colors and structure",
      "fruitDescription": "Fruit and seed description"
    },
    "propagationMethods": ["Method 1 (cuttings)", "Method 2 (seeds)", "Method 3 (division)"],
    "toxicity": {
      "toxicToHumans": false,
      "toxicToDogs": true,
      "toxicToCats": true,
      "toxicToHorses": false,
      "toxicCompounds": "Name of toxic chemical or oxalate",
      "severityLevel": "Mild / Moderate / Severe / Non-toxic"
    },
    "edibility": {
      "isEdible": true or false,
      "edibleParts": ["List of edible parts if any"],
      "culinaryUses": "Culinary preparations",
      "edibilityWarnings": "Crucial warnings regarding non-edible parts or cooking requirements"
    },
    "uses": ["Ornamental", "Medicinal", "Air purification", "Culinary"],
    "commonDiseases": ["Disease 1", "Disease 2"],
    "commonPests": ["Pest 1", "Pest 2"],
    "diseaseDiagnosis": {
      "isHealthy": true or false,
      "problemName": "Detected disease or deficiency if sick",
      "severity": "healthy" or "low" or "medium" or "high" or "emergency",
      "symptomsDetected": ["Symptom 1", "Symptom 2"],
      "possibleCauses": ["Cause 1", "Cause 2"],
      "recommendedNextSteps": ["Step 1", "Step 2"],
      "prevention": ["Prevention tip 1", "Prevention tip 2"],
      "treatmentInformation": {
        "safeOptions": ["Treatment option 1", "Treatment option 2"],
        "organicAlternatives": ["Organic remedy 1"],
        "vetOrExpertGuidance": "Expert advice"
      },
      "disclaimer": "AI image analysis is for guidance. Verify before applying treatments."
    },
    "treatmentAndCare": ["Care recommendation 1", "Care recommendation 2"],
    "importantWarnings": ["Botanical caution 1", "Invasive or allergy warning"]
  },
  "animalData": {
    "commonName": "Common animal name",
    "species": "Species name",
    "breedOrSubspecies": "Breed, morph, or subspecies",
    "englishName": "English name",
    "localNames": ["Name in Arabic/Spanish/French/etc."],
    "scientificName": "Genus species",
    "confidence": 98,
    "speciesAndBreedDetails": "Breed background and physiological traits",
    "taxonomy": {
      "kingdom": "Animalia",
      "phylum": "Chordata",
      "class": "Mammalia/Aves/Reptilia/Insecta",
      "order": "Order",
      "family": "Family",
      "genus": "Genus"
    },
    "originAndHistory": "Evolutionary and domestication history",
    "countriesAndHabitat": ["Native countries and habitats"],
    "sizeAndWeight": {
      "maleWeight": "Male weight range",
      "femaleWeight": "Female weight range",
      "heightOrLength": "Dimensions"
    },
    "lifespan": {
      "wild": "Lifespan in wild",
      "captivityOrDomestic": "Lifespan in domestic care"
    },
    "diet": {
      "type": "Herbivore" or "Carnivore" or "Omnivore" or "Insectivore" or "Frugivore",
      "primaryFoods": ["Food 1", "Food 2"],
      "feedingFrequency": "Daily schedule"
    },
    "foodSafety": {
      "safeFoods": ["Safe food 1", "Safe food 2"],
      "dangerousFoods": ["Harmful food 1", "Harmful food 2"],
      "toxicSubstances": ["Toxic hazard 1", "Toxic hazard 2"]
    },
    "waterRequirements": "Hydration habits and daily water needs",
    "temperatureRequirements": {
      "minCelsius": 10,
      "maxCelsius": 30,
      "idealCelsius": "18°C - 24°C",
      "heatOrColdWarning": "Thermal precautions"
    },
    "humidityRequirements": "Required environmental humidity",
    "habitatNeeds": "Housing, enclosure, exercise, territory",
    "behavior": "Temperament, instincts, and psychological traits",
    "communicationAndSounds": {
      "primarySounds": ["Sound 1", "Sound 2"],
      "bodyLanguage": ["Postural cue 1", "Postural cue 2"]
    },
    "soundMeanings": [
      {
        "sound": "Specific vocalization name",
        "meaning": "What this sound indicates",
        "context": "Situation when heard"
      }
    ],
    "sleepPatterns": {
      "durationHoursPerDay": "12-14 hours",
      "patternType": "Diurnal" or "Nocturnal" or "Crepuscular" or "Polyphasic",
      "habits": "Resting behavior"
    },
    "activityPeriods": "Peak daily energy hours",
    "socialBehavior": "Pack, solitary, flock, pair-bonding",
    "reproduction": {
      "gestationOrIncubation": "Gestation/incubation period",
      "litterOrClutchSize": "Average offspring count",
      "breedingNotes": "Breeding considerations"
    },
    "commonDiseases": ["Condition 1", "Condition 2"],
    "symptomsToWatchFor": ["Warning symptom 1", "Warning symptom 2"],
    "healthRiskLevel": "healthy" or "low" or "medium" or "high" or "emergency",
    "possibleTreatments": ["Supportive care 1", "Veterinary management category 2"],
    "veterinaryWarning": "CRITICAL ADVISORY: Image analysis cannot replace a physical veterinary examination. Do not administer human or prescription medications without a licensed veterinarian.",
    "toxicSubstancesAndDangers": ["Poison hazard 1", "Household risk 2"],
    "diseaseDiagnosis": {
      "isHealthy": true or false,
      "problemName": "Observed symptom or condition if visible",
      "severity": "healthy" or "low" or "medium" or "high" or "emergency",
      "symptomsDetected": ["Observed physical trait 1"],
      "possibleCauses": ["Possible cause 1"],
      "recommendedNextSteps": ["Consult veterinarian if symptoms persist"],
      "prevention": ["Preventative wellness guideline"],
      "treatmentInformation": {
        "safeOptions": ["Hydration and warmth", "Rest in low-stress environment"],
        "vetOrExpertGuidance": "Never administer prescription drugs without professional veterinary supervision."
      },
      "disclaimer": "AI observation only. Seek emergency vet care for acute distress."
    }
  },
  "countryAdapted": {
    "countryName": "${country}",
    "zoneAdvice": "Specific care advice adapted to ${country}'s climate and seasonality",
    "climateSuitability": "How well this organism thrives in ${country}"
  }
}

Note: If it is a plant, fill "plantData" completely and omit "animalData" (or set animalData to null). If it is an animal, fill "animalData" completely and omit "plantData" (or set plantData to null).
Provide all text in English or translated appropriately for the user's language code "${language}".`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });

        let cleanText = (response.text || '{}').trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        let parsed: any = {};
        try {
          parsed = JSON.parse(cleanText);
        } catch (jsonErr) {
          console.warn('Failed to parse Gemini JSON output, falling back to regex extraction:', jsonErr);
          const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsed = JSON.parse(jsonMatch[0]);
            } catch {
              parsed = {};
            }
          }
        }

        if (parsed && (parsed.plantData || parsed.animalData || parsed.type)) {
          const scanResult = {
            id: `scan-${Date.now()}`,
            timestamp: Date.now(),
            type: parsed.type || (mode === 'animal' ? 'animal' : 'plant'),
            imageUrl: imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${cleanBase64}`,
            confidence: parsed.confidence || 95,
            matches: Array.isArray(parsed.matches) ? parsed.matches : [],
            plantData: parsed.plantData || undefined,
            animalData: parsed.animalData || undefined,
            countryAdapted: parsed.countryAdapted || {
              countryName: country,
              zoneAdvice: `Check local climate suitability for ${country}.`,
              climateSuitability: 'Moderate to High',
            },
          };

          return res.json(scanResult);
        }
      } catch (geminiError: any) {
        console.error('Gemini API identification error:', geminiError);
        // Fall through to sample match
      }
    }

    // Fallback or demo simulation matching
    const sample =
      mode === 'animal'
        ? SAMPLE_ORGANISMS.find((o) => o.type === 'animal') || SAMPLE_ORGANISMS[2]
        : mode === 'plant'
          ? SAMPLE_ORGANISMS.find((o) => o.type === 'plant') || SAMPLE_ORGANISMS[0]
          : SAMPLE_ORGANISMS[Math.floor(Math.random() * SAMPLE_ORGANISMS.length)];

    const synthesizedResult = {
      ...sample,
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      imageUrl: imageBase64 || sample.imageUrl,
      countryAdapted: {
        countryName: country,
        zoneAdvice: `Tailored local climate advice for ${country}: Ensure proper seasonal adjustments and humidity management.`,
        climateSuitability: 'High',
      },
    };

    res.json(synthesizedResult);
  } catch (err: any) {
    console.error('Identify endpoint error:', err);
    res.status(500).json({ error: 'Failed to identify image', message: err?.message });
  }
});

// Search Endpoint for manual organism lookup
app.get('/api/search', (req, res) => {
  try {
    const q = ((req.query.q as string) || '').toLowerCase().trim();
    if (!q) {
      return res.json({ results: [] });
    }

    const filtered = SAMPLE_ORGANISMS.filter((org) => {
      const common = (org.plantData?.commonName || org.animalData?.commonName || '').toLowerCase();
      const sci = (org.plantData?.scientificName || org.animalData?.scientificName || '').toLowerCase();
      const eng = (org.plantData?.englishName || org.animalData?.englishName || '').toLowerCase();
      const type = org.type.toLowerCase();
      return common.includes(q) || sci.includes(q) || eng.includes(q) || type.includes(q);
    });

    res.json({ results: filtered.length > 0 ? filtered : [SAMPLE_ORGANISMS[0]] });
  } catch (err: any) {
    console.error('Search endpoint error:', err);
    res.status(500).json({ error: 'Failed to execute search', results: [] });
  }
});

// AI Chat Endpoint connected to scanned organism
app.post('/api/chat', async (req, res) => {
  try {
    const { organismName, organismType, organismData, message, country = 'United States', language = 'en', history = [] } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemPrompt = `You are BioScan AI Assistant, a deeply knowledgeable, caring, and ethical botanical and zoological expert.
Current Organism: "${organismName}" (${organismType}).
User's Country: "${country}".
User's Language: "${language}".

Organism Summary Data:
${JSON.stringify(organismData || {}).slice(0, 3000)}

USER GUIDELINES:
1. Provide accurate, practical, and highly specific answers about care, watering, soil, nutrition, toxicity, behavior, disease prevention, or sound meanings.
2. For animals, NEVER prescribe medication dosages or guarantee a medical cure. Emphasize licensed veterinary consultation for acute conditions, wounds, poisoning, or lethargy.
3. For plants, give safe organic/botanical remedies, watering adjustments, and propagation tips.
4. Adapt your answer to the climate and conditions of the user's country (${country}) when relevant.
5. Answer in the user's language (${language}). If Arabic, use fluent Arabic.
6. Provide 2-3 short follow-up suggested question chips at the end of your response formatted like:
---SUGGESTIONS---
["Suggested question 1", "Suggested question 2", "Suggested question 3"]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
            },
          ],
        });

        let answerText = response.text || 'I am ready to help you learn more about this organism.';
        let suggestions: string[] = [
          'How often should I water it?',
          'Is it safe around pets?',
          'What are the signs of health problems?',
        ];

        if (answerText.includes('---SUGGESTIONS---')) {
          const parts = answerText.split('---SUGGESTIONS---');
          answerText = parts[0].trim();
          try {
            const parsedSuggestions = JSON.parse(parts[1].trim());
            if (Array.isArray(parsedSuggestions)) {
              suggestions = parsedSuggestions;
            }
          } catch (e) {
            // keep defaults
          }
        }

        return res.json({
          reply: answerText,
          suggestions,
        });
      } catch (geminiError: any) {
        console.error('Gemini chat error:', geminiError);
      }
    }

    // Smart contextual fallback response
    let reply = `Here are specific recommendations for **${organismName}** in ${country}:\n\n`;
    if (organismType === 'plant') {
      reply += `• **Watering**: Ensure topsoil is checked before watering. Reduce frequency during cold winter months.\n• **Light**: Provide bright, filtered sunlight to keep foliage vibrant.\n• **Health**: Inspect undersides of leaves weekly for early signs of pests or fungal spotting.\n• **Country note**: In ${country}, protect against seasonal temperature extremes and dry indoor heating.`;
    } else {
      reply += `• **Nutrition & Diet**: Feed a balanced, high-protein diet suitable for its age and activity level.\n• **Hydration**: Always provide fresh, clean water daily.\n• **Behavior**: Ensure adequate daily exercise, play, and mental enrichment.\n• **Veterinary note**: Always consult a licensed veterinarian in ${country} for regular checkups, vaccinations, and before administering any medications.`;
    }

    res.json({
      reply,
      suggestions: [
        'What are the common health risks?',
        'Is this safe for other household pets?',
        'What is the ideal temperature range?',
      ],
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'Failed to process chat', message: err?.message });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BioScan AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
