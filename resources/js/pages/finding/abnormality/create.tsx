import FindingForm, { FindingFormData } from '@/components/forms/finding-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, FindingClause, FindingPriority, FindingStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.ABNORMALITY?.plural ?? 'Abnormalities',
        href: route('abnormalities.index'),
    },
    {
        title: 'Create',
        href: route('abnormalities.create'),
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
};

export default function FindingCreate({ findingClauses, findingStatuses, findingPriorities, causeCodes, departments }: FindingCreateProps) {
    const findingStatusId = findingStatuses?.data?.find((s) => s.name.toLocaleLowerCase() === 'open')?.id?.toString() ?? '1';
    const findingPriorityId = findingPriorities?.data?.find((p) => p.label.toLowerCase() === 'recommendation')?.id?.toString() ?? '1';
    const { can } = usePermissions();

    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<FindingFormData>>({
        finding_clause_id: '',
        finding_status_id: findingStatusId,
        finding_priority_id: findingPriorityId,
        cause_code_id: '',
        department_id: '',
        functional_location_id: '',
        equipment_id: '',
        description: '',
        notification: '',
        images: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('abnormalities.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    'finding_clause_id',
                    'finding_status_id',
                    'finding_priority_id',
                    'cause_code_id',
                    'department_id',
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
            <FormLayout moduleKey="ABNORMALITY" mode="create">
                <FindingForm
                    type="ABN"
                    data={data}
                    findingClauses={findingClauses}
                    findingStatuses={findingStatuses}
                    findingPriorities={findingPriorities}
                    causeCodes={causeCodes}
                    departments={departments}
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
