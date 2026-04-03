import { CommandGroup, CommandItem } from '@/components/ui/command';
import { useFilterParam } from '@/hooks/use-filter-param';
import truncateText, { cn } from '@/lib/utils';
import { CauseCode } from '@/types';
import { Check } from 'lucide-react';

interface FilterCauseCodeProps {
    causeCodes: CauseCode[];
}

export default function FilterCauseCode({ causeCodes }: FilterCauseCodeProps) {
    const { selectedValues, toggleValue, handleClearAll } = useFilterParam('causeCode');

    return (
        <CommandGroup heading="Cause Code">
            {causeCodes?.map((causeCode: CauseCode) => (
                <CommandItem key={causeCode.id} value={causeCode.code} onSelect={toggleValue}>
                    <Check className={cn('mr-2 h-4 w-4', selectedValues.includes(causeCode.code) ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate text-nowrap">{`${causeCode.code} - ${truncateText(causeCode.description)}`}</span>
                </CommandItem>
            ))}
            <p
                onClick={() => handleClearAll('causeCode')}
                className="text-muted-foreground cursor-default p-4 text-right text-sm hover:text-blue-400"
            >
                Reset
            </p>
        </CommandGroup>
    );
}
