import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const municipalityBriefingAgent = {
    generateBriefing: async (municipalityId: string, wardId: string) => {
        try {
            // Step 1 — Gather ward data
            // MOCK data retrieval: This week vs last week pickup counts, avg scores, etc.
            const wardData = {
                wardName: "Ward 14",
                totalPickupsThisWeek: 450,
                totalPickupsLastWeek: 410,
                averageScore: 78,
                problemArea: {
                    name: "MG Road",
                    complianceDrop: "-26%",
                    possibleCause: "Kabadiwala reassignment"
                },
                zeroPickupArea: {
                    name: "Sunshine Apartments",
                    daysSinceLastPickup: 10
                },
                improvedArea: {
                    name: "Sector 7B",
                    complianceGrowth: "+37%",
                    keyDriver: "Priya (4.8 stars)"
                }
            };

            // Step 2 & 3 — Gemini analysis matching plain language goals
            /*
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `
              You are an assistant to a busy municipality officer. Group the following raw data into a short, 
              3-point plain-English action list. Do NOT use charts.
              Data: ${JSON.stringify(wardData)}
            `;
            const result = await model.generateContent(prompt);
            const finalBriefing = result.response.text();
            */

            const finalBriefing = `
      This week: 3 things need your attention in ${wardData.wardName}

      1. ${wardData.problemArea.name} compliance dropped by ${wardData.problemArea.complianceDrop}
         Likely cause: ${wardData.problemArea.possibleCause}
         Action: Assign a high-rated kabadiwalla to cover ${wardData.problemArea.name}

      2. ${wardData.zeroPickupArea.name} — 0 verified pickups in ${wardData.zeroPickupArea.daysSinceLastPickup} days
         Action: Send RWA president an outreach message [draft ready]

      3. ${wardData.improvedArea.name} improved by ${wardData.improvedArea.complianceGrowth}
         Key driver: ${wardData.improvedArea.keyDriver}
         Action: Consider expanding coverage area
      `;

            console.log(`[MunicipalityBriefing] Generated briefing for ward ${wardId}:\n`, finalBriefing);

            // Step 4 — Deliver
            // await notificationService.municipalityBriefingReady(municipalityId, finalBriefing);

        } catch (error) {
            console.error("[MunicipalityBriefing] Error generating briefing:", error);
        }
    }
};
