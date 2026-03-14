import UnitForm, { MaterialUnitFormData } from '@/components/forms/material-unit-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, MaterialUnit } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Units',
        href: route('material-units.index'),
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface MaterialUnitEditProps {
    materialUnit: {
        data: MaterialUnit;
    };
}

export default function MaterialUnitEdit({ materialUnit }: MaterialUnitEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<MaterialUnitFormData>>({
        name: materialUnit.data.name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('material-units.update', materialUnit.data.id), {
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
                    canSubmit={can.update_materialunit}
                    buttonLabel="Update"
                    successMessage="Updated"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
