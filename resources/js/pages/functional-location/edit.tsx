import FunctionalLocationForm, { FunctionalLocationFormData } from '@/components/forms/functional-location-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, FunctionalLocation } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Functional Locations',
        href: route('functional-locations.index'),
    },
    {
        title: 'Edit',
        href: route('functional-locations.index'),
    },
];

interface FunctionalLocationEditProps {
    functionalLocation: {
        data: FunctionalLocation;
    };
}

export default function FunctionalLocationEdit({ functionalLocation }: FunctionalLocationEditProps) {
    const can = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<FunctionalLocationFormData>>({
        code: functionalLocation.data.code,
        description: functionalLocation.data.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('functional-locations.update', functionalLocation.data.id), {
            preserveScroll: true,
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
                canSubmit={can.update_functionallocation}
                buttonLabel="Update"
                className="max-w-xl"
            />
        </AppLayout>
    );
}
