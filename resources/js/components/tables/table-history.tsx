import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { tableCaption } from '@/lib/utils';
import { InstallDismantleHistory, Meta } from '@/types';
import { useState } from 'react';
import ButtonExport from '../button-export';
import DialogEquipmentHistoryExportExcel from '../dialog-equipment-history-export-excel';
import EmptyIcon from '../empty-icon';
import { GeneratePagination } from '../generate-pagination';
import { PerPageSelector } from '../per-page-selector';
import SearchBar from '../search-bar';

interface HistoryTableProps {
    histories: {
        data: InstallDismantleHistory[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableHistory({ histories, filters }: HistoryTableProps) {
    const meta = histories.meta;
    const caption = tableCaption(meta);
    const [exportDialog, setExportDialog] = useState<boolean>(false);

    return (
        <>
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar value={filters?.query} tabIndex={1} />
                    <PerPageSelector value={filters?.per_page?.toString() ?? '10'} tabIndex={2} />
                </div>

                <ButtonExport tabIndex={2} onClick={() => setExportDialog(true)} />
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {histories.data && histories.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
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
                                                <span className="text-muted-foreground">{history.equipment.eclass?.name}</span>
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
                ) : (
                    <EmptyIcon />
                )}
            </div>
            <GeneratePagination meta={meta} />

            <DialogEquipmentHistoryExportExcel open={exportDialog} setOpen={setExportDialog} />
        </>
    );
}
