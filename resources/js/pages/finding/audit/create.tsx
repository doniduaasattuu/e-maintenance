import FindingForm, { FindingFormData } from '@/components/forms/finding-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.AUDIT?.plural ?? 'Audits',
        href: route('audits.index'),
    },
    {
        title: 'Create',
        href: route('audits.create'),
    },
];

type FindingCreateProps = {
    findingClauses: {
        data: FindingClause[];
    };
    findingStatuses: {
        data: FindingStatus[];
    };
    findingPriorities: {
        data: FindingPriority[];
    };
    causeCodes: {
        data: CauseCode[];
    };
    departments: {
        data: Department[];
    };
    workCenters: {
        data: WorkCenter[];
    };
};

export default function FindingCreate({
    findingClauses,
    findingStatuses,
    findingPriorities,
    causeCodes,
    departments,
    workCenters,
}: FindingCreateProps) {
    const findingStatusId = findingStatuses?.data?.find((s) => s.name.toLocaleLowerCase() === 'open')?.id?.toString() ?? '1';
    const findingPriorityId = findingPriorities?.data?.find((p) => p.label.toLowerCase() === 'recommendation')?.id?.toString() ?? '1';
    const { user, can } = usePermissions();

    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<FindingFormData>>({
        finding_clause_id: '',
        finding_status_id: findingStatusId,
        finding_priority_id: findingPriorityId,
        cause_code_id: '',
        department_id: user.department_id ? user.department_id.toString() : '',
        work_center_id: user.work_center_id ? user.work_center_id.toString() : '',
        functional_location_id: '',
        equipment_id: '',
        description: '',
        notification: '',
        images: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('audits.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'finding_clause_id',
                    'finding_status_id',
                    'finding_priority_id',
                    'cause_code_id',
                    'department_id',
                    'work_center_id',
                    'functional_location_id',
                    'equipment_id',
                    'description',
                    'notification',
                    'images',
                );
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="AUDIT" mode="create">
                <FindingForm
                    type="AUD"
                    data={data}
                    findingClauses={findingClauses}
                    findingStatuses={findingStatuses}
                    findingPriorities={findingPriorities}
                    causeCodes={causeCodes}
                    departments={departments}
                    workCenters={workCenters}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submit={submit}
                    canSubmit={can.store_audit}
                    buttonLabel="Create"
                    successMessage="Created"
                    className="max-w-xl"
                />
            </FormLayout>
        </AppLayout>
    );
}
