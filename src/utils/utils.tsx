import type { BSPPrediction } from "@/utils/model";

const CLOUD_FUNCTION_PROXY_URL = "https://us-central1-yita-e9413.cloudfunctions.net/getBspPredictionsForMultiple"

export async function getBspPredictionsForMultiple(
    bspApiKey: string,
    targetIds: (string | number)[],
): Promise<BSPPrediction[]> {
    if (!targetIds || targetIds.length === 0) {
        console.log("[Frontend] No target IDs provided to getBspPredictionsForMultiple.");
        return [];
    }

    const queryParams = new URLSearchParams({
        bspApiKey: bspApiKey,
        targetIds: targetIds.map(String).join(','),
    });
    const url = `${CLOUD_FUNCTION_PROXY_URL}?${queryParams.toString()}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "accept": "application/json" },
        });

        const responseText = await response.text(); // Get text first to avoid JSON parse error on bad responses

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(responseText);
                throw new Error(errorJson.message || `Failed via proxy. Status: ${response.status}. Details: ${responseText}`);
            } catch {
                throw new Error(`Failed via proxy. Status: ${response.status}. Details: ${responseText}`);
            }
        }

        try {
            console.log(responseText)
            console.log("Parsed responseText:", JSON.parse(responseText));

            // Some any *wink wink*, can't be bothered to type this properly right now
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const results = JSON.parse(responseText).map((result: any) => {
                const data = JSON.parse(result.data);
                return {
                    id: data.TargetId,
                    battleStatsPrediction: data.TBS,
                    battleScorePrediction: data.Score,
                } as BSPPrediction; // Ensure the result matches the BSPPrediction type
            });
            return results as BSPPrediction[];
        } catch (e) {
            console.error("[Frontend] Failed to parse JSON response from proxy:", responseText, e);
            throw new Error("Failed to parse JSON response from proxy.");
        }

    } catch (error) {
        console.error("[Frontend] Network or other error calling getBspPredictionsForMultiple via proxy:", error);
        throw error;
    }
}

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

export function formatBattleStats(num: number | undefined): string {
    const SUFFIXES = ["", "k", "m", "b", "t", "q"];
    if (num === null || num === undefined || isNaN(num) || num <= 0) {
        return "N/A"; // Or however you want to handle invalid input
    }

    const tier = Math.floor(Math.log10(num) / 3);

    const suffix = SUFFIXES[tier];
    const divisor = Math.pow(1000, tier);
    const scaledNum = num / divisor;

    let formattedNum: string;

    const fixed = scaledNum.toFixed(2);
    if (parseFloat(fixed) % 1 === 0) {
        formattedNum = String(Math.floor(parseFloat(fixed)));
    } else {
        formattedNum = fixed.replace(/\.0+$/, "").replace(/(\.[1-9])0+$/, "$1");
    }
    return `${formattedNum}${suffix}`;
}