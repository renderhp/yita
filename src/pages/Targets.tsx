import { useEffect, useState } from "react";
import { getPlayerDetails } from "@/utils/TornApi"
import type { Player, Target } from "@/utils/model"
import { TargetsTable } from "@/components/TargetsTable";
import { getTargets } from "@/utils/firebase"

export function Targets() {
    const [ids, setIds] = useState<Target[]>([]);
    useEffect(() => {
        const fetchIds = async () => {
            const ids = await getTargets("7Hvo4MIPvbDZwh2r");
            setIds(ids);
        };

        fetchIds();
    }, [])

    const [targets, setTargets] = useState<Player[]>([]);
    useEffect(() => {
        const fetchTargets = async () => {
            const targetPromises = ids.map(async (target) => {
                return await getPlayerDetails("7Hvo4MIPvbDZwh2r", target.userID);
            });
            const resolvedTargets = await Promise.all(targetPromises);
            setTargets(resolvedTargets);
        };

        fetchTargets();
    }, [ids])

    return <TargetsTable targets={targets} />;
}