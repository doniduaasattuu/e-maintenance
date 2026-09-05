import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import { cn } from '@/lib/utils';
import { ImprovementStatus } from '@/types';
import { Check } from 'lucide-react';

interface FilterImprovementStatusProps {
    improvementStatuses: ImprovementStatus[];
}

export default function FilterImprovementStatus({ improvementStatuses }: FilterImprovementStatusProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('status');

    return (
        <CommandGroup heading="Status">
            {improvementStatuses?.map((improvementStatus: ImprovementStatus) => (
                <CommandItem key={improvementStatus.id} value={improvementStatus.name} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(improvementStatus.name) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{improvementStatus.name}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('status')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
