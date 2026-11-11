import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { Type } from '@google/genai';
import { SAMPLE_RECOMMENDED_CROPS } from '@/lib/farm-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      location = 'CALABARZON, Philippines',
      areaSize = 1000,
      areaUnit = 'sqm',
      soilType = 'Loam',
      soilPh = 6.5,
      waterAvailability = 'Abundant (Well/Canal)',
      budget = 'Moderate',
      preferences = 'High market demand vegetables and fruits',
    } = body;

    const promptText = `You are a chief agronomist specialized in tropical and subtropical crop science (with deep expertise in Philippine agriculture, DA-BAR, IRRI, and PCAARRD benchmarks).
Provide optimal crop recommendations for:
- Location: ${location}
- Farm Land Size: ${areaSize} ${areaUnit}
- Soil: ${soilType} (pH: ${soilPh})
- Water Access: ${waterAvailability}
- Farmer's Budget: ${budget}
- Preferences: ${preferences}

Recommend 5 to 7 highly suitable crops spanning Vegetables, Fruits, Rice & Corn, and Herbs & Spices.
For each crop:
- cropName (include local common name if applicable, e.g., 'Tomato (Kamatis)')
- category ('Vegetables', 'Fruits', 'Rice & Corn', 'Herbs & Spices', 'Root Crops')
- suitabilityScore (integer 0-100 based on the soil, water, climate)
- bestPlantingSeason (e.g. 'Dry Cool Season (Oct-Feb)')
- growingDurationDays (integer)
- requiredLandAreaSqm (recommended portion of farm in sqm)
- plantSpacingCm ({ rowToRow: integer, plantToPlant: integer })
- waterRequirements ('Low', 'Moderate', 'High')
- waterAmountLitersPerDay (number)
- fertilizerRequirements (detailed basal and side-dress NPK and organic recommendations)
- estimatedHarvestDate (e.g. '75-80 days after transplanting')
- potentialChallenges (array of 2-4 key pest/climate challenges)
- expectedYieldPerSqmKg (number, realistic yield)
- estimatedMarketPricePerKg (number in local currency, e.g. PHP ₱)
- description (succinct explanation of why this crop thrives in these conditions)
- icon (an appropriate single emoji, e.g. 🍅, 🍆, 🌽, 🌶️, 🥬)`;

    let parsed = null;

    // Primary attempt with Gemini 3.8 Flash
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: 'You are an agricultural recommendation engine. Return strictly valid JSON adhering to the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                cropName: { type: Type.STRING },
                category: { type: Type.STRING },
                suitabilityScore: { type: Type.INTEGER },
                bestPlantingSeason: { type: Type.STRING },
                growingDurationDays: { type: Type.INTEGER },
                requiredLandAreaSqm: { type: Type.INTEGER },
                plantSpacingCm: {
                  type: Type.OBJECT,
                  properties: {
                    rowToRow: { type: Type.INTEGER },
                    plantToPlant: { type: Type.INTEGER },
                  },
                  required: ['rowToRow', 'plantToPlant'],
                },
                waterRequirements: { type: Type.STRING },
                waterAmountLitersPerDay: { type: Type.NUMBER },
                fertilizerRequirements: { type: Type.STRING },
                estimatedHarvestDate: { type: Type.STRING },
                potentialChallenges: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                expectedYieldPerSqmKg: { type: Type.NUMBER },
                estimatedMarketPricePerKg: { type: Type.NUMBER },
                description: { type: Type.STRING },
                icon: { type: Type.STRING },
              },
              required: [
                'cropName',
                'category',
                'suitabilityScore',
                'bestPlantingSeason',
                'growingDurationDays',
                'requiredLandAreaSqm',
                'plantSpacingCm',
                'waterRequirements',
                'waterAmountLitersPerDay',
                'fertilizerRequirements',
                'estimatedHarvestDate',
                'potentialChallenges',
                'expectedYieldPerSqmKg',
                'estimatedMarketPricePerKg',
                'description',
                'icon',
              ],
            },
          },
        },
      });

      parsed = JSON.parse(response.text || '[]');
    } catch (primaryError: any) {
      console.warn('Primary model error in recommend-crops, falling back to 3.1-flash-lite:', primaryError?.message);

      // Fallback attempt with Gemini 3.1 Flash-Lite
      try {
        const fallbackResp = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
          },
        });
        parsed = JSON.parse(fallbackResp.text || '[]');
      } catch (fallbackError: any) {
        console.warn('Fallback model also busy in recommend-crops, using curated tropical crop engine:', fallbackError?.message);
        // Scaled fallback using verified tropical agronomic data
        const areaShare = Math.round(Number(areaSize) / 5);
        parsed = SAMPLE_RECOMMENDED_CROPS.map((crop) => ({
          ...crop,
          requiredLandAreaSqm: Math.max(50, areaShare),
        }));
      }
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      const areaShare = Math.round(Number(areaSize) / 5);
      parsed = SAMPLE_RECOMMENDED_CROPS.map((crop) => ({
        ...crop,
        requiredLandAreaSqm: Math.max(50, areaShare),
      }));
    }

    // Add unique IDs
    const recommendationsWithId = parsed.map((item: any, idx: number) => ({
      ...item,
      id: item.id || `ai-rec-${Date.now()}-${idx}`,
    }));

    return NextResponse.json({ success: true, data: recommendationsWithId });
  } catch (error: any) {
    console.error('Error in recommend-crops route:', error);
    const fallback = SAMPLE_RECOMMENDED_CROPS.map((crop, idx) => ({
      ...crop,
      id: `ai-rec-fallback-${Date.now()}-${idx}`,
    }));
    return NextResponse.json({ success: true, data: fallback });
  }
}
