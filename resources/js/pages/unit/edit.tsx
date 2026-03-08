import UnitForm, { UnitFormData } from '@/components/forms/unit-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, Unit } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Unit',
        href: route('units.index'),
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface UnitEditProps {
    unit: {
        data: Unit;
    };
}

export default function UnitEdit({ unit }: UnitEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<UnitFormData>>({
        name: unit.data.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('units.update', unit.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="MATERIAL_UNIT" mode="edit">
                <UnitForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_unit}
                    buttonLabel="Update"
                    successMessage="Updated"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
