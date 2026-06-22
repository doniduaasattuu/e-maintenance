import HeadingSmall from '@/components/heading-small';
import TableFinding from '@/components/tables/table-finding';
import AppLayout from '@/layouts/app-layout';
import FunctionalLocationLayout from '@/layouts/functional-location/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import {
    BreadcrumbItem,
    CauseCode,
    Department,
    Finding,
    FindingClause,
    FindingPriority,
    FindingStatus,
    FunctionalLocation,
    Meta,
    WorkCenter,
} from '@/types';
import { Head } from '@inertiajs/react';

interface FunctionalLocationFindingsProps {
    functionalLocation: {
        data: FunctionalLocation;
    };
    findings: {
        data: Finding[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
        start_date?: string;
        end_date?: string;
    };
    findingClauses?: {
        data: FindingClause[];
    };
    findingPriorities?: {
        data: FindingPriority[];
    };
    findingStatuses?: {
        data: FindingStatus[];
    };
    departments?: {
        data: Department[];
    };
    workCenters?: {
        data: WorkCenter[];
    };
    causeCodes?: {
        data: CauseCode[];
    };
}

export default function FunctionalLocationFindings({
    functionalLocation,
    findings,
    filters,
    findingClauses,
    findingPriorities,
    findingStatuses,
    departments,
    workCenters,
    causeCodes,
}: FunctionalLocationFindingsProps) {
    const strings = UI_STRINGS;
    const auditTitle = strings.FINDING?.label ?? 'Finding';
    const abnormalityTitle = strings.ABNORMALITY?.label ?? 'Abnormality';
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.FUNCTIONAL_LOCATION?.plural ?? 'Functional Locations',
            href: route('functional-locations.index'),
        },
        {
            title: functionalLocation.data.code,
            href: route('functional-locations.show', functionalLocation.data.id),
        },
        {
            title: 'Findings',
            href: route('functional-locations.show', functionalLocation.data.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Finding" />

            <FunctionalLocationLayout functionalLocation={functionalLocation.data} className="w-full max-w-7xl space-y-4">
                <HeadingSmall title={abnormalityTitle + ' & ' + auditTitle} description="Historical records of abnormalities and audit results." />
                <TableFinding
                    asset={functionalLocation.data}
                    mode="functional-location"
                    withHeader={true}
                    findings={findings}
                    filters={filters}
                    findingClauses={findingClauses}
                    findingPriorities={findingPriorities}
                    findingStatuses={findingStatuses}
                    departments={departments}
                    workCenters={workCenters}
                    causeCodes={causeCodes}
                />
            </FunctionalLocationLayout>
        </AppLayout>
    );
}
