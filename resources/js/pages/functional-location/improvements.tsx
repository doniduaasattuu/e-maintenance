import HeadingSmall from '@/components/heading-small';
import TableImprovement from '@/components/tables/table-improvement';
import AppLayout from '@/layouts/app-layout';
import FunctionalLocationLayout from '@/layouts/functional-location/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FunctionalLocation, Improvement, ImprovementCategory, ImprovementStatus, Meta } from '@/types';
import { Head } from '@inertiajs/react';

interface FunctionalLocationImprovementsProps {
    functionalLocation: {
        data: FunctionalLocation;
    };
    improvements: {
        data: Improvement[];
        meta: Meta;
    };
    improvementCategories: {
        data: ImprovementCategory[];
    };
    improvementStatuses: {
        data: ImprovementStatus[];
    };
    filters: {
        query: string;
        per_page: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function FunctionalLocationImprovements({
    functionalLocation,
    improvements,
    improvementCategories,
    improvementStatuses,
    filters,
}: FunctionalLocationImprovementsProps) {
    const strings = UI_STRINGS;
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
            title: 'Improvements',
            href: route('functional-locations.show', functionalLocation.data.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Improvement" />

            <FunctionalLocationLayout functionalLocation={functionalLocation.data} className="w-full max-w-7xl space-y-4">
                <HeadingSmall title="Improvement" description="Historical records of improvements." />
                <TableImprovement
                    withHeader={true}
                    improvements={improvements}
                    filters={filters}
                    improvementCategories={improvementCategories}
                    improvementStatuses={improvementStatuses}
                />
            </FunctionalLocationLayout>
        </AppLayout>
    );
}
