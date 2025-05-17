import { validateAPIKey } from "@/utils/TornApi";
import { Card, Button, Flex, Input, Field, Stack, Spinner } from "@chakra-ui/react";
import { useState } from "react";

type AuthProps = {
    setApiKey: (key: string) => void;
};

export function Auth(
    { setApiKey }: AuthProps,
) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogIn = async () => {
        setIsLoading(true);
        setError(null);
        const isValid = await validateAPIKey(value);
        setIsLoading(false);
        if (isValid) {
            setApiKey(value);
        } else {
            setError("Invalid API Key");
        }
    }
    return (
        <Flex
            height="100vh"
            align="center"
            justify="center"
        >
            <Card.Root maxW="sm">
                <Card.Header>
                    <Card.Title>Log In</Card.Title>
                    <Card.Description>
                        Please provide Public Torn API key to log in
                    </Card.Description>
                </Card.Header>
                <Card.Body>
                    <Stack gap="4" w="full">
                        <Field.Root invalid={!!error}>
                            <Field.Label>Public API Key</Field.Label>
                            <Input value={value} onChange={(e) => setValue(e.target.value)} />
                            <Field.ErrorText>{error}</Field.ErrorText>
                        </Field.Root>
                    </Stack>
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    <Button variant="solid"
                        onClick={handleLogIn}
                        disabled={!!isLoading}>
                        {isLoading ? <Spinner /> : "Log in"}
                    </Button>
                </Card.Footer>
            </Card.Root>
        </ Flex>
    );
}