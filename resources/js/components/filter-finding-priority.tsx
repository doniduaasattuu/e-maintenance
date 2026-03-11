import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { FindingPriority } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterFindingPriorityProps {
    findingPriorities: FindingPriority[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterFindingPriority({ findingPriorities }: FilterFindingPriorityProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('priority') || '');

    const handleFilterFindingPriority = (priority: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (priority) {
            searchParams.set('priority', priority);
        } else {
            searchParams.delete('priority');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Priority">
            {findingPriorities &&
                findingPriorities.map((findingStatus) => (
                    <CommandItem
                        key={findingStatus.label}
                        value={findingStatus.label}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            handleFilterFindingPriority(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === findingStatus.label ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{findingStatus.label}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
