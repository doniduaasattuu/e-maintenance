import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { FindingPriority } from '@/types';
import { Check } from 'lucide-react';

interface FilterFindingPrioritiesProps {
    findingPriorities: FindingPriority[];
}

export default function FilterFindingPriority({ findingPriorities }: FilterFindingPrioritiesProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('priority');

    return (
        <CommandGroup heading="Finding Priority">
            {findingPriorities?.map((findingPriority: FindingPriority) => (
                <CommandItem key={findingPriority.id} value={findingPriority.label} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(findingPriority.label) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{`${findingPriority.label} - ${truncateText(findingPriority.description)}`}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('priority')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
