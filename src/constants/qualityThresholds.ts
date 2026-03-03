/** Score tier boundaries */
export const SCORE_EXCELLENT = 90;
export const SCORE_GOOD = 70;
export const SCORE_ACCEPTABLE = 50;

/** Cashback rate multipliers based on composite score tier */
export const CASHBACK_RATES = {
    excellent: 1.0,   // 90-100: Full cashback
    good: 1.0,        // 70-89: Full cashback
    acceptable: 0.7,  // 50-69: 70% cashback
    poor: 0,           // <50: No cashback
} as const;

/** Kabadiwalla payment rate multipliers based on composite score tier */
export const PAYMENT_RATES = {
    excellent: 1.2,   // 90-100: 120% (includes quality bonus)
    good: 1.0,        // 70-89: Full rate
    acceptable: 0.8,  // 50-69: 80% rate
    poor: 0.6,         // <50: 60% rate
} as const;

/** Base payment amounts in INR */
export const BASE_RATES = {
    KABADIWALLA_PER_PICKUP_INR: 12,
    CITIZEN_CASHBACK_PER_PICKUP_INR: 4,
} as const;

/** Composite score signal weights */
export const SCORE_WEIGHTS = {
    GPS_MATCH: 25,
    DWELL_TIME: 25,
    CITIZEN_RATING: 25,
    KABADIWALLA_QUALITY: 25,
    TOTAL: 100,
} as const;

/** Get tier name from composite score */
export function getScoreTier(score: number): 'excellent' | 'good' | 'acceptable' | 'poor' {
    if (score >= SCORE_EXCELLENT) return 'excellent';
    if (score >= SCORE_GOOD) return 'good';
    if (score >= SCORE_ACCEPTABLE) return 'acceptable';
    return 'poor';
}

/** Get human-readable tier description */
export function getScoreTierDescription(score: number): string {
    const tier = getScoreTier(score);
    switch (tier) {
        case 'excellent': return 'Full rate + 20% quality bonus. Full cashback.';
        case 'good': return 'Full rate. Full cashback.';
        case 'acceptable': return '80% rate. 70% cashback. Pattern watch.';
        case 'poor': return '60% rate. No cashback. Flagged for review.';
    }
}
