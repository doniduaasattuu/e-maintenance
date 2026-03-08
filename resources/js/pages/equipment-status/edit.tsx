import EquipmentStatusForm, { EquipmentStatusFormData } from '@/components/forms/equipment-status-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, EquipmentStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipment Statuses',
        href: route('equipment-statuses.index'),
    },
    {
        title: 'Edit',
        href: route('equipment-statuses.index'),
    },
];

interface EquipmentStatusEditProps {
    equipmentStatus: {
        data: EquipmentStatus;
    };
}

export default function EquipmentStatusEdit({ equipmentStatus }: EquipmentStatusEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<EquipmentStatusFormData>>({
        code: equipmentStatus.data.code,
        name: equipmentStatus.data.name,
        description: equipmentStatus.data?.description ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('equipment-statuses.update', equipmentStatus.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="EQUIPMENT_STATUS" mode="edit">
                <EquipmentStatusForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_equipmentclass}
                    buttonLabel="Update"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
