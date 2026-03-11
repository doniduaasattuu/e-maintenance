import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { WorkCenter } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterWorkCenterProps {
    workCenters: WorkCenter[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilterWorkCenter({ workCenters }: FilterWorkCenterProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('work-center') || '');

    const handleFilterWorkCenter = (dept: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (dept) {
            searchParams.set('work-center', dept);
        } else {
            searchParams.delete('work-center');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Work Centers">
            {workCenters &&
                workCenters.map((workCenter) => (
                    <CommandItem
                        key={workCenter.code}
                        value={workCenter.code}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            handleFilterWorkCenter(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(workCenter.code) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{workCenter.code + ' - ' + workCenter.name}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
