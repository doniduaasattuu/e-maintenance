import ImprovementStatusForm, { ImprovementStatusFormData } from '@/components/forms/improvement-status-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, ImprovementStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.IMPROVEMENT_STATUS?.plural ?? 'Improvement Statuses',
        href: route('improvement-statuses.index'),
    },
    {
        title: 'Edit',
        href: route('improvement-statuses.index'),
    },
];

interface ImprovementStatusEditProps {
    improvementStatus: {
        data: ImprovementStatus;
    };
}

export default function ImprovementStatusEdit({ improvementStatus }: ImprovementStatusEditProps) {
    const { can } = usePermissions();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ImprovementStatusFormData>>({
        name: improvementStatus.data.name,
        color: improvementStatus.data.color,
        sequence: improvementStatus.data.sequence.toString(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('improvement-statuses.update', improvementStatus.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="IMPROVEMENT_STATUS" mode="edit">
                <ImprovementStatusForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.update_equipmentclass}
                    buttonLabel="Update"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
