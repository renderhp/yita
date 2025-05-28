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
                    <Table.ColumnHeader>Level</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Last Active</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {targets.map((item) => (
                    <Table.Row key={item.id}>
                        <Table.Cell>{item.id}</Table.Cell>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{item.level}</Table.Cell>
                        <Table.Cell>{item.status}</Table.Cell>
                        <Table.Cell textAlign="end">{item.lastActionTime}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}