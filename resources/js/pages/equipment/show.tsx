import OptionsDropdown from '@/components/options-dropdown';
import { DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, Equipment } from '@/types';
import { Link } from '@inertiajs/react';
import { ChartLine, Edit, NotepadTextIcon, PlusSquare } from 'lucide-react';

interface EquipmentShowProps {
    equipment: {
        data: Equipment;
    };
}

export default function EquipmentShow({ equipment }: EquipmentShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: equipment.data.code,
            href: `/equipments/${equipment.data.id}`,
        },
    ];

    const can = usePermissions();

    const action = (
        <OptionsDropdown className="w-[160px]">
            {can.update_equipment && (
                <DropdownMenuItem asChild>
                    <Link className="text-sm" href={route('equipments.edit', equipment.data.id)}>
                        <Edit />
                        Edit
                    </Link>
                </DropdownMenuItem>
            )}

            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <div className="flex items-center gap-2">
                        <NotepadTextIcon size={16} className="text-muted-foreground" />
                        Inspection
                    </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                            <Link className="text-sm" href={route('equipments.show', equipment.data.id)}>
                                <PlusSquare />
                                New
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link className="text-sm" href={route('equipments.show', equipment.data.id)}>
                                <ChartLine />
                                Trend
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
        </OptionsDropdown>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <TableLayout title="Equipments" description="Overview and management of equipments in the system" action={action}>
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input readOnly className="mt-1" id="code" value={equipment.data.code} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sort_field">Sort field</Label>
                            <Input readOnly className="mt-1" id="sort_field" value={equipment.data.sort_field} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input readOnly className="mt-1" id="description" value={equipment.data.description ?? ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="functional_location_id">Functional location</Label>
                            <Input readOnly className="mt-1" id="functional_location_id" value={equipment.data.functionalLocation?.code ?? ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="equipment_class_id">Equipment class</Label>
                            <Input
                                readOnly
                                className="mt-1"
                                id="equipment_class_id"
                                value={
                                    equipment.data.equipmentClass
                                        ? equipment.data.equipmentClass?.code + ' - ' + equipment.data.equipmentClass?.name
                                        : ''
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="equipment_status_id">Equipment status</Label>
                            <Input
                                readOnly
                                className="mt-1"
                                id="equipment_status_id"
                                value={
                                    equipment.data.equipmentStatus
                                        ? equipment.data.equipmentStatus?.code + ' - ' + equipment.data.equipmentStatus?.name
                                        : ''
                                }
                            />
                        </div>
                    </div>
                </TableLayout>
            </div>
        </AppLayout>
    );
}
