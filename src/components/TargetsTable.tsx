import { Table } from "@chakra-ui/react";
import type { Player } from "@/utils/model"
import { formatBattleStats, formatTimeAgo } from "@/utils/utils";

type TargetsTableProps = {
    targets: Player[],
    isSelectable?: boolean,
    selectedTargets?: Set<Player>
    onPlayerRowClick?: (player: Player) => void,
};

export function TargetsTable(
    {
        targets,
        isSelectable,
        selectedTargets,
        onPlayerRowClick,
    }: TargetsTableProps,
) {
    const handleRowClick = (player: Player) => {
        if (onPlayerRowClick) {
            onPlayerRowClick(player);
        }
    };

    return (
        <Table.Root size="sm">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Level</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Predicted Stats</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Last Active</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {targets.map((item) => {
                    const isSelected = isSelectable && selectedTargets ? selectedTargets.has(item) : false;

                    return (
                        <Table.Row
                            key={item.id}
                            onClick={() => handleRowClick(item)}
                            data-selected={isSelected ? "" : undefined}
                        >
                            <Table.Cell>{item.id}</Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.level}</Table.Cell>
                            <Table.Cell>{item.status}</Table.Cell>
                            <Table.Cell>{`${formatBattleStats(item.battleStatsPrediction)} (Score: ${item.battleScorePrediction})`}</Table.Cell>
                            <Table.Cell textAlign="end">{formatTimeAgo(item.lastActionTime)}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )
}