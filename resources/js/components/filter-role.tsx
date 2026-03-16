import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FilterRoleProps {
    roles: string[];
}

export default function FilterRole({ roles }: FilterRoleProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('role');

    return (
        <CommandGroup heading="Role">
            {roles?.map((role) => (
                <CommandItem key={role} value={role} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(role) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{role}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('role')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
