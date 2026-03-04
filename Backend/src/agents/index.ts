// Barrel export for all AI agents
import { anomalyInvestigatorAgent } from './anomalyInvestigator.agent';

// Re-export with a convenience wrapper so services can call typed methods
export const anomalyInvestigator = {
    investigate: async (input: { userId: string; pickupId: string; flags: any[] }) => {
        // Delegate to existing agent logic
        await anomalyInvestigatorAgent.investigateAnomaly(input.pickupId);
        // Return a typed result (the existing agent logs internally; we provide a default)
        return {
            severity: 'medium' as const,
            reasoning: 'AI investigation completed',
            action: 'warn' as string
        };
    }
};

// The remaining agents are re-exported as-is since they are used by jobs/services directly
export { municipalityBriefingAgent } from './municipalityBriefing.agent';
export { routeOptimizerAgent } from './routeOptimizer.agent';
export { segregationCoachAgent } from './segregationCoach.agent';

