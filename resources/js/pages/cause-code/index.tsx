import TableCauseCode from '@/components/tables/table-cause-code';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, CauseCode, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.CAUSE_CODE?.plural ?? 'Cause Code',
        href: route('cause-codes.index'),
    },
];

interface CauseCodeProps {
    causeCodes: {
        data: CauseCode[];
        meta: Meta;
    };
}

export default function CauseCodeIndex({ causeCodes }: CauseCodeProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'CAUSE_CODE'} className="md:max-w-7xl">
                <TableCauseCode causeCodes={causeCodes} />
            </TableLayout>
        </AppLayout>
    );
}
