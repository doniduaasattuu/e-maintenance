import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import { cn } from '@/lib/utils';
import { Position } from '@/types';
import { Check } from 'lucide-react';

interface FilterPositionProps {
    positions: Position[];
}

export default function FilterPosition({ positions }: FilterPositionProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('position');

    return (
        <CommandGroup heading="Position">
            {positions?.map((position) => (
                <CommandItem key={position.code} value={position.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(position.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{position.code + ' - ' + position.name}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('position')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
