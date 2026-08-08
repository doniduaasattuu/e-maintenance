import ImprovementStatusForm, { ImprovementStatusFormData } from '@/components/forms/improvement-status-form';
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
        title: strings.IMPROVEMENT_STATUS?.plural ?? 'Improvement Statuses',
        href: route('improvement-statuses.index'),
    },
    {
        title: 'Create',
        href: route('improvement-statuses.create'),
    },
];

export default function ImprovementStatusCreate() {
    const { can } = usePermissions();
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<ImprovementStatusFormData>>({
        name: '',
        color: '',
        sequence: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('improvement-statuses.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'color', 'sequence');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="IMPROVEMENT_STATUS" mode="create">
                <ImprovementStatusForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_improvementcategory}
                    buttonLabel="Create"
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
