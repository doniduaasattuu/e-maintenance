import ButtonSubmit from '@/components/button-submit';
import HeadingSmall from '@/components/heading-small';
import MaterialSelect from '@/components/material-select';
import RequiredLabel from '@/components/required-label';
import TableEquipmentMaterialManagement from '@/components/tables/table-equipment-material-management';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, Material, Meta } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface EquipmentMaterialsProps {
    equipment: {
        data: Equipment;
    };
    materials: {
        data: Material[];
        meta: Meta;
    };
}

export default function EquipmentMaterials({ equipment, materials }: EquipmentMaterialsProps) {
    const { can } = usePermissions();
    const strings = UI_STRINGS;
    const [isAddOpen, setIsAddOpen] = useState(false);
    const materialTitle = strings.MATERIAL?.label ?? 'Material';
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.EQUIPMENT?.plural ?? 'Equipments',
            href: route('equipments.index'),
        },
        {
            title: equipment.data.code,
            href: route('equipments.show', equipment.data.id),
        },
        {
            title: 'Materials',
            href: route('equipments.show', equipment.data.id),
        },
    ];

    const { data, setData, post, processing, reset, recentlySuccessful, errors } = useForm({
        material_id: '',
        quantity: 1,
        note: '',
    });

    const handleAddMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('equipments.materials.store', equipment.data.id), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
            },
        });
    };

    const handleRemove = (materialId: number) => {
        router.delete(route('equipments.materials.destroy', [equipment.data.id, materialId]));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={materialTitle} />

            <EquipmentLayout equipment={equipment.data} className="w-full max-w-7xl space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <HeadingSmall title={materialTitle} description="Catalog of spare parts and consumables associated with this asset." />
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            {can.update_equipment && (
                                <Button size={'sm'} variant={'outline'}>
                                    <Plus className="h-4 w-4" />
                                    Add Material
                                </Button>
                            )}
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleAddMaterial}>
                                <DialogHeader>
                                    <DialogTitle>Add Material to Equipment</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-6">
                                    <Field>
                                        <FieldLabel htmlFor="material_id">
                                            Material
                                            <RequiredLabel />
                                        </FieldLabel>
                                        <MaterialSelect
                                            id="material_id"
                                            value={data.material_id ?? ''}
                                            processing={processing}
                                            recentlySuccessful={recentlySuccessful}
                                            tabIndex={1}
                                            currentValue={null}
                                            onChange={(val) => setData('material_id', val ? val.toString() : '')}
                                        />
                                        <FieldError>{errors.material_id}</FieldError>
                                    </Field>
                                    <div className="flex items-center justify-between gap-2">
                                        <Field>
                                            <FieldLabel htmlFor="quantity">
                                                Quantity
                                                <RequiredLabel />
                                            </FieldLabel>
                                            <Input
                                                tabIndex={2}
                                                type="number"
                                                step="1"
                                                value={data.quantity}
                                                onChange={(e) => setData('quantity', parseFloat(e.target.value))}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="note">Note</FieldLabel>
                                            <Input
                                                tabIndex={3}
                                                type="numeric"
                                                value={data.note}
                                                min={'1'}
                                                onChange={(e) => setData('note', e.target.value)}
                                                placeholder="Note"
                                            />
                                        </Field>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <ButtonSubmit
                                        recentlySuccessful={recentlySuccessful}
                                        disabled={processing || data.material_id == ''}
                                        label="Save"
                                        successMessage="Saved"
                                        processing={processing}
                                        tabIndex={4}
                                    />
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <TableEquipmentMaterialManagement materials={materials} handleRemove={handleRemove} />
            </EquipmentLayout>
        </AppLayout>
    );
}
