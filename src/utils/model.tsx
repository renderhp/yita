export type Player = {
    id: number;
    name: string;
    level: number;
    status: string;
    lastActionTime: number;
    battleStatsPrediction?: number;
    battleScorePrediction?: number;
}

export type BSPPrediction = {
    id: number;
    battleStatsPrediction: number;
    battleScorePrediction: number;
}