import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterRoleProps {
    roles: string[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterRole({ roles, setOpen }: FilterRoleProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('role') || '');

    const handleFilterRole = (role: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (role) {
            searchParams.set('role', role);
        } else {
            searchParams.delete('role');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Roles">
            {roles &&
                roles.map((role) => (
                    <CommandItem
                        key={role}
                        value={role}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            setOpen(false);
                            handleFilterRole(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(role) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{role}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
