import { Box, Tabs } from "@chakra-ui/react"
import { GiHumanTarget } from "react-icons/gi";
import { FaPaperPlane } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { Icon } from "@chakra-ui/react"
import { Targets } from "./Targets";
import { Settings } from "./Settings";

type MainContainerProps = {
    apiKey: string;
};

export function MainContainer({ apiKey }: MainContainerProps) {
    return (
        <Box
            w="100%"
            h="100vh"
            display="flex"
            alignContent="center"
            justifyContent="center"
            margin="8px"
        >
            <Tabs.Root
                defaultValue="targets"
                variant="plain"
            >
                <Box
                    alignContent="center"
                    justifyContent="center"
                    display="flex"
                >
                    <Tabs.List bg="bg.muted" rounded="l3" p="1" alignSelf="center">
                        <Tabs.Trigger value="targets">
                            <Icon size="md"><GiHumanTarget /></Icon>
                            Targets
                        </Tabs.Trigger>
                        <Tabs.Trigger value="traffic" disabled={true}>
                            <Icon size="sm"><FaPaperPlane /></Icon>
                            Air Traffic Control
                        </Tabs.Trigger>
                        <Tabs.Trigger value="settings">
                            <Icon size="sm"><CiSettings /></Icon>
                            Settings
                        </Tabs.Trigger>
                        <Tabs.Indicator rounded="l2" />
                    </Tabs.List>
                </Box>
                <Box
                    display="flex"
                    alignContent="center"
                    justifyContent="center"
                >
                    <Tabs.Content value="targets"><Targets apiKey={apiKey} /></Tabs.Content>
                    <Tabs.Content value="traffic">Not Implemented Yet</Tabs.Content>
                    <Tabs.Content value="settings"><Settings /></Tabs.Content>
                </Box>
            </Tabs.Root>
        </Box>
    );
}
