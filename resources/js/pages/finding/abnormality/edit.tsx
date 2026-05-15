import FindingForm, { FindingFormData } from '@/components/forms/finding-form';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Department, Finding, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type FindingEditProps = {
    finding: {
        data: Finding;
    };
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

export default function FindingEdit({
    finding,
    findingClauses,
    findingStatuses,
    findingPriorities,
    causeCodes,
    departments,
    workCenters,
}: FindingEditProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.ABNORMALITY?.plural ?? 'Abnormalities',
            href: route('abnormalities.index'),
        },
        {
            title: 'Current',
            href: route('abnormalities.show', finding.data.id),
        },
        {
            title: 'Edit',
            href: route('abnormalities.index'),
        },
    ];

    const closedStatusId = findingStatuses?.data?.find((s) => s.name.toLowerCase() === 'closed')?.id?.toString() ?? finding.data.status?.id;

    const { data, setData, post, errors, processing } = useForm<Required<FindingFormData>>({
        finding_clause_id: finding.data.clause?.id.toString() ?? '',
        finding_status_id: finding.data.status?.id.toString() ?? '',
        finding_priority_id: finding.data.priority?.id.toString() ?? '',
        cause_code_id: finding.data.causeCode?.id.toString() ?? '',
        department_id: finding.data.department?.id.toString() ?? '',
        work_center_id: finding.data.workCenter?.id.toString() ?? '',
        functional_location_id: finding.data.functionalLocation?.id.toString() ?? '',
        equipment_id: finding.data.equipment?.id.toString() ?? '',
        description: finding.data.description,
        notification: finding.data.notification,
        images: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('abnormalities.update', finding.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="ABNORMALITY" mode="edit">
                <FindingForm
                    data={data}
                    findingClauses={findingClauses}
                    findingStatuses={findingStatuses}
                    findingPriorities={findingPriorities}
                    departments={departments}
                    workCenters={workCenters}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={false}
                    submit={submit}
                    canSubmit={finding.data.can.update}
                    buttonLabel="Update"
                    successMessage="Updated"
                    className="max-w-xl"
                    closedStatusId={closedStatusId}
                    functionalLocation={finding.data?.functionalLocation}
                    equipment={finding.data?.equipment}
                    isEditing={true}
                    causeCodes={causeCodes}
                    type="ABN"
                />
            </FormLayout>
        </AppLayout>
    );
}
