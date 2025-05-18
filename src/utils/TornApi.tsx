import type { Player } from "@/utils/model.tsx"

export async function getPlayerDetails(_apiKey: string, playerId: number) {
    return {
        "userID": playerId,
        "userName": "Testing",
        "lastActive": "10 minutes ago",
    } as Player
}

export async function validateAPIKey(apiKey: string) {
    try {
        const response = await fetch("https://api.torn.com/v2/user", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `ApiKey ${apiKey}`,
            },
        });
        if (!response.ok) {
            console.error("Invalid API Key");
            return false;
        };
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Fetch error:", error);
        return false;
    }
}