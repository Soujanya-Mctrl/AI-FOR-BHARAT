export const Config = {
    /** Maximum distance in meters between citizen and kabadiwalla GPS for valid pickup */
    GPS_MATCH_RADIUS_METERS: 50,

    /** Minimum dwell time in minutes kabadiwalla must spend at pickup location */
    MIN_DWELL_TIME_MINUTES: 3,

    /** Maximum gap in minutes between scheduled window end and kabadiwalla arrival */
    MAX_PICKUP_TIME_GAP_MINUTES: 120,

    /** Minimum composite score for full payment release */
    PAYMENT_RELEASE_THRESHOLD_SCORE: 70,

    /** Search radius for finding nearby kabadiwallas in kilometers */
    KABADIWALLA_SEARCH_RADIUS_KM: 2,

    /** Maximum image size in KB before upload */
    IMAGE_MAX_SIZE_KB: 800,

    /** Polling interval for pickup status updates in milliseconds */
    PICKUP_STATUS_POLL_INTERVAL_MS: 30000,

    /** Maximum number of pickups per hour before velocity alert triggers */
    ANOMALY_VELOCITY_MAX_PICKUPS_PER_HOUR: 10,

    /** Minimum pickups needed to establish a behavioral baseline */
    BASELINE_PICKUPS_REQUIRED: 10,

    /** Threshold for rating divergence detection (correlation coefficient) */
    RATING_DIVERGENCE_THRESHOLD: 0.3,

    /** API base URL from environment */
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000',

    /** Google Maps API key */
    GOOGLE_MAPS_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '',

    /** Cloudinary cloud name */
    CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
} as const;
