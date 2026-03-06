import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { Finding, FindingPriority, FindingStatus, Meta } from '@/types';
import { router } from '@inertiajs/react';
import ButtonAdd from '../button-add';
import EmptyIcon from '../empty-icon';
import { FindingCard } from '../finding-card';
import { GeneratePagination } from '../generate-pagination';
import SearchBar from '../search-bar';
import { Table, TableCaption } from '../ui/table';

interface FindingTableProps {
    findings: {
        data: Finding[];
        meta: Meta;
    };
    findingPriorities: {
        data: FindingPriority[];
    };
    findingStatuses: {
        data: FindingStatus[];
    };
}

export default function TableFinding({ findings, findingPriorities, findingStatuses }: FindingTableProps) {
    // const [open, setOpen] = React.useState<boolean>(false);
    const can = usePermissions();
    const meta = findings.meta;
    const caption = tableCaption(meta);

    function handleFindingOnclick(id: number) {
        router.get(route('findings.show', id));
    }

    return (
        <TableLayout
            title="Findings"
            description="Represents a unique physical object tracked for maintenance, costing, and history."
            className="md:max-w-full"
        >
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_finding && <ButtonAdd route={route('findings.create')} tabIndex={2} />}
            </div>
            <Table className="space-y-4 p-4">
                <TableCaption className="text-sm">{caption}</TableCaption>
                {findings.data.length > 0 ? (
                    <div className="grid min-w-0 auto-rows-min gap-4 overflow-x-auto rounded-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {findings.data.map((finding: Finding) => {
                            return <FindingCard key={finding.id} finding={finding} onClick={handleFindingOnclick} />;
                        })}
                    </div>
                ) : (
                    <EmptyIcon />
                )}
            </Table>
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
