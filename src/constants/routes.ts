/** Typed route constants for Expo Router navigation */
export const Routes = {
    // Auth
    AUTH_LOGIN: '/(auth)/login' as const,
    AUTH_REGISTER: '/(auth)/register' as const,
    AUTH_ONBOARDING: '/(auth)/onboarding' as const,

    // Citizen
    CITIZEN_HOME: '/(citizen)' as const,
    CITIZEN_REPORT: '/(citizen)/report' as const,
    CITIZEN_PICKUP: '/(citizen)/pickup' as const,
    CITIZEN_PROFILE: '/(citizen)/profile' as const,
    CITIZEN_TRAINING: '/(citizen)/training' as const,
    CITIZEN_FACILITIES: '/(citizen)/facilities' as const,

    // Kabadiwalla
    KABADIWALLA_HOME: '/(kabadiwalla)' as const,
    KABADIWALLA_EARNINGS: '/(kabadiwalla)/earnings' as const,
    KABADIWALLA_ONBOARDING: '/(kabadiwalla)/onboarding' as const,

    // Municipality
    MUNICIPALITY_HOME: '/(municipality)' as const,
    MUNICIPALITY_REPORTS: '/(municipality)/reports' as const,
    MUNICIPALITY_ANALYTICS: '/(municipality)/analytics' as const,

    // Admin
    ADMIN_HOME: '/(admin)' as const,
    ADMIN_FLAGS: '/(admin)/flags' as const,
    ADMIN_KABADIWALLAS: '/(admin)/kabadiwallas' as const,
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];
