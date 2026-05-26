import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { FindingClause } from '@/types';
import { Check } from 'lucide-react';

interface FilterFindingClauseProps {
    findingClauses: FindingClause[];
    filter?: 'AUD' | 'ABN';
}

export default function FilterFindingClause({ findingClauses, filter }: FilterFindingClauseProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('clause');

    if (filter) {
        findingClauses = findingClauses.filter((e: FindingClause) => {
            return e.type.toLowerCase() == filter.toLowerCase();
        });
    }

    return (
        <CommandGroup heading="Finding Clause">
            {findingClauses?.map((findingClause: FindingClause) => (
                <CommandItem key={findingClause.id} value={findingClause.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(findingClause.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{`${findingClause.code} - ${truncateText(findingClause.description)}`}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('clause')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
