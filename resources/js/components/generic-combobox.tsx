'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

// Definisi Interface menggunakan Generic <T>
interface GenericComboboxProps<T> {
    options: T[];
    valueKey: keyof T; // Field untuk ID/Value (e.g., 'id', 'code')
    labelKey: keyof T; // Field untuk tampilan (e.g., 'name', 'title')
    tabIndex?: number;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    onChange?: (value: string) => void;
    defaultValue?: string;
    id?: string;
}

export function GenericCombobox<T>({
    options,
    valueKey,
    labelKey,
    placeholder = 'Pilih data...',
    emptyMessage = 'Data not found.',
    className,
    onChange,
    defaultValue = '',
    tabIndex,
    id,
}: GenericComboboxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(defaultValue);

    const selectedLabel = React.useMemo(() => {
        const selected = options.find((opt) => String(opt[valueKey]) === value);
        return selected ? String(selected[labelKey]) : placeholder;
    }, [value, options, valueKey, labelKey, placeholder]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    tabIndex={tabIndex}
                    size={'sm'}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(`w-full justify-between ${defaultValue ? undefined : 'text-muted-foreground'}`, className)}
                >
                    <span className="truncate">{selectedLabel}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
                <Command>
                    <CommandInput className="w-full text-base sm:text-sm" placeholder={`Search ${placeholder.toLowerCase()}...`} />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option, index) => {
                                const val = String(option[valueKey]);
                                const label = String(option[labelKey]);

                                return (
                                    <CommandItem
                                        key={index}
                                        value={label}
                                        onSelect={() => {
                                            const newValue = val === value ? '' : val;
                                            if (newValue) {
                                                setValue(newValue);
                                                onChange?.(newValue);
                                                setOpen(false);
                                            }
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', value === val ? 'opacity-100' : 'opacity-0')} />
                                        {label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
