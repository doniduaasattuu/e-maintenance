import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { FindingStatus } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterFindingStatusProps {
    findingStatuses: FindingStatus[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterFindingStatus({ findingStatuses }: FilterFindingStatusProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('status') || '');

    const handleFilterFindingStatus = (status: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (status) {
            searchParams.set('status', status);
        } else {
            searchParams.delete('status');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Status">
            {findingStatuses &&
                findingStatuses.map((findingStatus) => (
                    <CommandItem
                        key={findingStatus.name}
                        value={findingStatus.name}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            handleFilterFindingStatus(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === findingStatus.name ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{findingStatus.name}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
