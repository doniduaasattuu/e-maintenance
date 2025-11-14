import MaterialTypeForm, { MaterialTypeFormData } from '@/components/forms/material-type-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, MaterialType } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Type',
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
    const can = usePermissions();
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
            <div className="max-w-2xl space-y-4">
                <MaterialTypeForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_functionallocation}
                    buttonLabel="Update"
                />
            </div>
        </AppLayout>
    );
}
