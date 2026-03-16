import FindingPriorityForm, { FindingPriorityFormData } from '@/components/forms/finding-priority-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FINDING_PRIORITY?.plural ?? 'Finding Priorities',
        href: route('finding-priorities.index'),
    },
    {
        title: 'Create',
        href: route('finding-priorities.create'),
    },
];

export default function FindingPriorityCreate() {
    const { can } = usePermissions();
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
            <FormLayout moduleKey="FINDING_PRIORITY" mode="create">
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
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
