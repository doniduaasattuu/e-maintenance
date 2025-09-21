import UnitForm, { UnitFormData } from '@/components/forms/unit-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Unit',
        href: route('units.index'),
    },
    {
        title: 'Create',
        href: route('units.create'),
    },
];

export default function UnitCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<UnitFormData>>({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('units.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <UnitForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.create_unit}
                    buttonLabel="Create"
                    successMessage="Created"
                />
            </div>
        </AppLayout>
    );
}
