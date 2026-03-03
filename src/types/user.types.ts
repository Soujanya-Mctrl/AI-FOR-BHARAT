export interface KabadiwalaProfile {
    serviceAreaPincodes: string[];
    isVerified: boolean;
    upiId?: string;
    totalConfirmedPickups: number;
    accuracyScore: number;
    onTimeArrivalRate: number;
    routeCompletionRate: number;
}

export interface CitizenProfile {
    segregationScore: number;
    currentStreak: number;
    longestStreak: number;
    cashbackBalance: number;
    totalCashbackEarned: number;
    totalVerifiedPickups: number;
}

export type UserRole = 'citizen' | 'kabadiwalla' | 'municipality' | 'admin';

export interface User {
    _id: string;
    id?: string;
    username: string;
    email: string;
    points: number;
    role: UserRole;
    pushNotificationToken?: string | null;
    trainingComplete: boolean;
    reliabilityScore: number;
    kabadiwalaProfile?: KabadiwalaProfile;
    citizenProfile?: CitizenProfile;
    createdAt: string;
    updatedAt: string;
}

/** Minimal user data returned from auth endpoints */
export interface AuthUser {
    id: string;
    username: string;
    email: string;
    points: number;
    role: UserRole;
}

/** User with distance information for kabadiwalla search */
export interface NearbyKabadiwalla extends User {
    distance: number; // meters
    estimatedArrivalMinutes: number;
}
