import HeadingSmall from '@/components/heading-small';
import { QRCodeGenerator } from '@/components/qr-generator';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { BreadcrumbItem, Equipment } from '@/types';
import { Head } from '@inertiajs/react';
import { QrCodeIcon } from 'lucide-react';
import React from 'react';

interface EquipmentShowProps {
    equipment: {
        data: Equipment;
    };
}

export default function EquipmentShow({ equipment }: EquipmentShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: route('equipments.index'),
        },
        {
            title: equipment.data.code,
            href: route('equipments.index', equipment.data.id),
        },
    ];

    const { can } = usePermissions();
    const [isQROpen, setIsQROpen] = React.useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Details" />

            <QRCodeGenerator modelName="equipment" model={equipment.data} isQROpen={isQROpen} setIsQROpen={setIsQROpen} />

            <EquipmentLayout equipment={equipment.data} className="max-w-xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Details" description="Equipment data and information." />
                        {can.edit_equipment && (
                            <TextLink className="text-sm" href={route('equipments.edit', equipment.data.id)}>
                                Edit
                            </TextLink>
                        )}
                    </div>
                    <Field>
                        <FieldLabel htmlFor="code">Code</FieldLabel>
                        <div className="flex justify-between gap-2">
                            <Input readOnly id="code" value={equipment.data.code} />
                            <Button title="Show QR Code" variant="outline" onClick={() => setIsQROpen(true)}>
                                <QrCodeIcon />
                            </Button>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="sort_field">Sort field</FieldLabel>
                        <Input readOnly id="sort_field" value={equipment.data.sort_field} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Input readOnly id="description" value={equipment.data.description ?? ''} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="functional_location_id">Functional location</FieldLabel>
                        <Input readOnly id="functional_location_id" value={equipment.data.functionalLocation?.code ?? ''} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="equipment_class_id">Equipment class</FieldLabel>
                        <Input
                            readOnly
                            id="equipment_class_id"
                            value={
                                equipment.data.equipmentClass ? equipment.data.equipmentClass?.code + ' - ' + equipment.data.equipmentClass?.name : ''
                            }
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="equipment_status_id">Equipment status</FieldLabel>
                        <Input
                            readOnly
                            id="equipment_status_id"
                            value={
                                equipment.data.equipmentStatus
                                    ? equipment.data.equipmentStatus?.code + ' - ' + equipment.data.equipmentStatus?.name
                                    : ''
                            }
                        />
                    </Field>
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
