import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

type FunctionalLocation = {
    id: number;
    code: string;
    description: string;
};

type Props = {
    id: string;
    value?: string;
    onChange: (value: number | null) => void;
    tabIndex: number;
    recentlySuccessful: boolean;
};

export default function FunctionalLocationSelect({ id, value, onChange, tabIndex, recentlySuccessful }: Props) {
    const [input, setInput] = useState('');
    const [selected, setSelected] = useState<FunctionalLocation | null>(null);
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
            if (selected) {
                setOptions([selected]);
            }
        }
    }, [input, fetchLocations, selected]);

    useEffect(() => {
        setSelected(null);
    }, [recentlySuccessful]);

    return (
        <Select>
            <SelectTrigger tabIndex={tabIndex} id={id} className={`w-full ${selected ? '!text-foreground' : undefined}`}>
                <SelectValue placeholder={selected ? selected.code : 'Select functional location'} />
            </SelectTrigger>
            <SelectContent className="max-h-56">
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Search..." value={input} onValueChange={(e) => setInput(e.toUpperCase())} />
                    <CommandList>
                        {Array.isArray(options) && options.length > 0 ? (
                            <CommandGroup>
                                {options.map((loc) => (
                                    <CommandItem
                                        key={loc.id}
                                        onSelect={() => {
                                            if (selected && selected.id == loc.id) {
                                                onChange(null);
                                                setSelected(null);
                                                onChange(null);
                                            } else {
                                                onChange(loc.id);
                                                setSelected(loc);
                                            }
                                        }}
                                    >
                                        <div className="flex gap-2">
                                            {value != null && Number(value) == loc.id && <Check />}
                                            <div>
                                                <div className="font-medium">{loc.code}</div>
                                                <div className="text-muted-foreground text-sm">{loc.description}</div>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : (
                            <CommandEmpty key="no-results">No results found.</CommandEmpty>
                        )}
                    </CommandList>
                </Command>
            </SelectContent>
        </Select>
    );
}
