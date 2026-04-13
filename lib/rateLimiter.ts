const attempts = new Map<string, { count: number; firstAttempt: number }>();

export function checkBruteForce(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const entry = attempts.get(key);
    if (!entry) return; // no attempts yet

    const now = Date.now();
    if (now - entry.firstAttempt > windowMs) {
        // window expired, reset counter
        attempts.delete(key);
        return;
    }

    if (entry.count >= maxAttempts) {
        throw new Error('Too many failed login attempts. Please try again later.');
    }
}

export function recordFailedAttempt(key: string) {
    const now = Date.now();
    const entry = attempts.get(key);
    if (!entry) {
        attempts.set(key, { count: 1, firstAttempt: now });
    } else {
        if (now - entry.firstAttempt > 15 * 60 * 1000) {
            // reset window
            attempts.set(key, { count: 1, firstAttempt: now });
        } else {
            entry.count += 1;
        }
    }
}

export function resetAttempts(key: string) {
    attempts.delete(key);
}
