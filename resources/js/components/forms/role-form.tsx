import ButtonSubmit from '@/components/button-submit';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Check, ListChecks, X } from 'lucide-react';
import React, { FormEventHandler } from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface RoleFormParams {
    submit: FormEventHandler;
    data: Required<RoleFormData>;
    setData: <K extends keyof RoleFormData>(key: K, value: RoleFormData[K]) => void;
    processing: boolean;
    availablePermissions: string[];
    selectedPermissions: string[];
    setSelectedPermissions: React.Dispatch<React.SetStateAction<string[]>>;
    errors: Partial<Record<keyof RoleFormData, string>>;
    buttonLabel: string;
    canSubmit: boolean;
    recentlySuccessful: boolean;
    successMessage?: string;
    className?: string;
}

export type RoleFormData = {
    name: string;
    selectedPermissions: string[];
};

export default function RoleForm({
    submit,
    data,
    setData,
    processing,
    availablePermissions,
    selectedPermissions,
    setSelectedPermissions,
    errors,
    buttonLabel,
    canSubmit,
    recentlySuccessful,
    successMessage,
    className,
}: RoleFormParams) {
    const [open, setOpen] = React.useState(false);
    const isMobile = useIsMobile();

    const toggle = (item: string) => {
        if (selectedPermissions.includes(item)) {
            setSelectedPermissions(selectedPermissions.filter((v) => v !== item));
        } else {
            setSelectedPermissions([...selectedPermissions, item]);
        }
    };

    React.useEffect(() => {
        setData('selectedPermissions', selectedPermissions);
    }, [selectedPermissions, setData]);

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <div className="flex gap-2">
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Inspector"
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpen(true);
                                }}
                                tabIndex={2}
                            >
                                <ListChecks /> {isMobile ? null : 'Permissions'}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-62.5 p-0" align="end">
                            <Command>
                                <CommandInput placeholder="Search..." />
                                <CommandList>
                                    <CommandEmpty>No item found.</CommandEmpty>
                                    {availablePermissions.map((item) => (
                                        <CommandItem key={item} onSelect={() => toggle(item)} className="cursor-pointer">
                                            <Check className={cn('mr-2 h-4 w-4', selectedPermissions.includes(item) ? 'opacity-100' : 'opacity-0')} />
                                            {item}
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <FieldError>{errors.name || errors.selectedPermissions}</FieldError>
            </Field>

            <div className="flex flex-wrap gap-2">
                {selectedPermissions.length > 0 ? (
                    selectedPermissions.map((item) => (
                        <Badge key={item} variant="secondary" className="flex cursor-pointer items-center gap-1" onClick={() => toggle(item)}>
                            {item}
                            <X className="ml-1 h-3 w-3" />
                        </Badge>
                    ))
                ) : (
                    <Badge
                        onClick={() => {
                            setOpen(true);
                        }}
                        variant="destructive"
                        className="flex cursor-pointer items-center gap-1"
                    >
                        No permission selected.
                    </Badge>
                )}
            </div>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    label={buttonLabel}
                    disabled={processing || selectedPermissions.length < 1 || data.name === ''}
                    tabIndex={3}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
