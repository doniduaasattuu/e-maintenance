import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import { cn } from '@/lib/utils';
import { WorkCenter } from '@/types';
import { Check } from 'lucide-react';

interface FilterWorkCenterProps {
    workCenters: WorkCenter[];
}

export default function FilterWorkCenter({ workCenters }: FilterWorkCenterProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('work-center');

    return (
        <CommandGroup heading="Work Center">
            {workCenters?.map((work_center) => (
                <CommandItem key={work_center.code} value={work_center.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(work_center.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{work_center.code + ' - ' + work_center.name}</span>
                </CommandItem>
            ))}
            <p
                onClick={() => handleClearAll('work-center')}
                className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400"
            >
                Reset
            </p>
        </CommandGroup>
    );
}
