export type ReportCategory = 'plastic' | 'biodegradable' | 'hazardous' | 'glass' | 'metal' | 'paper' | 'other';
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'verified';
export type VerificationStatus = 'pending' | 'kabadiwalla_confirmed' | 'cross_referenced' | 'verified' | 'flagged' | 'rejected';
export type QualityRating = 'good' | 'acceptable' | 'poor';

export interface GpsVerification {
    citizenLat: number;
    citizenLng: number;
    registeredLat: number;
    registeredLng: number;
    distanceMeters: number;
    passed: boolean;
}

export interface KabadiwalaConfirmation {
    kabadiwalaId: string;
    confirmedAt: string;
    arrivalLat: number;
    arrivalLng: number;
    dwellTimeMinutes: number;
    qualityRating: QualityRating;
    notes?: string;
}

export interface CrossReference {
    locationMatch: boolean;
    timeGapMinutes: number;
    timeGapPlausible: boolean;
    dwellTimeSufficient: boolean;
    ratingCorrelation: number;
    compositeScore: number;
    anomalyFlags: string[];
}

export interface WasteReport {
    _id: string;
    user: string;
    username: string;
    title: string;
    description: string;
    location: string;
    category: ReportCategory;
    image: string;
    content: string;
    points: number;
    status: ReportStatus;
    priority: 'low' | 'medium' | 'high';
    votes: number;
    // New verification fields
    verificationStatus: VerificationStatus;
    gpsVerification?: GpsVerification;
    kabadiwalaConfirmation?: KabadiwalaConfirmation;
    crossReference?: CrossReference;
    qualityScore?: number;
    cashbackAwarded?: number;
    kabadiwalaPayment?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ClassificationResult {
    wasteType: string;
    emoji: string;
    pointsAwarded: number;
    confidence?: number;
}
