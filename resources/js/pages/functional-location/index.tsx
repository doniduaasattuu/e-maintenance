import TableFunctionalLocation from '@/components/tables/table-functional-location';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FunctionalLocation, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FUNCTIONAL_LOCATION?.plural ?? 'Functional Locations',
        href: route('functional-locations.index'),
    },
];

type FunctionalLocationProps = {
    functionalLocations: {
        data: FunctionalLocation[];
        meta: Meta;
    };
};

export default function FunctionalLocationIndex({ functionalLocations }: FunctionalLocationProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'FUNCTIONAL_LOCATION'} className="md:max-w-7xl">
                <TableFunctionalLocation functionalLocations={functionalLocations} />
            </TableLayout>
        </AppLayout>
    );
}
