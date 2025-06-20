import EquipmentForm, { EquipmentFormData } from '@/components/forms/equipment-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EquipmentClass } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipments',
        href: '/equipments',
    },
    {
        title: 'Create',
        href: '/equipments/create',
    },
];

interface EquipmentCreateProps {
    equipmentClasses: {
        data: EquipmentClass[];
    };
    equipmentStatuses: {
        data: EquipmentClass[];
    };
}

export default function EquipmentCreate({ equipmentClasses, equipmentStatuses }: EquipmentCreateProps) {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<EquipmentFormData>>({
        code: '',
        sort_field: '',
        description: '',
        functional_location_id: '',
        equipment_class_id: '',
        equipment_status_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('equipments.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'sort_field', 'description', 'functional_location_id', 'equipment_class_id', 'equipment_status_id');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <EquipmentForm
                    equipmentClasses={equipmentClasses}
                    equipmentStatuses={equipmentStatuses}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.create_equipment}
                    buttonLabel="Create"
                    successMessage="Created"
                />
            </div>
        </AppLayout>
    );
}
