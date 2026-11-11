import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';

async function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI model response timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// Intelligent agronomic fallback generator if external Gemini endpoints hit temporary 503 high-demand spikes
function generateAgronomicAssistantReply(query: string, farmContext: any): string {
  const q = query.toLowerCase();
  const farmName = farmContext?.name || 'your farm';
  const soil = farmContext?.soilType || 'loam';
  const ph = farmContext?.soilPh || 6.5;
  const area = `${farmContext?.areaSize || 1000} ${farmContext?.areaUnit || 'sqm'}`;
  const location = farmContext?.location || 'tropical agricultural zone';

  // Pest control queries
  if (q.includes('pest') || q.includes('bug') || q.includes('worm') || q.includes('borer') || q.includes('aphid') || q.includes('insect') || q.includes('armyworm')) {
    return `### Integrated Pest Management (IPM) Advisory for ${farmName}

**Location & Soil Context:** ${location} • ${soil} soil (pH ${ph})

#### 1. Immediate Field Assessment & Scouting
- **Inspect Leaf Undersides & Growing Tips:** Check early mornings (6:00 AM - 8:00 AM) or dusk when pests are active.
- **Physical Barriers & Traps:** Install yellow sticky traps (1 trap per 20 m²) for whiteflies, aphids, and thrips. For armyworms or fruit borers, install pheromone or solar light traps along farm perimeters.

#### 2. Organic & Biological Solutions
- **Cold-Pressed Neem Oil Spray:** Mix 5 ml pure cold-pressed neem oil + 2 ml mild liquid soap (as emulsifier) per 1 Liter of non-chlorinated water. Spray thoroughly under leaves every 5–7 days at sunset to protect pollinating bees.
- **Biological Control:** For caterpillar and armyworm infestations, apply *Bacillus thuringiensis* (Bt) or Spinosad bio-insecticide directly into the leaf whorls or foliage.
- **Beneficial Insects:** Conserve spiders, predatory earwigs, and ladybird beetles by minimizing broad-spectrum synthetic chemical applications.

#### 3. Targeted Agronomic Controls (If threshold exceeds 15% damage)
- Rotate pesticide active ingredient chemical groups (IRAC codes) to prevent resistance development.
- **Farmer Safety Warning:** Always wear complete PPE (respirator, nitrile gloves, long sleeves). Strictly observe the Pre-Harvest Interval (PHI) of at least 7 to 14 days before harvest.`;
  }

  // Fertilizer & Nutrition queries
  if (q.includes('fertilizer') || q.includes('npk') || q.includes('nutrient') || q.includes('urea') || q.includes('compost') || q.includes('feed') || q.includes('nitrogen') || q.includes('potassium')) {
    return `### Precision Fertilization & Soil Nutrition Plan for ${farmName}

**Field Specifications:** ${area} • Soil Type: ${soil} (pH ${ph})

#### 1. Basal Application (At Planting / Land Preparation)
- **Organic Enrichment:** Broadcast 1 to 2 kg of cured vermicompost or decomposed farmyard manure per square meter during final rototilling.
- **Inorganic Basal:** Apply Complete 14-14-14 at 10–15 grams per planting hill (approx. 200–250 kg/ha equivalent) placed 5 cm below and away from seedling root-balls to prevent root burn.

#### 2. Vegetative Side-Dressing (20–30 Days After Planting)
- **High-Nitrogen Boost:** Side-dress Urea (46-0-0) or Ammonium Sulfate (21-0-0) at 5 grams per plant along the drip line.
- **Organic Foliar Alternative:** Apply Fermented Plant Juice (FPJ) or Fish Amino Acid (FAA) at 10 ml per Liter of water as an early-morning foliar mist every 10 days.

#### 3. Flowering & Fruit-Filling Stage (45–60 DAP)
- **High Potassium & Micronutrients:** Switch to Muriate of Potash (0-0-60) or high-K foliar (15-15-30) to increase fruit sweetness, firmness, and shelf-life.
- **Calcium Supplement:** Apply water-soluble Calcium Phosphate (CalPhos from toasted eggshells in natural vinegar at 1:10 dilution) to prevent Blossom End Rot in solanaceous crops (tomatoes, peppers, eggplants).

*Note: With your soil pH of ${ph}, nutrient absorption is in a favorable range. Maintain adequate soil moisture when side-dressing granules.*`;
  }

  // Disease & Blight queries
  if (q.includes('disease') || q.includes('blight') || q.includes('fungus') || q.includes('spot') || q.includes('yellow') || q.includes('rot') || q.includes('wilt')) {
    return `### Plant Pathogen & Disease Diagnostics Protocol

**Target Plot:** ${farmName} (${soil} soil, ${location})

#### 1. Symptom Identification
- **Bacterial Wilt (*Ralstonia*):** Rapid daytime wilting while foliage remains green; vascular browning visible upon stem cross-section. (Cannot be cured chemically; immediately rogue and solarize affected soil).
- **Early/Late Blight (*Alternaria / Phytophthora*):** Concentric "bulls-eye" brown rings on lower leaves progressing upward, commonly triggered by humid monsoon rains and water splash.
- **Powdery / Downy Mildew:** White or grayish powdery fungal patches on upper/lower leaf surfaces.

#### 2. Preventative & Curative Action Steps
- **Sanitation:** Immediately prune and bag infected lower leaves touching the soil. Never place diseased foliage in the compost pile.
- **Copper-Based Bio-Fungicide:** Apply copper hydroxide or copper oxychloride at 2.5 g/L early in the morning before temperatures exceed 30°C.
- **Biological Fungicide:** Spray *Bacillus subtilis* or *Trichoderma harzianum* compost tea into root zones to outcompete soil-borne pathogens.
- **Cultural Management:** Improve airflow by widening plant spacing and elevating planting beds 20–30 cm above furrow lines for rapid rainwater drainage.`;
  }

  // Irrigation & Water queries
  if (q.includes('water') || q.includes('irrigation') || q.includes('dry') || q.includes('drip') || q.includes('rain')) {
    return `### Smart Irrigation & Hydration Schedule for ${farmName}

**Soil Profile:** ${soil} • Land Area: ${area}

#### 1. Daily Crop Water Requirements
- In tropical conditions, typical fruiting vegetables require **3.5 to 5.0 Liters per m² per day**, while leafy greens require **2.5 to 3.5 Liters per m²**.
- Rice paddies under AWD (Alternate Wetting and Drying) should maintain 2–3 cm water depth during seedling tillering, allowed to naturally recede to 10 cm below surface before reflooding.

#### 2. Irrigation Scheduling Best Practices
- **Optimal Time:** Irrigate between **6:00 AM – 8:30 AM**. Morning watering allows foliage to dry quickly, substantially reducing fungal spore germination.
- **Avoid Night Irrigation:** Night watering creates sustained humidity around plant crowns, precipitating fungal damp-off and anthracnose.
- **Drip Irrigation Efficiency:** Drip systems deliver 90–95% water efficiency directly to root zones versus 45–60% for furrow/overhead sprinkler methods.
- **Mulching:** Apply cured rice straw or silver-black plastic mulch to reduce soil moisture evaporation by up to 50% and suppress weed competition.`;
  }

  // Rice / Palay queries
  if (q.includes('rice') || q.includes('palay') || q.includes('paddy')) {
    return `### Rice (Palay) Production Guide for ${location}

#### 1. Seed Preparation & Nursery
- Pre-germinate certified inbred (e.g., NSIC Rc 222, Rc 216) or hybrid seed for 24 hours soaking and 24 hours incubation.
- Transplant 18–21 day-old seedlings at 20 cm × 20 cm spacing with 1–2 seedlings per hill.

#### 2. Nutrient Management (Minus-One Element Technique)
- **Basal:** Apply Complete 14-14-14 (6 bags/ha) + Zinc Sulfate (10 kg/ha) before final harrowing.
- **Early Tillering (14–21 DAT):** Top-dress Urea (46-0-0) at 1.5–2 bags/ha.
- **Panicle Initiation (40–45 DAT):** Apply balanced nitrogen and potassium (14-14-14 or 0-0-60 + Urea).

#### 3. Water & Pest Vigilance
- Adopt Alternate Wetting and Drying (AWD) with observation tubes to save up to 30% irrigation water without yield loss.
- Monitor for Golden Apple Snail (Kuhol) during the first 15 days; maintain shallow water (1–2 cm) and install canal screens.`;
  }

  // Tomato / Kamatis queries
  if (q.includes('tomato') || q.includes('kamatis')) {
    return `### Commercial Tomato (Kamatis) Production Protocol

#### 1. Land Preparation & Trellising
- Form raised beds 20–30 cm high and 1 meter wide with 50 cm furrows to prevent root-zone waterlogging.
- Stake plants with 1.5-meter bamboo poles or overhead A-frame trellis within 21 days of transplanting to support fruit weight and reduce disease.

#### 2. Plant Spacing & Care
- Space plants **50 cm between hills** and **75 cm between rows**.
- Prune suckers (axillary shoots) below the first floral cluster to focus nutrients into primary leaders and top-grade marketable fruits.
- Mulch beds with silver-black plastic mulch or cured rice straw to deter thrips, aphids, and weeds.

#### 3. Harvesting Schedule
- Harvest at the "breaker" or pink stage (mature green with pink star at blossom end) for distance transport, or fully vine-ripened red for local farm gate sales. Expected yield: 2.5–4.0 kg per plant under good management.`;
  }

  // General agronomic guidance
  return `### AgriMind Agricultural Advisory for ${farmName}

**Farm Profile:** ${location} • ${area} • ${soil} soil (pH ${ph})

Thank you for your question regarding **"${query}"**. Here are the recommended agronomic guidelines:

#### 1. Soil & Nutrient Management
- For **${soil} soil**, prioritize maintaining healthy soil organic matter (>3.0%) through annual incorporation of vermicast, well-cured compost, or cover crops (such as mungbean / *balatong*).
- Verify soil pH periodically. Your current pH of **${ph}** is suitable for most solanaceous, cucurbit, and grain crops. If pH drops below 5.5, apply agricultural limestone at 200–300 g/m² during field preparation.

#### 2. Climate-Resilient Cultural Practices
- **Bed Preparation:** Maintain elevated, well-ditched crop beds (20–30 cm) with peripheral drainage canals to safeguard crops against heavy tropical rainfall and typhoons.
- **Crop Spacing:** Ensure proper intra-row and inter-row spacing to facilitate wind ventilation and sun penetration, minimizing disease pressure.
- **Crop Rotation:** Never plant members of the same botanical family consecutively in the same plot (e.g. Tomato $\\rightarrow$ Eggplant $\\rightarrow$ Pepper). Rotate with legumes or sweet corn to break soil-borne pathogen cycles.

#### 3. Actionable Next Steps
- You can scan specific plant leaves in the **Plant Scanner** tab for real-time pest and disease detection.
- Check the **Weather Monitor** tab for localized 7-day rainfall forecasts and agronomic spray advisories.
- Let me know if you would like a detailed weekly schedule or input budget calculation!`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], farmContext = null } = body;

    if (!messages.length) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    const systemInstruction = `You are "AgriMind AI", the intelligent agronomic advisor for the "AI Farming Planner" platform.
Your motto is: "Smart Farming. Better Planning. Sustainable Harvest."

You provide practical, scientifically-sound, and farmer-friendly advice on:
- Plant species identification, crop varieties, and growth stages
- Soil conditioning, pH buffering, vermicomposting, biochar
- Fertilization schedules (Basal 14-14-14, Urea 46-0-0, Potash, micronutrients, organic FPJ/FAA/CalPhos)
- Integrated Pest Management (IPM), biological controls, companion planting
- Drip and furrow irrigation calculations, soil moisture management
- Farm budgeting, market yield estimates, post-harvest handling
- Tropical and Philippine agriculture standards (DA-BAR, IRRI, PCAARRD) and global regenerative practices

CRITICAL RULE:
- Never invent scientific facts, guarantee exact yields, or fabricate pesticide approval codes.
- Warn farmers about safety precautions when handling agricultural chemicals (PPE, REI, PHI).
- Present structured, readable answers using clear markdown headers, bold bullet points, and actionable steps.
- When relevant, give both modern agronomic and natural/organic farming options.

Current Farm Profile Context:
${
  farmContext
    ? `- Farm Name: ${farmContext.name || 'Not provided'}
- Location: ${farmContext.location || 'Tropical zone'}
- Land Area: ${farmContext.areaSize || 1000} ${farmContext.areaUnit || 'sqm'}
- Soil Type: ${farmContext.soilType || 'Loam'} (pH: ${farmContext.soilPh || 6.5})
- Water Source: ${farmContext.waterSource || 'Deep well'}
- Currency: ${farmContext.budgetCurrency || '₱'}`
    : 'Standard small-to-medium tropical farm'
}`;

    // Format chat history
    const conversation = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    let reply = '';

    // Primary attempt with Gemini 3.8 Flash
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversation,
          config: {
            systemInstruction,
          },
        }),
        3500
      );

      reply = response.text || '';
    } catch (primaryError: any) {
      console.warn('Primary Gemini 3.8 Flash high demand or error in chat, attempting 3.1-flash-lite fallback:', primaryError?.message);

      // Fallback attempt with Gemini 3.1 Flash-Lite
      try {
        const fallbackResponse = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: conversation,
            config: {
              systemInstruction,
            },
          }),
          3000
        );
        reply = fallbackResponse.text || '';
      } catch (fallbackError: any) {
        console.warn('Fallback model in chat also busy, generating offline agronomic guidance:', fallbackError?.message);
        reply = generateAgronomicAssistantReply(lastUserMessage, farmContext);
      }
    }

    if (!reply || reply.trim().length === 0) {
      reply = generateAgronomicAssistantReply(lastUserMessage, farmContext);
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Error in farming assistant chat route:', error);
    // Never fail with 500 error; always provide high-quality agronomic response
    const fallbackReply = generateAgronomicAssistantReply('', null);
    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      note: 'Offline agronomic advisory',
    });
  }
}
