import EquipmentForm, { EquipmentFormData } from '@/components/forms/equipment-form';
import HeadingSmall from '@/components/heading-small';
import TextLink from '@/components/text-link';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, EquipmentClass, EquipmentStatus } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface EquipmentEditProps {
    equipment: {
        data: Equipment;
    };
    equipmentClasses: {
        data: EquipmentClass[];
    };
    equipmentStatuses: {
        data: EquipmentStatus[];
    };
}

export default function EquipmentEdit({ equipment, equipmentClasses, equipmentStatuses }: EquipmentEditProps) {
    const strings = UI_STRINGS;
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
            title: 'Edit',
            href: route('equipments.edit', equipment.data.id),
        },
    ];

    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<EquipmentFormData>>({
        code: equipment.data.code,
        sort_field: equipment.data.sort_field,
        description: equipment.data.description ?? '',
        functional_location_id: equipment.data.functional_location_id?.toString() ?? '',
        equipment_class_id: equipment.data.equipment_class_id?.toString() ?? '',
        equipment_status_id: equipment.data.equipment_status_id?.toString() ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('equipments.update', equipment.data.id), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <EquipmentLayout equipment={equipment.data} className="max-w-xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Edit" description="Update equipment data and information." />
                        <TextLink className="text-sm" href={route('equipments.show', equipment.data.id)}>
                            Back
                        </TextLink>
                    </div>
                    <EquipmentForm
                        id={equipment.data.id}
                        functionalLocation={equipment.data.functionalLocation}
                        equipmentClasses={equipmentClasses}
                        equipmentStatuses={equipmentStatuses}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        recentlySuccessful={recentlySuccessful}
                        submit={submit}
                        canSubmit={can.update_equipment}
                        buttonLabel="Update"
                        successMessage="Updated"
                        isEditing={true}
                    />
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
