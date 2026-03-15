import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import { cn } from '@/lib/utils';
import { MaterialUnit } from '@/types';
import { Check } from 'lucide-react';

interface FilterMaterialUnitProps {
    materialUnits: MaterialUnit[];
}

export default function FilterMaterialUnit({ materialUnits }: FilterMaterialUnitProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('unit');

    return (
        <CommandGroup heading="Material Unit">
            {materialUnits?.map((unit) => (
                <CommandItem key={unit.name} value={unit.name} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(unit.name) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{unit.name}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('unit')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
