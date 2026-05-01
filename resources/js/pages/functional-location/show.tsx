import TableEquipment from '@/components/tables/table-equipment';
import TableFinding from '@/components/tables/table-finding';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import FormLayout from '@/layouts/form/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import {
    BreadcrumbItem,
    CauseCode,
    Department,
    Equipment,
    Finding,
    FindingClause,
    FindingPriority,
    FindingStatus,
    FunctionalLocation,
    Meta,
    WorkCenter,
} from '@/types';

const strings = UI_STRINGS;

interface FunctionalLocationEditProps {
    functionalLocation: {
        data: FunctionalLocation;
    };
    equipments: {
        data: Equipment[];
        meta: Meta;
    };
    findings: {
        data: Finding[];
        meta: Meta;
    };
    className?: string;
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
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function FunctionalLocationEdit({
    functionalLocation,
    equipments,
    findings,
    findingPriorities,
    findingStatuses,
    departments,
    workCenters,
    findingClauses,
    causeCodes,
    filters,
}: FunctionalLocationEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.FUNCTIONAL_LOCATION?.plural ?? 'Functional Locations',
            href: route('functional-locations.index'),
        },
        {
            title: functionalLocation.data.code,
            href: route('functional-locations.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <FormLayout
                mode="show"
                moduleKey="FUNCTIONAL_LOCATION"
                title={functionalLocation.data.code}
                description={functionalLocation.data.description}
            >
                <Tabs defaultValue="equipments" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="equipments">Equipments</TabsTrigger>
                        <TabsTrigger value="findings">Findings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="equipments" className="max-w-6xl space-y-4">
                        <TableEquipment filters={filters} withHeader={false} equipments={equipments} />
                    </TabsContent>
                    <TabsContent value="findings" className="space-y-4">
                        <TableFinding
                            asset={functionalLocation.data}
                            mode="functional-location"
                            filters={filters}
                            withHeader={true}
                            findings={findings}
                            findingClauses={findingClauses}
                            findingPriorities={findingPriorities}
                            findingStatuses={findingStatuses}
                            departments={departments}
                            workCenters={workCenters}
                            causeCodes={causeCodes}
                        />
                    </TabsContent>
                </Tabs>
            </FormLayout>
        </AppLayout>
    );
}
