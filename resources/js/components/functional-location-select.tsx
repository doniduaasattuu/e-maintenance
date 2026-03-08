/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FunctionalLocation } from '@/types';
import axios from 'axios';
import { ArrowUpRightFromSquareIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ActionConfirm } from './action-confirm';

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
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [options, setOptions] = useState<FunctionalLocation[]>([]);
    // Gunakan state untuk UI yang reaktif, bukan Ref
    const [selectedLoc, setSelectedLoc] = useState<FunctionalLocation | null>(currentValue || null);

    const fetchLocations = useCallback(async (search: string) => {
        try {
            const res = await axios.get(route('functional-locations.index'), { params: { query: search } });
            setOptions(res.data);
        } catch (err) {
            setOptions([]);
        }
    }, []);

    useEffect(() => {
        if (input.length > 0) {
            const delayDebounce = setTimeout(() => fetchLocations(input), 300);
            return () => clearTimeout(delayDebounce);
        } else {
            setOptions(selectedLoc ? [selectedLoc] : []);
        }
    }, [input, fetchLocations, selectedLoc]);

    // Reset state jika transaksi sukses (misal setelah simpan form)
    useEffect(() => {
        if (recentlySuccessful) setSelectedLoc(null);
    }, [recentlySuccessful]);

    const handleDismantling = () => {
        setSelectedLoc(null);
        onChange(null);
    };

    return (
        <div className={cn('flex w-full items-center gap-2', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        tabIndex={tabIndex}
                        disabled={processing}
                        className={cn('border-muted-background w-full justify-between border font-normal', !selectedLoc && 'text-muted-foreground')}
                    >
                        <span className="truncate">{selectedLoc ? selectedLoc.code : placeholder || 'Select location...'}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search..."
                            value={input}
                            onValueChange={(v) => setInput(v)}
                            className="w-full text-base sm:text-sm"
                        />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((loc) => (
                                    <CommandItem
                                        key={loc.id}
                                        value={loc.code}
                                        onSelect={() => {
                                            onChange(loc.id);
                                            setSelectedLoc(loc);
                                            setOpen(false);
                                            setInput('');
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedLoc?.id === loc.id ? 'opacity-100' : 'opacity-0')} />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{loc.code}</span>
                                            <span className="text-muted-foreground line-clamp-1 text-xs">{loc.description}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {isEditing && value !== '' && (
                <ActionConfirm
                    action={handleDismantling}
                    title="Dismantle?"
                    description="Dismantle equipment from this location."
                    actionLabel="Dismantle"
                >
                    <Button title="Dismantle" variant="outline" size="icon" className="shrink-0">
                        <ArrowUpRightFromSquareIcon className="size-4" />
                    </Button>
                </ActionConfirm>
            )}
        </div>
    );
}
