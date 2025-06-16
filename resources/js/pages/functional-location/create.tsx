import FunctionalLocationForm, { FunctionalLocationFormData } from '@/components/forms/functional-location-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Functional Location',
        href: '/functional-locations',
    },
    {
        title: 'Create',
        href: '/functional-locations/create',
    },
];

export default function FunctionalLocationCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<FunctionalLocationFormData>>({
        code: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('functional-locations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code', 'description');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Functional Location" />

            <div className="max-w-2xl space-y-4">
                <FunctionalLocationForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.create_functionallocation}
                    buttonLabel="Submit"
                    successMessage="Saved"
                />
            </div>
        </AppLayout>
    );
}
