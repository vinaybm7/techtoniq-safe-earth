// Calculate distance between two points in kilometers using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
// Calculate bearing between two points in degrees
const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    return (bearing + 360) % 360;
};
// Convert bearing to cardinal direction
const getCardinalDirection = (bearing) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((bearing %= 360) < 0 ? bearing + 360 : bearing / 22.5) % 16;
    return directions[index];
};
// This is a client-side only function that calls our API route
export const getNearbyFaultLines = async (lat, lng, radiusKm = 100) => {
    try {
        // Use the environment variable for the API base URL with a fallback
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const apiUrl = `${apiBaseUrl}/fault-lines`;
        const response = await fetch(`${apiUrl}?lat=${lat}&lng=${lng}&radius=${radiusKm}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch fault data');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching fault data:', error);
        // Return an empty array in case of error
        return [];
    }
};
