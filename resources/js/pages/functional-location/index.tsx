import TableFunctionalLocation from '@/components/tables/table-functional-location';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, FunctionalLocation, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Functional Locations',
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
            <TableFunctionalLocation functionalLocations={functionalLocations} />
        </AppLayout>
    );
}
