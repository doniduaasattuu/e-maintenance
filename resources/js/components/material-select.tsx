/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Material } from '@/types';
import axios from 'axios';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type Props = {
    id: string;
    value: string;
    currentValue?: Material | null;
    onChange: (value: number | null) => void;
    tabIndex: number;
    recentlySuccessful?: boolean;
    processing: boolean;
    isEditing?: boolean;
    className?: string;
    placeholder?: string;
};

export default function MaterialSelect({
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
    const [options, setOptions] = useState<Material[]>([]);
    // Gunakan state untuk UI yang reaktif, bukan Ref
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(currentValue || null);

    const fetchMaterials = useCallback(async (search: string) => {
        try {
            const res = await axios.get(route('materials.index'), { params: { query: search } });
            setOptions(res.data);
        } catch (err) {
            setOptions([]);
        }
    }, []);

    useEffect(() => {
        if (input?.trim().length > 0) {
            const delayDebounce = setTimeout(() => fetchMaterials(input), 300);
            return () => clearTimeout(delayDebounce);
        } else {
            setOptions(selectedMaterial ? [selectedMaterial] : []);
        }
    }, [input, fetchMaterials, selectedMaterial]);

    useEffect(() => {
        if (recentlySuccessful) setSelectedMaterial(null);
    }, [recentlySuccessful]);

    return (
        <div className={cn('flex w-full items-center gap-2', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size={'sm'}
                        id={id}
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        tabIndex={tabIndex}
                        disabled={processing}
                        className={cn(
                            'border-muted-background w-full justify-between border font-normal',
                            !selectedMaterial && 'text-muted-foreground',
                        )}
                    >
                        <span className="truncate">{selectedMaterial ? selectedMaterial.code : placeholder || 'Select material...'}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
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
                                {options.map((e: Material) => (
                                    <CommandItem
                                        key={e.id}
                                        value={e.code}
                                        onSelect={() => {
                                            onChange(e.id);
                                            setSelectedMaterial(e);
                                            setOpen(false);
                                            setInput('');
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedMaterial?.id === e.id ? 'opacity-100' : 'opacity-0')} />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{e.code}</span>
                                            <span className="text-muted-foreground line-clamp-1 text-xs">{e.name}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
