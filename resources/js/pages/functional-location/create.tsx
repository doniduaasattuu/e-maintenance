import FunctionalLocationForm, { FunctionalLocationFormData } from '@/components/forms/functional-location-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Functional Locations',
        href: route('functional-locations.index'),
    },
    {
        title: 'Create',
        href: route('functional-locations.create'),
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
            <FunctionalLocationForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                recentlySuccessful={recentlySuccessful}
                submit={submit}
                canSubmit={can.store_functionallocation}
                buttonLabel="Submit"
                successMessage="Created"
                className="max-w-xl"
            />
        </AppLayout>
    );
}
