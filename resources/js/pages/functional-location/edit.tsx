import FunctionalLocationForm, { FunctionalLocationFormData } from '@/components/forms/functional-location-form';
import HeadingSmall from '@/components/heading-small';
import TextLink from '@/components/text-link';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FunctionalLocationLayout from '@/layouts/functional-location/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FunctionalLocation } from '@/types';
import { useForm } from '@inertiajs/react';
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
}

export default function FunctionalLocationEdit({ functionalLocation }: FunctionalLocationEditProps) {
    const { can } = usePermissions();
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
            <FunctionalLocationLayout functionalLocation={functionalLocation.data} className="max-w-xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Edit" description="Update functional-location data and information." />
                        <TextLink className="text-sm" href={route('functional-locations.show', functionalLocation.data.id)}>
                            Back
                        </TextLink>
                    </div>
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
                </div>
            </FunctionalLocationLayout>
        </AppLayout>
    );
}
