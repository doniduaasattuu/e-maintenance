import MaterialTypeForm, { MaterialTypeFormData } from '@/components/forms/material-type-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Type',
        href: route('material-types.index'),
    },
    {
        title: 'Create',
        href: route('material-types.create'),
    },
];

export default function MaterialTypeCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<MaterialTypeFormData>>({
        code: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('material-types.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'description');
            },
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
                    canSubmit={can.store_materialtype}
                    buttonLabel="Submit"
                    successMessage="Created"
                />
            </div>
        </AppLayout>
    );
}
