import { useEffect, useState } from "react";
import type { Player } from "@/utils/model"
import { TargetsTable } from "@/components/TargetsTable";
import { getTargets } from "@/utils/firebase"

type TargetsProps = {
    apiKey: string;
};

export function Targets({ apiKey }: TargetsProps) {
    const [targets, setTargets] = useState<Player[]>([]);
    useEffect(() => {
        const fetchIds = async () => {
            const targets = await getTargets(apiKey);
            setTargets(targets);
        };

        fetchIds();
    }, []);

    return <TargetsTable targets={targets} />;
}
