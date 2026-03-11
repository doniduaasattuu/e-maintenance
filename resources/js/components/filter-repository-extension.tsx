import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterRepositoryExtensionProps {
    extensions?: string[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterRepositoryExtension({ extensions }: FilterRepositoryExtensionProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('ext') || '');

    const handleFilterRepositoryExtension = (ext: string) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (ext) {
            searchParams.set('ext', ext);
        } else {
            searchParams.delete('ext');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Extension File">
            {extensions &&
                extensions.map((extension) => (
                    <CommandItem
                        key={extension}
                        value={extension}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            handleFilterRepositoryExtension(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === String(extension) ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">{extension}</span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
