import {
    BASE_RATES,
    CASHBACK_RATES,
    getScoreTier,
    PAYMENT_RATES,
    SCORE_WEIGHTS,
} from '@/constants/qualityThresholds';

export interface CompositeScoreSignals {
    gpsMatch: boolean;
    dwellSufficient: boolean;
    citizenRating: number; // 1-5
    kabadiwalaRating: string; // 'good' | 'acceptable' | 'poor'
}

/**
 * Calculate the composite trust score (0-100) from the four trust signals
 */
export function calculateCompositeScore(signals: CompositeScoreSignals): number {
    let score = 0;

    // Signal 1: GPS Match (25 points)
    if (signals.gpsMatch) {
        score += SCORE_WEIGHTS.GPS_MATCH;
    }

    // Signal 2: Dwell Time (25 points)
    if (signals.dwellSufficient) {
        score += SCORE_WEIGHTS.DWELL_TIME;
    }

    // Signal 3: Citizen Rating (25 points — proportional to rating)
    if (signals.citizenRating >= 4) {
        score += SCORE_WEIGHTS.CITIZEN_RATING;
    } else if (signals.citizenRating >= 3) {
        score += Math.round(SCORE_WEIGHTS.CITIZEN_RATING * 0.6);
    } else if (signals.citizenRating >= 2) {
        score += Math.round(SCORE_WEIGHTS.CITIZEN_RATING * 0.3);
    }

    // Signal 4: Kabadiwalla Quality Rating (25 points)
    if (signals.kabadiwalaRating === 'good') {
        score += SCORE_WEIGHTS.KABADIWALLA_QUALITY;
    } else if (signals.kabadiwalaRating === 'acceptable') {
        score += Math.round(SCORE_WEIGHTS.KABADIWALLA_QUALITY * 0.6);
    } else if (signals.kabadiwalaRating === 'poor') {
        score += Math.round(SCORE_WEIGHTS.KABADIWALLA_QUALITY * 0.2);
    }

    return Math.min(score, SCORE_WEIGHTS.TOTAL);
}

/**
 * Calculate citizen cashback amount based on composite score
 */
export function getCashbackAmount(baseINR: number = BASE_RATES.CITIZEN_CASHBACK_PER_PICKUP_INR, score: number): number {
    const tier = getScoreTier(score);
    return Math.round(baseINR * CASHBACK_RATES[tier] * 100) / 100;
}

/**
 * Calculate kabadiwalla payment amount based on composite score
 */
export function getPaymentAmount(baseINR: number = BASE_RATES.KABADIWALLA_PER_PICKUP_INR, score: number): number {
    const tier = getScoreTier(score);
    return Math.round(baseINR * PAYMENT_RATES[tier] * 100) / 100;
}

/**
 * Map quality rating string to numeric value for correlation
 */
export function qualityRatingToNumber(rating: string): number {
    switch (rating) {
        case 'good': return 5;
        case 'acceptable': return 3;
        case 'poor': return 1;
        default: return 0;
    }
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 * Used for mutual rating divergence detection
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 3) return 0;

    const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;
        numerator += dx * dy;
        denomX += dx * dx;
        denomY += dy * dy;
    }

    const denominator = Math.sqrt(denomX * denomY);
    if (denominator === 0) return 0;

    return numerator / denominator;
}
