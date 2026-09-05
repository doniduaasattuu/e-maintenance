import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { ImprovementCategory } from '@/types';
import { Check } from 'lucide-react';

interface FilterImprovementCategoryProps {
    improvementCategories: ImprovementCategory[];
}

export default function FilterImprovementCategory({ improvementCategories }: FilterImprovementCategoryProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('category');

    return (
        <CommandGroup heading="Category">
            {improvementCategories?.map((improvementCategory: ImprovementCategory) => (
                <CommandItem key={improvementCategory.id} value={improvementCategory.name} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(improvementCategory.name) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{`${improvementCategory.name} - ${truncateText(improvementCategory.description)}`}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('category')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
