// functions/src/index.ts

import { onRequest, HttpsOptions } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import fetch from "node-fetch";

const BSP_SERVER_BASE_URL = "http://www.lol-manager.com/api";
const DEFAULT_IDENTIFIER = "i_dont_think_im_abusing_it_but_contact_renderhp_3399414_if_i_am";

// Helper function to fetch prediction for a single ID
async function fetchSingleBspPrediction(bspApiKey: string, targetId: string, scriptVersion: string): Promise<any> {
    const externalApiUrl = `${BSP_SERVER_BASE_URL}/battlestats/${bspApiKey}/${targetId}/${scriptVersion}`;
    try {
        logger.info(`[PID:${process.pid}] Fetching prediction for Target ID: ${targetId} from ${externalApiUrl}`);
        const externalApiResponse = await fetch(externalApiUrl, {
            method: "GET",
            headers: { "accept": "application/json" },
            timeout: 15000, // 15 second timeout for each external request
        });

        let responseData;
        const contentType = externalApiResponse.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            responseData = await externalApiResponse.json();
        } else {
            responseData = await externalApiResponse.text(); // Fallback to text
            logger.warn(`[PID:${process.pid}] Response for ${targetId} was not JSON. Status: ${externalApiResponse.status}. Content-Type: ${contentType}. Body: ${responseData}`);
            // If the response was supposed to be JSON, even if status is OK, treat as an issue from upstream
            if (externalApiResponse.ok) {
                return { targetId, error: true, status: externalApiResponse.status, message: "Non-JSON response from upstream", data: responseData };
            }
        }

        if (!externalApiResponse.ok) {
            logger.warn(`[PID:${process.pid}] External API error for ${targetId}: ${externalApiResponse.status}`, responseData);
            return { targetId, error: true, status: externalApiResponse.status, data: responseData };
        }
        return { targetId, error: false, data: responseData };

    } catch (error) {
        logger.error(`[PID:${process.pid}] Exception fetching prediction for ${targetId}:`, error);
        return { targetId, error: true, message: error instanceof Error ? error.message : "Unknown fetch error" };
    }
}

// Define runtime options for the v2 function
const httpsFunctionOptions: HttpsOptions = {
    timeoutSeconds: 10,
    memory: "512MiB",
    // cors: ["https://your-app-domain.web.app"]
    cors: true,
    maxInstances: 5,
};

export const getBspPredictionsForMultiple = onRequest(httpsFunctionOptions, async (request, response) => {
    const bspApiKey = request.query.bspApiKey as string;
    const targetIdsQuery = request.query.targetIds as string; // Expect comma-separated string: "id1,id2,id3"

    if (!bspApiKey || !targetIdsQuery) {
        response.status(400).send("Missing required query parameters: bspApiKey, targetIds (comma-separated)");
        return;
    }

    const targetIdArray = targetIdsQuery.split(",")
        .map(id => id.trim())
        .filter(id => id && !isNaN(Number(id))); // Split, trim, remove empty, ensure they are numbers

    if (targetIdArray.length === 0) {
        response.status(400).send("targetIds parameter was empty or contained no valid numeric IDs.");
        return;
    }

    const MAX_IDS = 100;
    if (targetIdArray.length > MAX_IDS) {
        response.status(400).send(`Too many targetIds requested. Maximum is ${MAX_IDS}.`);
        return;
    }

    logger.info(`[PID:${process.pid}] Processing request for ${targetIdArray.length} target IDs. API Key: ${bspApiKey}`);

    try {
        const allPredictionPromises = targetIdArray.map(id =>
            fetchSingleBspPrediction(bspApiKey, id, DEFAULT_IDENTIFIER)
        );

        const results = await Promise.allSettled(allPredictionPromises);

        const formattedResults = results.map(result => {
            if (result.status === "fulfilled") {
                return result.value;
            } else {
                // result.reason contains the error for a rejected promise
                logger.error(`[PID:${process.pid}] A prediction promise was rejected: `, result.reason);
                return {
                    // We don't know which targetId this was for if the promise itself failed catastrophically
                    // before fetchSingleBspPrediction could tag it.
                    targetId: "unknown_due_to_promise_rejection",
                    error: true,
                    message: result.reason instanceof Error ? result.reason.message : "A sub-request promise rejected unexpectedly"
                };
            }
        });

        response.status(200).json(formattedResults);

    } catch (error) { // Catch errors in the main orchestration logic
        logger.error(`[PID:${process.pid}] Critical error in getBspPredictionsForMultiple handler:`, error);
        if (error instanceof Error) {
            response.status(500).send(`Internal server error: ${error.message}`);
        } else {
            response.status(500).send("Internal server error while processing multiple predictions.");
        }
    }
});