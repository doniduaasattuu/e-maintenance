import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { EquipmentStatus } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterEquipmentStatusProps {
    equipmentStatuses: EquipmentStatus[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterEquipmentStatus({ equipmentStatuses, setOpen }: FilterEquipmentStatusProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('status') || '');

    const handleFilterEquipmentStatus = (cls: string) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (cls) {
            searchParams.set('status', cls);
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
        <CommandGroup heading="Equipment Status">
            {equipmentStatuses &&
                equipmentStatuses.map((equipmentStatus) => (
                    <CommandItem
                        key={equipmentStatus.code}
                        value={equipmentStatus.code}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            setOpen(false);
                            handleFilterEquipmentStatus(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(equipmentStatus.code) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{equipmentStatus.code + ' - ' + equipmentStatus.name}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
