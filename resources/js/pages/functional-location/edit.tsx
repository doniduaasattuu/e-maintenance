import FunctionalLocationForm, { FunctionalLocationFormData } from '@/components/forms/functional-location-form';
import HeadingSmall from '@/components/heading-small';
import TextLink from '@/components/text-link';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FunctionalLocationLayout from '@/layouts/functional-location/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FunctionalLocation, Plant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FUNCTIONAL_LOCATION?.plural ?? 'Functional Locations',
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
    plants: {
        data: Plant[];
    };
}

export default function FunctionalLocationEdit({ functionalLocation, plants }: FunctionalLocationEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<FunctionalLocationFormData>>({
        code: functionalLocation.data.code,
        description: functionalLocation.data.description,
        plant_id: functionalLocation.data?.plant_id?.toString() ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('functional-locations.update', functionalLocation.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <FunctionalLocationLayout functionalLocation={functionalLocation.data} className="w-full max-w-xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Edit" description="Update functional-location data and information." />
                        <TextLink className="text-sm" href={route('functional-locations.show', functionalLocation.data.id)}>
                            Back
                        </TextLink>
                    </div>
                    <FunctionalLocationForm
                        plants={plants}
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
            </FunctionalLocationLayout>
        </AppLayout>
    );
}
