import type { Player } from "@/utils/model.tsx"

interface TornApiMember {
    id: number;
    name: string;
    level: number;
    status: {
        description: string;
    };
    last_action: {
        timestamp: number; // Unix timestamp
    };
}

// 2. Define the structure of the overall API response from this endpoint
interface FactionMembersApiResponse {
    members?: TornApiMember[];

    error?: {
        code: number;
        error: string;
    };
}

export async function getFactionMembers(apiKey: string, factionId: number) {
    try {
        const response = await fetch(`https://api.torn.com/v2/faction/${factionId}?selections=members&key=${apiKey}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `ApiKey ${apiKey}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch faction members");
        }
        const data: FactionMembersApiResponse = await response.json();
        if (data.error) {
            throw new Error(`API Error: ${data.error.error}`);
        }

        if (!data.members || !Array.isArray(data.members)) {
            throw new Error("Invalid API response format");
        }

        return data.members.map((member: TornApiMember) => ({
            id: member.id,
            name: member.name,
            level: member.level,
            status: member.status.description,
            lastActionTime: member.last_action.timestamp,
        })) as Player[];
    } catch (error) {
        throw new Error(`${error instanceof Error ? error.message : "Unknown error"}`);
    }
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