export const signalCollectorService = {
    queueForInvestigation: async (pickupId: string, kabadiwalaId: string, citizenId: string) => {
        console.log(`[SignalCollector] Mock tracking signals for ${kabadiwalaId}`);
    }
};
