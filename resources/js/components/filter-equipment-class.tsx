import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { EquipmentClass } from '@/types';
import { Check } from 'lucide-react';

interface FilterEquipmentClassProps {
    equipmentClasses: EquipmentClass[];
}

export default function FilterEquipmentClass({ equipmentClasses }: FilterEquipmentClassProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('class');

    return (
        <CommandGroup heading="Equipment Class">
            {equipmentClasses?.map((equipmentClass: EquipmentClass) => (
                <CommandItem key={equipmentClass.id} value={equipmentClass.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(equipmentClass.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{`${equipmentClass.name} - ${truncateText(equipmentClass.description ?? '')}`}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('class')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
