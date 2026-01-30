import EquipmentStatusForm, { EquipmentStatusFormData } from '@/components/forms/equipment-status-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipment Statuses',
        href: route('equipment-statuses.index'),
    },
    {
        title: 'Create',
        href: route('equipment-statuses.create'),
    },
];

export default function EquipmentStatusCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<EquipmentStatusFormData>>({
        code: '',
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('equipment-statuses.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'name', 'description');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <EquipmentStatusForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_equipmentclass}
                    buttonLabel="Create"
                    successMessage="Created"
                />
            </div>
        </AppLayout>
    );
}
