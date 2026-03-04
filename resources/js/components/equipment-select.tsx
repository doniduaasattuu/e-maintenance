import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Equipment } from '@/types';
import axios from 'axios';
import { Check, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

type Props = {
    id: string;
    value: string;
    currentValue?: Equipment | null;
    onChange: (value: number | null) => void;
    tabIndex: number;
    recentlySuccessful: boolean;
    processing: boolean;
    removable?: boolean;
    className?: string;
};

export default function EquipmentSelect({
    id,
    value,
    currentValue,
    onChange,
    tabIndex,
    recentlySuccessful,
    processing,
    removable,
    className,
}: Props) {
    const [input, setInput] = useState('');
    const selected = useRef<Equipment | null>(null);
    const [options, setOptions] = useState<Equipment[]>([]);

    const fetchLocations = useCallback(async (search: string) => {
        try {
            const res = await axios.get(route('equipments.index'), { params: { query: search } });
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

    const handleRemove = () => {
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
                                  : 'Select equipment'
                        }
                    />
                </SelectTrigger>
                <SelectContent className="max-w-xl">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Search..." value={input} onValueChange={(e) => setInput(e.toUpperCase())} />
                        <CommandList>
                            {Array.isArray(options) && options.length > 0 ? (
                                <CommandGroup>
                                    {options.map((eqp) => (
                                        <CommandItem
                                            key={eqp.id}
                                            onSelect={() => {
                                                if (selected.current && selected.current.id == eqp.id) {
                                                    handleRemove();
                                                } else {
                                                    onChange(eqp.id);
                                                    selected.current = eqp;
                                                }
                                            }}
                                        >
                                            <div className="flex gap-2">
                                                {selected.current && selected.current?.id == eqp.id && <Check />}
                                                <div className="w-full">
                                                    <div className="font-medium">{eqp.code}</div>
                                                    <div className="text-muted-foreground max-w-xs truncate text-sm sm:max-w-full">
                                                        {eqp.sort_field}
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
            {removable && (
                <Button disabled={value === ''} onClick={handleRemove} title="Remove" variant="outline">
                    <X />
                </Button>
            )}
        </div>
    );
}
