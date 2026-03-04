export type UserRole = 'citizen' | 'kabadiwalla' | 'municipality' | 'admin';

export interface IUser {
    _id: string;
    role: UserRole;
    phoneNumber?: string;
    email?: string;
    trustScore?: number;
    // ...other common fields used in req.user
}

export interface IPickup {
    _id: string;
    citizenId: string | IUser;
    kabadiwallaId?: string | IUser;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled';
    scheduledTime: Date;
    address: {
        street: string;
        city: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
}

export interface IReport {
    _id: string;
    reporterId: string | IUser;
    imageUrl: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    status: 'pending' | 'verified' | 'cleaned' | 'rejected';
}
