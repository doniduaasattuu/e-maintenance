import EquipmentClassForm, { EquipmentClassFormData } from '@/components/forms/equipment-class-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EquipmentClass } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipment Classes',
        href: route('equipment-classes.index'),
    },
    {
        title: 'Edit',
        href: route('equipment-classes.index'),
    },
];

interface EquipmentClassEditProps {
    equipmentClass: {
        data: EquipmentClass;
    };
}

export default function EquipmentClassEdit({ equipmentClass }: EquipmentClassEditProps) {
    const can = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<EquipmentClassFormData>>({
        code: equipmentClass.data.code,
        name: equipmentClass.data.name,
        formable_type: equipmentClass.data.formable_type,
        description: equipmentClass.data?.description ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('equipment-classes.update', equipmentClass.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <EquipmentClassForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_equipmentclass}
                    buttonLabel="Update"
                    isEditing={true}
                />
            </div>
        </AppLayout>
    );
}
