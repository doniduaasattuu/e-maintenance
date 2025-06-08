import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Position } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterPositionProps {
    positions: Position[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterPosition({ positions, setOpen }: FilterPositionProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('position') || '');

    const handleFilterPosition = (pos: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (pos) {
            searchParams.set('position', pos);
        } else {
            searchParams.delete('position');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Positions">
            {positions &&
                positions.map((position) => (
                    <CommandItem
                        key={position.code}
                        value={position.code}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            setOpen(false);
                            handleFilterPosition(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(position.code) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{position.code + ' - ' + position.name}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
