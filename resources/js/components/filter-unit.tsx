import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Unit } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterUnitProps {
    units: Unit[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    unitName?: string;
}

export default function FilterUnit({ units }: FilterUnitProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('unit') || '');

    const handleFilterUnit = (unit: string) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (unit) {
            searchParams.set('unit', unit);
        } else {
            searchParams.delete('unit');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Unit">
            {units &&
                units.map((unit) => (
                    <CommandItem
                        key={unit.id}
                        value={unit.name}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            handleFilterUnit(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(unit.name) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{unit.name}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
