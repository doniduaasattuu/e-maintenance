import HeadingSmall from '@/components/heading-small';
import TableEquipment from '@/components/tables/table-equipment';
import AppLayout from '@/layouts/app-layout';
import FunctionalLocationLayout from '@/layouts/functional-location/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, EquipmentClass, EquipmentStatus, FunctionalLocation, Meta } from '@/types';
import { Head } from '@inertiajs/react';

const strings = UI_STRINGS;

interface FunctionalLocationEditProps {
    functionalLocation: {
        data: FunctionalLocation;
    };
    equipments: {
        data: Equipment[];
        meta: Meta;
    };
    equipmentClasses: {
        data: EquipmentClass[];
    };
    equipmentStatuses: {
        data: EquipmentStatus[];
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function FunctionalLocationEdit({
    functionalLocation,
    equipments,
    filters,
    equipmentClasses,
    equipmentStatuses,
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
            <Head title="Details" />
            <FunctionalLocationLayout functionalLocation={functionalLocation.data} className="w-full max-w-6xl space-y-4">
                <HeadingSmall title={functionalLocation.data.description} description="List of installed equipment at this functional location." />
                <TableEquipment
                    mode="functional-location"
                    filters={filters}
                    withHeader={true}
                    equipments={equipments}
                    equipmentClasses={equipmentClasses}
                    equipmentStatuses={equipmentStatuses}
                />
            </FunctionalLocationLayout>
        </AppLayout>
    );
}
