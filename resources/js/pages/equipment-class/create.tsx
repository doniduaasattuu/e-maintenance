import EquipmentClassForm, { EquipmentClassFormData } from '@/components/forms/equipment-class-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipment Classes',
        href: route('equipment-classes.index'),
    },
    {
        title: 'Create',
        href: route('equipment-classes.create'),
    },
];

export default function EquipmentClassCreate() {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<EquipmentClassFormData>>({
        code: '',
        name: '',
        formable_type: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('equipment-classes.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'name', 'formable_type', 'description');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="EQUIPMENT_CLASS" mode="create">
                <EquipmentClassForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_equipmentclass}
                    buttonLabel="Create"
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
