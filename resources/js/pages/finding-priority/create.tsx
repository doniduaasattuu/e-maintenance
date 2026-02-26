import FindingPriorityForm, { FindingPriorityFormData } from '@/components/forms/finding-priority-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finding Priorities',
        href: route('finding-priorities.index'),
    },
    {
        title: 'Create',
        href: route('finding-priorities.create'),
    },
];

export default function FindingPriorityCreate() {
    const can = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<FindingPriorityFormData>>({
        label: '',
        description: '',
        sla_resolution_hours: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('finding-priorities.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('label', 'description', 'sla_resolution_hours');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-2xl space-y-4">
                <FindingPriorityForm
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
