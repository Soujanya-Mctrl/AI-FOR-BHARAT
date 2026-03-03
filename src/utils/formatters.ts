/**
 * Format a number as Indian Rupees (INR)
 * @example formatINR(1234) → '₹1,234'
 */
export function formatINR(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format distance in human-readable format
 * @example formatDistance(1500) → '1.5 km'
 * @example formatDistance(450) → '450 m'
 */
export function formatDistance(meters: number): string {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
}

/**
 * Format a date as a relative time string
 * @example formatTimeAgo('2024-01-01T00:00:00Z') → '2 hours ago'
 */
export function formatTimeAgo(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHrs < 24) return `${diffHrs} ${diffHrs === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`;
    return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Format a time window
 * @example formatWindow('07:00', '09:00') → '7:00 – 9:00 AM'
 */
export function formatWindow(start: string | Date, end: string | Date): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startTime = startDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    const endTime = endDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${startTime} – ${endTime}`;
}

/**
 * Format a score out of 100
 * @example formatScore(87) → '87/100'
 */
export function formatScore(score: number): string {
    return `${Math.round(score)}/100`;
}

/**
 * Format a date as a short string
 * @example formatDate('2024-01-15') → '15 Jan 2024'
 */
export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Format a percentage
 * @example formatPercentage(0.85) → '85%'
 */
export function formatPercentage(value: number): string {
    return `${Math.round(value * 100)}%`;
}
