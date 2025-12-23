import EquipmentForm, { EquipmentFormData } from '@/components/forms/equipment-form';
import Heading from '@/components/heading';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EquipmentClass, EquipmentStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipments',
        href: route('equipments.index'),
    },
    {
        title: 'Create',
        href: route('equipments.create'),
    },
];

interface EquipmentCreateProps {
    equipmentClasses: {
        data: EquipmentClass[];
    };
    equipmentStatuses: {
        data: EquipmentStatus[];
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
            <div className="max-w-2xl space-y-6 px-4 py-6">
                <Heading title="Create" description="Insert new equipment." />

                <EquipmentForm
                    equipmentClasses={equipmentClasses}
                    equipmentStatuses={equipmentStatuses}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_equipment}
                    buttonLabel="Create"
                    successMessage="Created"
                />
            </div>
        </AppLayout>
    );
}
