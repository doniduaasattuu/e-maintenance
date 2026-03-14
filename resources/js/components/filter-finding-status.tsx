import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { FindingStatus } from '@/types';
import { Check } from 'lucide-react';

interface FilterFindingStatusProps {
    findingStatuses: FindingStatus[];
}

export default function FilterFindingStatus({ findingStatuses }: FilterFindingStatusProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('status');

    return (
        <CommandGroup heading="Finding Status">
            {findingStatuses?.map((findingStatus: FindingStatus) => (
                <CommandItem key={findingStatus.id} value={findingStatus.name} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(findingStatus.name) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{`${findingStatus.name} - ${truncateText(findingStatus.description)}`}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('status')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
