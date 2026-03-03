const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculate the Haversine distance between two GPS points
 * @returns Distance in meters
 */
export function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_METERS * c;
}

/**
 * Check if a point is within a given radius of a center point
 */
export function isWithinRadius(
    point: { lat: number; lng: number },
    center: { lat: number; lng: number },
    radiusMeters: number
): boolean {
    const distance = haversineDistance(point.lat, point.lng, center.lat, center.lng);
    return distance <= radiusMeters;
}

/**
 * Check if a route of stops is physically achievable in the given time
 * @param stops - Array of GPS coordinates in order
 * @param totalMinutes - Total time claimed for the route
 * @param maxSpeedKmH - Maximum reasonable speed (default: 25 km/h for bicycle/foot)
 * @returns true if the route is plausible
 */
export function isPlausibleRoute(
    stops: Array<{ lat: number; lng: number }>,
    totalMinutes: number,
    maxSpeedKmH: number = 25
): boolean {
    if (stops.length < 2) return true;

    let totalDistanceMeters = 0;
    for (let i = 1; i < stops.length; i++) {
        totalDistanceMeters += haversineDistance(
            stops[i - 1].lat,
            stops[i - 1].lng,
            stops[i].lat,
            stops[i].lng
        );
    }

    const maxDistanceInTime = (maxSpeedKmH * 1000 * totalMinutes) / 60;
    return totalDistanceMeters <= maxDistanceInTime;
}

/**
 * Calculate total route distance in meters
 */
export function totalRouteDistance(stops: Array<{ lat: number; lng: number }>): number {
    let total = 0;
    for (let i = 1; i < stops.length; i++) {
        total += haversineDistance(
            stops[i - 1].lat,
            stops[i - 1].lng,
            stops[i].lat,
            stops[i].lng
        );
    }
    return total;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
