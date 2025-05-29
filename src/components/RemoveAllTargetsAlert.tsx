import {
    Button,
    Dialog,
    Portal,
    Text,
} from '@chakra-ui/react';

interface RemoveAllTargetsAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function RemoveAllTargetsAlert({
    isOpen,
    onClose,
    onConfirm,
}: RemoveAllTargetsAlertProps) {
    return (
        <Dialog.Root
            open={isOpen}
            size="md"
            placement="center"
            motionPreset="slide-in-bottom"
            lazyMount
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Remove All Targets</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                Are you sure you want to remove all targets? This action cannot be undone.
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={onConfirm} ml={3}>
                                Remove All
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}