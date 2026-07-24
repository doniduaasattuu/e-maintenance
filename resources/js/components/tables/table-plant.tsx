import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { Meta, Plant } from '@/types';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';
import TextLink from '../text-link';

interface TablePlantProps {
    plants: {
        data: Plant[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TablePlant({ plants, withHeader = true, filters }: TablePlantProps) {
    const { can } = usePermissions();
    const meta = plants.meta;
    const caption = tableCaption(meta);

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters?.query} tabIndex={1} />
                        <PerPageSelector value={filters?.per_page?.toString() ?? '10'} tabIndex={2} />
                    </div>
                    {can.create_plant && <ButtonAdd tabIndex={3} route={route('plants.create')} />}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {plants.data && plants.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">#</TableHead>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Order</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className="text-muted-foreground">Updated at</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plants.data.map((plant: Plant, index: number) => {
                                return (
                                    <TableRow key={plant.id}>
                                        <TableCell className="w-12.5">{meta.from + index}</TableCell>
                                        <TableCell className="font-medium">
                                            {can.edit_plant ? (
                                                <TextLink href={route('plants.edit', plant.id)}>
                                                    <span className="font-medium">{plant.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span>{plant.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <span>{plant.name}</span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{plant.sort_order}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{plant.created_at}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{plant.updated_at}</TableCell>
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
        </>
    );
}
