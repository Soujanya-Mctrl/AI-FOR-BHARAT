// Registers all cron jobs on server start
import './anomalyScan.job';
import './municipalityBriefing.job';
import './qualityRecalculation.job';
import './weeklyPayout.job';

console.log('[Jobs] All cron jobs registered.');
