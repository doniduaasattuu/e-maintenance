import FindingPrioritiesForm, { FindingPriorityFormData } from '@/components/forms/finding-priority-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, FindingPriority } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finding Priorities',
        href: route('finding-priorities.index'),
    },
    {
        title: 'Edit',
        href: route('finding-priorities.index'),
    },
];

interface FindingPrioritiesEditProps {
    findingPriority: {
        data: FindingPriority;
    };
}

export default function FindingPrioritiesEdit({ findingPriority }: FindingPrioritiesEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<FindingPriorityFormData>>({
        label: findingPriority.data.label,
        description: findingPriority.data?.description ?? '',
        sla_resolution_hours: findingPriority.data?.sla_resolution_hours ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('finding-priorities.update', findingPriority.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="FINDING_PRIORITY" mode="edit">
                <FindingPrioritiesForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_findingstatus}
                    buttonLabel="Update"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
