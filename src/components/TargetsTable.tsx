import { Table } from "@chakra-ui/react";
import type { Player } from "@/utils/model"

type TargetsTableProps = {
    targets: Player[],
};

export function TargetsTable(
    { targets }: TargetsTableProps,
) {
    return (
        <Table.Root size="sm" interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Last Active</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {targets.map((item) => (
                    <Table.Row key={item.userID}>
                        <Table.Cell>{item.userID}</Table.Cell>
                        <Table.Cell>{item.userName}</Table.Cell>
                        <Table.Cell textAlign="end">{item.lastActive}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}