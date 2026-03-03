/** Standard API response wrapper */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    page: number;
    totalPages: number;
    total: number;
}

/** API error response */
export interface ApiError {
    code: string;
    message: string;
    field?: string;
}

/** Auth response from login/register */
export interface AuthResponse {
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        points: number;
        role: string;
    };
    jwt?: string;
}

/** Dashboard metrics for municipality */
export interface DashboardMetrics {
    totalVerifiedPickups: number;
    totalVerifiedPickupsChange: number;
    averageQualityScore: number;
    averageQualityScoreChange: number;
    complianceRate: number;
    complianceRateChange: number;
    activeKabadiwallas: number;
}

/** Analytics data point */
export interface AnalyticsDataPoint {
    date: string;
    value: number;
}

/** Street compliance data */
export interface StreetCompliance {
    street: string;
    verifiedPickups: number;
    avgQualityScore: number;
    unresolvedFlags: number;
    complianceRate: number;
}

/** Earnings summary */
export interface EarningsSummary {
    totalPickups: number;
    avgQualityScore: number;
    totalEarned: number;
    qualityBreakdown: {
        good: number;
        acceptable: number;
        poor: number;
    };
}

/** Anomaly flag */
export interface AnomalyFlag {
    _id: string;
    userId: string;
    userName: string;
    flagType: 'gps_spoof' | 'rating_inflation' | 'impossible_route' | 'velocity_attack' | 'collusion' | 'new_account_abuse';
    evidenceSummary: string;
    status: 'pending' | 'dismissed' | 'investigating' | 'suspended';
    internalNote?: string;
    createdAt: string;
}
