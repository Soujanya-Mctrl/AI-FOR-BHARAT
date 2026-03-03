/** Navigation type definitions for typed Expo Router */
export type RootStackParamList = {
    index: undefined;
    '(auth)': undefined;
    '(citizen)': undefined;
    '(kabadiwalla)': undefined;
    '(municipality)': undefined;
    '(admin)': undefined;
    '+not-found': undefined;
};

export type AuthStackParamList = {
    login: undefined;
    register: undefined;
    onboarding: undefined;
};

export type CitizenTabParamList = {
    index: undefined;
    report: undefined;
    pickup: undefined;
    profile: undefined;
    training: undefined;
    facilities: undefined;
};

export type CitizenPickupParamList = {
    '[id]': { id: string };
};

export type KabadiwalaTabParamList = {
    index: undefined;
    earnings: undefined;
    onboarding: undefined;
};

export type KabadiwalaConfirmParamList = {
    '[id]': { id: string };
};

export type MunicipalityStackParamList = {
    index: undefined;
    reports: undefined;
    analytics: undefined;
};

export type AdminStackParamList = {
    index: undefined;
    flags: undefined;
    kabadiwallas: undefined;
};
