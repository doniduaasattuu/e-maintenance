import TableFindingType from '@/components/tables/table-finding-type';
import AppLayout from '@/layouts/app-layout';
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
            <TableFindingType findingTypes={findingTypes} />
        </AppLayout>
    );
}
