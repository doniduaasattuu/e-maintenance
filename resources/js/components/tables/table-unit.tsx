import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { Meta, Unit } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface TableUnitProps {
    units: {
        data: Unit[];
        meta: Meta;
    };
}

export default function TableUnit({ units }: TableUnitProps) {
    const can = usePermissions();
    const meta = units.meta;
    const caption = tableCaption(meta);

    function handleDeleteUnit(id: number | string) {
        router.delete(route('units.destroy', id));
    }
    return (
        <TableLayout title="Unit" description="Overview and management of material unit" className="md:max-w-2xl">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_unit && <ButtonAdd tabIndex={2} route={route('units.create')} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                <Table>
                    <TableCaption className="text-sm">{caption}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-muted-foreground">Name</TableHead>
                            <TableHead className="text-muted-foreground">Created at</TableHead>
                            <TableHead className={`text-muted-foreground ${can.delete_unit ?? 'text-right'}`}>Updated at</TableHead>
                            {can.delete_unit && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {units.data.map((unit: Unit) => {
                            return (
                                <TableRow key={unit.id}>
                                    <TableCell>
                                        {can.edit_unit ? (
                                            <TextLink href={route('units.edit', unit.id)}>
                                                <span className="font-medium">{unit.name}</span>
                                            </TextLink>
                                        ) : (
                                            <span className="font-medium">{unit.name}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{unit.created_at}</TableCell>
                                    <TableCell className={`text-muted-foreground ${can.delete_unit ?? 'text-right'}`}>{unit.updated_at}</TableCell>
                                    {can.delete_unit && (
                                        <TableCell className="w-10 flex-col text-right align-top">
                                            <ActionConfirm
                                                action={() => handleDeleteUnit(unit.id)}
                                                title={`Delete data ${unit.name}?`}
                                                description="This action will remove this unit from database. This action cannot be undone."
                                            >
                                                <Trash2 size={18} className="text-red-500" />
                                            </ActionConfirm>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
