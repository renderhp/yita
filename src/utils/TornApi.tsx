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
            console.error("Failed to fetch faction members");
            return [];
        }
        const data: FactionMembersApiResponse = await response.json();
        if (data.error) {
            console.error(data.error);
            return [];
        }

        if (!data.members || !Array.isArray(data.members)) {
            console.error("API response did not contain a 'members' array or it was not in the expected format.", data);
            return [];
        }

        return data.members.map((member: TornApiMember) => ({
            id: member.id,
            name: member.name,
            level: member.level,
            status: member.status.description,
            lastActionTime: member.last_action.timestamp,
        })) as Player[];
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
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