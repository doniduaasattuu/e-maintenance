import TableFindingType from '@/components/tables/table-finding-type';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, FindingType, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.FINDING_TYPE?.plural ?? 'Finding Types',
        href: route('finding-types.index'),
    },
];

interface FindingTypeProps {
    findingTypes: {
        data: FindingType[];
        meta: Meta;
    };
}

export default function FindingTypeIndex({ findingTypes }: FindingTypeProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'FINDING_TYPE'} className="md:max-w-7xl">
                <TableFindingType findingTypes={findingTypes} />
            </TableLayout>
        </AppLayout>
    );
}
