import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { Department } from '@/types';
import { Check } from 'lucide-react';

interface FilterDepartmentProps {
    departments: Department[];
}

export default function FilterDepartment({ departments }: FilterDepartmentProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('department');

    return (
        <CommandGroup heading="Department">
            {departments?.map((department) => (
                <CommandItem key={department.code} value={department.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(department.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{department.code + ' - ' + truncateText(department.name)}</span>
                </CommandItem>
            ))}
            <p
                onClick={() => handleClearAll('department')}
                className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400"
            >
                Reset
            </p>
        </CommandGroup>
    );
}
