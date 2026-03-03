export type PickupStatus = 'requested' | 'accepted' | 'arriving' | 'confirmed' | 'completed' | 'cancelled';
export type QualityRating = 'good' | 'acceptable' | 'poor';
export type PaymentStatus = 'pending' | 'released' | 'withheld' | 'failed';

export interface ScheduledWindow {
    start: string;
    end: string;
}

export interface LocationPoint {
    lat: number;
    lng: number;
    address?: string;
}

export interface KabadiwalaArrival {
    lat: number;
    lng: number;
    arrivedAt: string;
    dwellTimeMinutes: number;
}

export interface CrossReferenceResult {
    compositeScore: number;
    anomalyFlags: string[];
    processedAt: string;
}

export interface PickupRequest {
    _id: string;
    citizenId: string;
    kabadiwalaId?: string;
    reportId?: string;
    status: PickupStatus;
    scheduledWindow: ScheduledWindow;
    citizenLocation: LocationPoint;
    kabadiwalaArrival?: KabadiwalaArrival;
    citizenRating?: number;
    kabadiwalaQualityRating?: QualityRating;
    crossReferenceResult?: CrossReferenceResult;
    paymentStatus: PaymentStatus;
    paymentAmount?: number;
    cashbackAmount?: number;
    cancelReason?: string;
    createdAt: string;
    updatedAt: string;
}

/** Payload for confirming a pickup */
export interface ConfirmPickupPayload {
    qualityRating: QualityRating;
    notes?: string;
    arrivalLat: number;
    arrivalLng: number;
    dwellTimeMinutes: number;
}

/** Payload for requesting a pickup */
export interface RequestPickupPayload {
    kabadiwalaId: string;
    scheduledWindow: ScheduledWindow;
    citizenLocation: LocationPoint;
    reportId?: string;
}

/** Pickup with populated citizen/kabadiwalla info */
export interface PopulatedPickup extends PickupRequest {
    citizen?: {
        _id: string;
        username: string;
        email: string;
        citizenProfile?: {
            segregationScore: number;
        };
    };
    kabadiwala?: {
        _id: string;
        username: string;
        kabadiwalaProfile?: {
            isVerified: boolean;
        };
    };
}
