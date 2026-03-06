import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FunctionalLocation } from '@/types';
import axios from 'axios';
import { ArrowUpRightFromSquareIcon, Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionConfirm } from './action-confirm';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

type Props = {
    id: string;
    value: string;
    currentValue?: FunctionalLocation | null;
    onChange: (value: number | null) => void;
    tabIndex: number;
    recentlySuccessful: boolean;
    processing: boolean;
    isEditing?: boolean;
    className?: string;
    placeholder?: string;
};

export default function FunctionalLocationSelect({
    id,
    value,
    currentValue,
    onChange,
    tabIndex,
    recentlySuccessful,
    processing,
    isEditing,
    className,
    placeholder,
}: Props) {
    const [input, setInput] = useState('');
    const selected = useRef<FunctionalLocation | null>(null);
    const [options, setOptions] = useState<FunctionalLocation[]>([]);

    const fetchLocations = useCallback(async (search: string) => {
        try {
            const res = await axios.get(route('functional-locations.index'), { params: { query: search } });
            setOptions(res.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            setOptions([]);
        }
    }, []);

    useEffect(() => {
        if (input.length > 0) {
            const delayDebounce = setTimeout(() => {
                fetchLocations(input);
            }, 300);

            return () => clearTimeout(delayDebounce);
        } else {
            if (selected.current) {
                setOptions([selected.current]);
            } else {
                setOptions([]);
            }
        }
    }, [input, fetchLocations]);

    useEffect(() => {
        selected.current = null;
    }, [recentlySuccessful]);

    const handleDismantling = () => {
        selected.current = null;
        onChange(null);
    };

    return (
        <div className={cn('flex justify-between gap-2', className)}>
            <Select disabled={processing}>
                <SelectTrigger tabIndex={tabIndex} id={id} className={`w-full ${selected.current || value ? 'text-foreground!' : undefined}`}>
                    <SelectValue
                        placeholder={
                            value !== '' && currentValue && selected.current == null
                                ? currentValue.code
                                : selected.current
                                  ? selected.current.code
                                  : placeholder
                                    ? placeholder
                                    : 'Select functional location'
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Search..." value={input} onValueChange={(e) => setInput(e.toUpperCase())} />
                        <CommandList>
                            {Array.isArray(options) && options.length > 0 ? (
                                <CommandGroup>
                                    {options.map((loc) => (
                                        <CommandItem
                                            key={loc.id}
                                            onSelect={() => {
                                                if (selected.current && selected.current.id == loc.id) {
                                                    handleDismantling();
                                                } else {
                                                    onChange(loc.id);
                                                    selected.current = loc;
                                                }
                                            }}
                                        >
                                            <div className="flex gap-2">
                                                {selected.current && selected.current?.id == loc.id && <Check />}
                                                <div className="w-full">
                                                    <div className="font-medium">{loc.code}</div>
                                                    <div className="text-muted-foreground max-w-xs truncate text-sm sm:max-w-full">
                                                        {loc.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ) : (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )}
                        </CommandList>
                    </Command>
                </SelectContent>
            </Select>
            {isEditing && value !== '' && (
                <ActionConfirm
                    action={handleDismantling}
                    title="Dismantle from this functional location?"
                    description="This action will dismantling equipment from functional location."
                    actionLabel="Dismantle"
                >
                    <Button title="Dismantle" variant="outline">
                        <ArrowUpRightFromSquareIcon />
                    </Button>
                </ActionConfirm>
            )}
        </div>
    );
}
