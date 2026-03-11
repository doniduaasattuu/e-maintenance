import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { MaterialType } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterMaterialTypeProps {
    materialTypes: MaterialType[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    unitName?: string;
}

export default function FilterMaterialType({ materialTypes }: FilterMaterialTypeProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('type') || '');

    const handleFilterMaterialType = (type: string) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (type) {
            searchParams.set('type', type);
        } else {
            searchParams.delete('type');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Material Type">
            {materialTypes &&
                materialTypes.map((type) => (
                    <CommandItem
                        key={type.id}
                        value={type.code}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            handleFilterMaterialType(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(type.code) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{type.code + ' - ' + type.description}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
