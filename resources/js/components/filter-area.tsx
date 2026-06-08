import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FilterAreaProps {
    areaOptions: {
        value: string;
        label: string;
    }[];
}

export default function FilterArea({ areaOptions }: FilterAreaProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('area');

    return (
        <CommandGroup heading="Area">
            {areaOptions?.map((area) => (
                <CommandItem key={area.value} value={area.value} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(area.value) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{area.value + ' - ' + truncateText(area.label)}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('area')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
