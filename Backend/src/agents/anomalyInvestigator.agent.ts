import { GoogleGenerativeAI } from '@google/generative-ai';
import InvestigationModel from '../models/investigation.model.js';
import { verdictExecutorService } from '../service/verdictExecutor.service.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const anomalyInvestigatorAgent = {
    investigateAnomaly: async (investigationId: string) => {
        try {
            const investigation = await InvestigationModel.findById(investigationId);
            if (!investigation) throw new Error("Investigation not found");

            investigation.status = 'in_progress';
            await investigation.save();

            const userId = investigation.targetUser.toString();

            // Step 1 - Build Context
            // MOCK: In production, fetch pickup history, GPS traces, associated accounts etc.
            const context = {
                signals: investigation.signals,
                userAgeDays: 14,
                totalPickups: 45,
                associatedAccountsCount: 0,
                pincodeFraudRate: 0.12
            };

            // Step 2 & 3 - Analyze with Gemini (Mocked prompt structure for MVP)
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
        You are a Trust and Safety AI investigator for a waste management app.
        Analyze the following context regarding a flagged user.
        Context: ${JSON.stringify(context)}
        
        Determine if this behavior is LEGITIMATE, SUSPICIOUS, or FRAUDULENT.
        Return your analysis STRICTLY as a JSON object matching this schema:
        {
          "result": "LEGITIMATE" | "SUSPICIOUS" | "FRAUDULENT",
          "confidence": number (0-100),
          "reasoning": string,
          "recommendedAction": "DISMISS" | "WARN_USER" | "REDUCE_SCORE" | "SUSPEND_PENDING_REVIEW" | "BAN",
          "specificEvidence": string[],
          "monitoringRecommendation": string
        }
      `;

            // const result = await model.generateContent(prompt);
            // const responseText = result.response.text();
            // const verdict = JSON.parse(responseText.replace(/```json|```/gi, ''));

            // Stubbed Verdict for testing
            const verdict = {
                result: 'SUSPICIOUS',
                confidence: 85,
                reasoning: 'User has triggered multiple high velocity signals within 14 days of account creation.',
                recommendedAction: 'SUSPEND_PENDING_REVIEW',
                specificEvidence: ['45 pickups in 14 days', 'HIGH_VELOCITY_HIGH_SEVERITY flag present'],
                monitoringRecommendation: 'Monitor for connected accounts using same device ID'
            };

            console.log(`[AnomalyInvestigator] Reached verdict for ${userId}: ${verdict.result} -> ${verdict.recommendedAction}`);

            // Step 4 - Execute
            await verdictExecutorService.executeVerdict(investigationId, verdict);

        } catch (error) {
            console.error("[AnomalyInvestigator] Error investigating anomaly:", error);
            await InvestigationModel.findByIdAndUpdate(investigationId, { status: 'failed' });
        }
    }
};
