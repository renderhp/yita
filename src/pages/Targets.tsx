import { useEffect, useState } from "react";
import type { Player } from "@/utils/model"
import { TargetsTable } from "@/components/TargetsTable";
import { getTargets } from "@/utils/firebase"
import { Button, HStack, Spacer, VStack } from "@chakra-ui/react";
import { AddTargetsDialogue } from "@/components/AddTargetsDialogue";

type TargetsProps = {
    apiKey: string;
};

export function Targets({ apiKey }: TargetsProps) {
    const [targets, setTargets] = useState<Player[]>([]);
    const [addTargetsDialogOpen, setAddTargetsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchIds = async () => {
            const targets = await getTargets(apiKey);
            setTargets(targets);
        };

        fetchIds();
    }, [apiKey]);

    const handleAddFromFactionClicked = () => {
        setAddTargetsDialogOpen(true);
    }

    const onTargetsPicked = (targets: Player[]) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        setAddTargetsDialogOpen(false);
    }

    return (
        <VStack>
            <HStack w="100%">
                <Spacer />
                <Button variant="subtle" onClick={handleAddFromFactionClicked}>
                    Add from Faction
                </Button>
            </HStack>
            <TargetsTable targets={targets} />
            <AddTargetsDialogue
                isOpen={addTargetsDialogOpen}
                onClose={() => setAddTargetsDialogOpen(false)}
                onTargetsPicked={onTargetsPicked}
                apiKey={apiKey}
            />
        </VStack>
    );
}
