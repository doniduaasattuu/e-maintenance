import { Finding } from '@/types';
import EmptyIcon from './empty-icon';
import { FindingCard } from './finding-card';
import { Table, TableCaption } from './ui/table';

interface IterateFindingProps {
    findings: {
        data: Finding[];
    };
    caption: string;
    handleFindingOnclick: (id: number) => void;
}

export default function FindingCards({ findings, caption, handleFindingOnclick }: IterateFindingProps) {
    return (
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
    );
}
