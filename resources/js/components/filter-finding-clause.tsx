import { CommandGroup, CommandItem } from '@/components/ui/command';
import truncateText, { cn } from '@/lib/utils';
import { FindingClause } from '@/types';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

interface FilterFindingClauseProps {
    findingClauses: FindingClause[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export default function FilterFindingClause({ findingClauses, setOpen }: FilterFindingClauseProps) {
    const [value, setValue] = React.useState<string>(new URLSearchParams(window.location.search).get('clause') || '');

    const handleFilterFindingClause = (clause: string | null) => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('page')) {
            searchParams.set('page', '1');
        }

        if (clause) {
            searchParams.set('clause', clause);
        } else {
            searchParams.delete('clause');
        }

        router.get(window.location.pathname, Object.fromEntries(searchParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <CommandGroup heading="Clause">
            {findingClauses &&
                findingClauses.map((findingClause) => (
                    <CommandItem
                        key={findingClause.id}
                        value={findingClause.code}
                        onSelect={(currentValue) => {
                            const selectedValue = currentValue === value ? '' : currentValue;
                            setValue(selectedValue);
                            setOpen(false);
                            handleFilterFindingClause(selectedValue);
                        }}
                    >
                        <Check className={cn('mr-2 h-4 w-4', value === findingClause.code ? 'opacity-100' : 'opacity-0')} />
                        <span className="truncate text-nowrap">
                            {findingClause.code} - {truncateText(findingClause.description, 40)}
                        </span>
                    </CommandItem>
                ))}
        </CommandGroup>
    );
}
