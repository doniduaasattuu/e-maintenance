import MaterialTypeForm, { MaterialTypeFormData } from '@/components/forms/material-type-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, MaterialType } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Types',
        href: route('material-types.index'),
    },
    {
        title: 'Edit',
        href: '/',
    },
];

interface MaterialTypeEditProps {
    materialType: {
        data: MaterialType;
    };
}

export default function MaterialTypeEdit({ materialType }: MaterialTypeEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<MaterialTypeFormData>>({
        code: materialType.data.code,
        description: materialType.data.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('material-types.update', materialType.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="MATERIAL_TYPE" mode="edit">
                <MaterialTypeForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_materialtype}
                    buttonLabel="Update"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
