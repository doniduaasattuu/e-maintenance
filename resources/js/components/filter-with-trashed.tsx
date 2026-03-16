import { CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

export default function FilterWithTrashed() {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('withTrashed') || '');

    const handleWithTrashed = (withTrashed: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (withTrashed) {
            searchParams.set('withTrashed', withTrashed);
        } else {
            searchParams.delete('withTrashed');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="With trashed">
            <CommandItem
                key={'true'}
                value={'true'}
                onSelect={(currentValue) => {
                    const selectedValue = currentValue === value ? '' : currentValue;
                    setValue(selectedValue);
                    handleWithTrashed(selectedValue);
                }}
            >
                <Check className={cn('mr-2 h-4 w-4', value === 'true' ? 'opacity-100' : 'opacity-0')} />
                <span className="truncate text-nowrap">Yes</span>
            </CommandItem>
        </CommandGroup>
    );
}
