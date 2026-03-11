import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Department } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterDepartmentProps {
    departments: Department[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterDepartment({ departments }: FilterDepartmentProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('department') || '');

    const handleFilterDepartment = (dept: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (dept) {
            searchParams.set('department', dept);
        } else {
            searchParams.delete('department');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Departments">
            {departments &&
                departments.map((department) => (
                    <CommandItem
                        key={department.code}
                        value={department.code}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            handleFilterDepartment(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(department.code) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{department.code + ' - ' + department.name}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
