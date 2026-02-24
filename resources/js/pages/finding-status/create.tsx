import FindingStatusForm, { FindingStatusFormData } from '@/components/forms/finding-status-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finding Statuses',
        href: route('finding-statuses.index'),
    },
    {
        title: 'Create',
        href: route('finding-statuses.create'),
    },
];

export default function FindingStatusCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<FindingStatusFormData>>({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('finding-statuses.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'description');
            },
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
                    canSubmit={can.store_findingstatus}
                    buttonLabel="Create"
                    successMessage="Created"
                />
            </div>
        </AppLayout>
    );
}
