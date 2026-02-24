import FindingStatusForm, { FindingStatusFormData } from '@/components/forms/finding-status-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, FindingStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finding Statuses',
        href: route('finding-statuses.index'),
    },
    {
        title: 'Edit',
        href: route('finding-statuses.index'),
    },
];

interface FindingStatusEditProps {
    findingStatus: {
        data: FindingStatus;
    };
}

export default function FindingStatusEdit({ findingStatus }: FindingStatusEditProps) {
    const can = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<FindingStatusFormData>>({
        name: findingStatus.data.name,
        description: findingStatus.data?.description ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('finding-statuses.update', findingStatus.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <FindingStatusForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_findingstatus}
                    buttonLabel="Update"
                />
            </div>
        </AppLayout>
    );
}
