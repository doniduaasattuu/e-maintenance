import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FilterRepositoryExtensionProps {
    extensions: string[] | undefined;
}

export default function FilterRepositoryExtension({ extensions }: FilterRepositoryExtensionProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('ext');

    return (
        <CommandGroup heading="Extensions">
            {extensions?.map((extension) => (
                <CommandItem key={extension} value={extension} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(extension) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{extension}</span>
                </CommandItem>
            ))}
            <p onClick={() => handleClearAll('ext')} className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400">
                Reset
            </p>
        </CommandGroup>
    );
}
