import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { MaterialType } from '@/types';
import { Check } from 'lucide-react';

interface FilterMaterialTypeProps {
    materialTypes: MaterialType[];
}

export default function FilterMaterialType({ materialTypes }: FilterMaterialTypeProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('type');

    return (
        <CommandGroup heading="Material Type">
            {materialTypes?.map((type) => (
                <CommandItem key={type.code} value={type.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(type.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{type.code + ' - ' + truncateText(type.description, 40)}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('type')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
