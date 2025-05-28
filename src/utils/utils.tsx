export function formatTimeAgo(timestamp: number | null | undefined): string {
    if (timestamp === null || timestamp === undefined || isNaN(timestamp)) {
        return 'N/A';
    }

    const now = new Date();
    const past = new Date(timestamp * 1000); // Convert Unix timestamp (seconds) to milliseconds
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 0) {
        return 'in the future';
    }

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const intervals = {
        day: 86400, // 60 * 60 * 24
        hour: 3600, // 60 * 60
        minute: 60,
    };

    if (diffInSeconds >= intervals.day) {
        const count = Math.floor(diffInSeconds / intervals.day);
        return `${count} day${count > 1 ? 's' : ''} ago`;
    }

    if (diffInSeconds >= intervals.hour) {
        const count = Math.floor(diffInSeconds / intervals.hour);
        return `${count} hr${count > 1 ? 's' : ''} ago`;
    }

    if (diffInSeconds >= intervals.minute) {
        const count = Math.floor(diffInSeconds / intervals.minute);
        return `${count} min${count > 1 ? 's' : ''} ago`;
    }

    return 'this should never happen lmao';
}