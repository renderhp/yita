import { useEffect, useState } from "react";
import type { Player } from "@/utils/model"
import { TargetsTable } from "@/components/TargetsTable";
import { getTargets, saveTargets } from "@/utils/firebase"
import {
    Button,
    HStack,
    Spacer,
    useDisclosure,
    VStack,
    Text,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster"
import { AddTargetsDialogue } from "@/components/AddTargetsDialogue";
import { RemoveAllTargetsAlert } from "@/components/RemoveAllTargetsAlert";

type TargetsProps = {
    apiKey: string;
};

export function Targets({ apiKey }: TargetsProps) {
    const [targets, setTargets] = useState<Player[]>([]);
    const { open: isAddTargetsDialogueOpen, onOpen: onOpenAddTargetsDialogue, onClose: onCloseAddTargetsDialogue } = useDisclosure();
    const { open: isRemoveAllAlertOpen, onOpen: onOpenRemoveAllAlert, onClose: onCloseRemoveAllAlert } = useDisclosure();

    useEffect(() => {
        const fetchTargets = async () => {
            const targets = await getTargets(apiKey);
            setTargets(targets);
        };

        fetchTargets();
    }, [apiKey]);

    const onTargetsPicked = async (pickedTargets: Player[]) => {
        let updatedTargets;
        setTargets((prevTargets) => {
            const playerMap = new Map<Player['id'], Player>();
            for (const player of prevTargets) {
                playerMap.set(player.id, player);
            }
            for (const player of pickedTargets) {
                playerMap.set(player.id, player);
            }
            updatedTargets = Array.from(playerMap.values());
            return Array.from(playerMap.values());
        }
        );
        onCloseAddTargetsDialogue();

        if (updatedTargets) { // Ensure updatedTargets is defined
            try {
                await saveTargets(apiKey, updatedTargets);
                toaster.create({
                    title: `Added ${pickedTargets.length} Targets`,
                    type: "success",
                });
            } catch {
                toaster.create({
                    title: "Error Saving Targets",
                    type: "error",
                });
            }
        }
    }

    const handleConfirmRemoveAllTargets = async () => {
        onCloseRemoveAllAlert();

        try {
            setTargets([]);
            await saveTargets(apiKey, []);
            toaster.create({
                title: "All Targets Removed",
                type: "success",
            })
        } catch (error) {
            console.error("Error removing all targets:", error);
            toaster.create({
                title: "Error Removing Targets",
                type: "error",
            })
        }
    };

    return (
        <VStack>
            <HStack w="100%">
                <Spacer />
                <Button variant="subtle" onClick={onOpenAddTargetsDialogue}>
                    Add from Faction
                </Button>
            </HStack>
            {targets.length > 0 ? (
                <TargetsTable targets={targets} />
            ) : (
                <Text>No targets yet. Click "Add from Faction" to get started.</Text>
            )}
            {targets.length > 0 && (
                <HStack w="100%" justifyContent="flex-end" mt={4}>
                    <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={onOpenRemoveAllAlert}
                    >
                        Remove All Targets
                    </Button>
                </HStack>
            )}
            <AddTargetsDialogue
                isOpen={isAddTargetsDialogueOpen}
                onClose={onCloseAddTargetsDialogue}
                onTargetsPicked={onTargetsPicked}
                apiKey={apiKey}
            />
            <RemoveAllTargetsAlert
                isOpen={isRemoveAllAlertOpen}
                onClose={onCloseRemoveAllAlert}
                onConfirm={handleConfirmRemoveAllTargets}
            />
            <Toaster />
        </VStack>
    );
}
