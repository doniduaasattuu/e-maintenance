import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import { cn } from '@/lib/utils';
import { EquipmentStatus } from '@/types';
import { Check } from 'lucide-react';

interface FilterEquipmentStatusProps {
    equipmentStatuses: EquipmentStatus[];
}

export default function FilterEquipmentStatus({ equipmentStatuses }: FilterEquipmentStatusProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('status');

    return (
        <CommandGroup heading="Equipment Status">
            {equipmentStatuses?.map((equipmentStatus: EquipmentStatus) => (
                <CommandItem key={equipmentStatus.id} value={equipmentStatus.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(equipmentStatus.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{`${equipmentStatus.code} - ${equipmentStatus.name}`}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('status')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
