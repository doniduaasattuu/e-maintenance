import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { EquipmentClass } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterEquipmentClassProps {
    equipmentClasses: EquipmentClass[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterEquipmentClass({ equipmentClasses, setOpen }: FilterEquipmentClassProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('class') || '');

    const handleFilterEquipmentClass = (cls: string) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (cls) {
            searchParams.set('class', cls);
        } else {
            searchParams.delete('class');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Equipment Class">
            {equipmentClasses &&
                equipmentClasses.map((equipmentClass) => (
                    <CommandItem
                        key={equipmentClass.code}
                        value={equipmentClass.code}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            setOpen(false);
                            handleFilterEquipmentClass(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(equipmentClass.code) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{equipmentClass.code + ' - ' + equipmentClass.name}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
