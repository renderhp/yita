import type { Player } from "@/utils/model";
import { getFactionMembers } from "@/utils/TornApi";
import { Box, Button, Dialog, Group, HStack, Input, Portal, Spacer, VStack } from "@chakra-ui/react"
import { useState } from "react";
import { TargetsTable } from "./TargetsTable";


type AddTargetsDialogueProps = {
    isOpen: boolean;
    onClose: () => void;
    onTargetsPicked: (targets: Player[]) => void;
    apiKey: string;
};

export function AddTargetsDialogue({
    isOpen,
    onClose,
    onTargetsPicked,
    apiKey,
}: AddTargetsDialogueProps) {
    const [factionId, setFactionId] = useState("");
    const [factionMembers, setFactionMembers] = useState<Player[]>([]);
    const [selectedTargets, setSelectedTargets] = useState<Set<Player>>(new Set());

    const handleLoadFaction = async () => {
        const members = await getFactionMembers(apiKey, parseInt(factionId));
        setFactionMembers(members);
    }

    const handlePlayerRowClick = (player: Player) => {
        const newSelectedTargets = new Set(selectedTargets);
        if (newSelectedTargets.has(player)) {
            newSelectedTargets.delete(player);
        }
        else {
            newSelectedTargets.add(player);
        }
        setSelectedTargets(newSelectedTargets);
    }

    const handleSubmit = () => {
        setFactionId("");
        setFactionMembers([]);
        onTargetsPicked([...selectedTargets]);
        setSelectedTargets(new Set());
    }

    return (
        <Dialog.Root lazyMount open={isOpen} size="cover" placement="center" motionPreset="slide-in-bottom">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Add Targets from Faction</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body flexGrow={1} overflow="hidden">
                            <VStack h="100%" align="stretch">
                                <HStack minW="200px" w="100%">
                                    <Group attached w="full" maxW="sm">
                                        <Input
                                            flex="1"
                                            type="number"
                                            placeholder="Faction ID"
                                            onChange={(e) => setFactionId(e.target.value)}
                                            value={factionId}
                                        />
                                        <Button
                                            bg="bg.subtle"
                                            variant="outline"
                                            onClick={() => handleLoadFaction()}
                                            disabled={!factionId.trim()}
                                        >
                                            Load
                                        </Button>
                                    </Group>
                                    <Spacer />
                                </HStack>
                                <Box flexGrow={1} overflowY="auto" borderWidth="1px" borderRadius="md">
                                    <TargetsTable targets={factionMembers} isSelectable={true} selectedTargets={selectedTargets} onPlayerRowClick={handlePlayerRowClick} />
                                </Box>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button variant="solid" onClick={handleSubmit}>Add</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}