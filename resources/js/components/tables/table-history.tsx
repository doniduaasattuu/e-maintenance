import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InstallDismantleHistory, Meta } from '@/types';
import React from 'react';
import { GeneratePagination } from '../generate-pagination';
import SearchBar from '../search-bar';

interface HistoryTableProps {
    histories: {
        data: InstallDismantleHistory[];
        meta: Meta;
    };
}

export default function TableHistory({ histories }: HistoryTableProps) {
    const meta = histories.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    return (
        <React.Fragment>
            <div className="flex justify-between gap-2">
                <SearchBar />
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">Equipment</TableHead>
                        <TableHead className="text-muted-foreground">From status</TableHead>
                        <TableHead className="text-muted-foreground">From location</TableHead>
                        <TableHead className="text-muted-foreground">To status</TableHead>
                        <TableHead className="text-muted-foreground">To location</TableHead>
                        <TableHead className="text-muted-foreground text-right">Changed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {histories.data.map((history: InstallDismantleHistory) => {
                        return (
                            <TableRow key={history.id}>
                                <TableCell className="flex-col align-top">
                                    <div className="flex max-w-sm flex-col items-start truncate">
                                        <span className="font-medium">{history.equipment.code}</span>
                                        <span className="text-muted-foreground">{history.equipment.equipmentClass?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="flex-col align-top">
                                    <div className="flex max-w-sm flex-col items-start truncate">
                                        <span className="font-medium text-red-400">{history.fromStatus.name}</span>
                                        <span className="text-muted-foreground">{history.fromStatus.code}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="flex-col align-top">
                                    <div className="flex max-w-sm flex-col items-start truncate">
                                        <span className="font-medium">{history.fromFunctionalLocation?.code}</span>
                                        <span className="text-muted-foreground">{history.from_sort_field}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="flex-col align-top">
                                    <div className="flex max-w-sm flex-col items-start truncate">
                                        <span className="font-medium text-green-400">{history.toStatus.name}</span>
                                        <span className="text-muted-foreground">{history.toStatus.code}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="flex-col align-top">
                                    <div className="flex max-w-sm flex-col items-start truncate">
                                        <span className="font-medium">{history.toFunctionalLocation?.code}</span>
                                        <span className="text-muted-foreground">{history.to_sort_field}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="flex-col align-top">
                                    <div className="flex max-w-sm flex-col truncate">
                                        <span className="text-right font-medium">{history.changedBy?.name}</span>
                                        <span className="text-muted-foreground text-right">{history.changed_at}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <GeneratePagination meta={meta} />
        </React.Fragment>
    );
}
