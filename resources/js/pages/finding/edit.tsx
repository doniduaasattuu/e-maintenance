import FindingForm, { FindingFormData } from '@/components/forms/finding-form';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { BreadcrumbItem, Department, Finding, FindingClause, FindingPriority, FindingStatus } from '@/types';
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
    departments: {
        data: Department[];
    };
};

export default function FindingEdit({ finding, findingClauses, findingStatuses, findingPriorities, departments }: FindingEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Findings',
            href: route('findings.index'),
        },
        {
            title: 'Current',
            href: route('findings.show', finding.data.id),
        },
        {
            title: 'Edit',
            href: route('findings.index'),
        },
    ];

    const can = usePermissions();
    const closedStatusId = findingStatuses?.data?.find((s) => s.name.toLowerCase() === 'closed')?.id?.toString() ?? finding.data.status?.id;

    const { data, setData, post, errors, processing } = useForm<Required<FindingFormData>>({
        finding_clause_id: finding.data.clause?.id.toString() ?? '',
        finding_status_id: finding.data.status?.id.toString() ?? '',
        finding_priority_id: finding.data.priority?.id.toString() ?? '',
        department_id: finding.data.department?.id.toString() ?? '',
        functional_location_id: finding.data.functionalLocation?.id.toString() ?? '',
        equipment_id: finding.data.equipment?.id.toString() ?? '',
        description: finding.data.description,
        notification: finding.data.notification,
        images: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('findings.update', finding.data.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout moduleKey="FINDING" mode="edit">
                <FindingForm
                    data={data}
                    findingClauses={findingClauses}
                    findingStatuses={findingStatuses}
                    findingPriorities={findingPriorities}
                    departments={departments}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    recentlySuccessful={false}
                    submit={submit}
                    canSubmit={can.store_findingstatus}
                    buttonLabel="Update"
                    successMessage="Updated"
                    className="max-w-xl"
                    closedStatusId={closedStatusId}
                    functionalLocation={finding.data?.functionalLocation}
                    equipment={finding.data?.equipment}
                    isEditing={true}
                />
            </FormLayout>
        </AppLayout>
    );
}
