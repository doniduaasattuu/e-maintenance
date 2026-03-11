import ButtonSubmit from '@/components/button-submit';
import { Command, CommandEmpty, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Department, Position, WorkCenter } from '@/types';
import { Check, ListChecks, X } from 'lucide-react';
import React, { FormEventHandler } from 'react';
import RequiredLabel from '../required-label';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface UserFormParams {
    submit: FormEventHandler;
    data: Required<UserFormData>;
    setData: <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => void;
    processing: boolean;
    departments: { data: Department[] };
    positions: { data: Position[] };
    workCenters: { data: WorkCenter[] };
    availableRoles: string[];
    selectedRoles: string[];
    setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
    errors: Partial<Record<keyof UserFormData, string>>;
    buttonLabel: string;
    canSubmit: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    recentlySuccessful: boolean;
    successMessage?: string;
    className?: string;
}

export type UserFormData = {
    name: string;
    employee_id: string;
    email: string;
    phone_number?: string;
    department_id?: string;
    position_id?: string;
    work_center_id?: string;
    avatar?: File | null;
    selectedRoles?: string[];
};

export default function UserForm({
    submit,
    data,
    setData,
    errors,
    processing,
    departments,
    positions,
    workCenters,
    availableRoles,
    selectedRoles,
    setSelectedRoles,
    buttonLabel,
    canSubmit,
    fileInputRef,
    recentlySuccessful,
    successMessage,
    className,
}: UserFormParams) {
    const [open, setOpen] = React.useState(false);

    const toggle = (item: string) => {
        if (selectedRoles.includes(item)) {
            setSelectedRoles(selectedRoles.filter((v) => v !== item));
        } else {
            setSelectedRoles([...selectedRoles, item]);
        }
    };

    React.useEffect(() => {
        setData('selectedRoles', selectedRoles);
    }, [selectedRoles, setData]);

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                <Field>
                    <FieldLabel htmlFor="name">
                        Name
                        <RequiredLabel />
                    </FieldLabel>
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
                        placeholder="John Doe"
                    />
                    <FieldError>{errors.name}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="employee_id">
                        Employee ID
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="employee_id"
                        type="text"
                        required
                        tabIndex={2}
                        autoComplete="employee_id"
                        value={data.employee_id}
                        onChange={(e) => setData('employee_id', e.target.value)}
                        disabled={processing}
                        placeholder="11001001"
                    />
                    <FieldError>{errors.employee_id}</FieldError>
                </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                <Field>
                    <FieldLabel htmlFor="email">
                        Email
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        tabIndex={3}
                        value={data.email}
                        disabled={processing}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                        placeholder="john.doe@gmail.com"
                    />
                    <FieldError>{errors.email}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="phone_number">Phone</FieldLabel>
                    <Input
                        id="phone_number"
                        type="text"
                        tabIndex={4}
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        disabled={processing}
                        placeholder="+62213441316"
                    />
                    <FieldError>{errors.phone_number}</FieldError>
                </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                <Field>
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <Select disabled={processing} onValueChange={(e) => setData('department_id', e)} value={data.department_id}>
                        <SelectTrigger tabIndex={5} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Departments</SelectLabel>
                                {departments.data.map((d) => {
                                    return (
                                        <SelectItem key={d.id} value={d.id.toString()}>
                                            {d.code + ' - ' + d.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.department_id}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="position">Position</FieldLabel>
                    <Select disabled={processing} onValueChange={(e) => setData('position_id', e)} value={data.position_id}>
                        <SelectTrigger tabIndex={6} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Positions</SelectLabel>
                                {positions.data.map((p) => {
                                    return (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.code + ' - ' + p.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.position_id}</FieldError>
                </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                <Field>
                    <FieldLabel htmlFor="work_center">Work Center</FieldLabel>
                    <Select disabled={processing} onValueChange={(e) => setData('work_center_id', e)} value={data.work_center_id}>
                        <SelectTrigger tabIndex={7} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select a work center" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Work centers</SelectLabel>
                                {workCenters.data.map((p) => {
                                    return (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.code + ' - ' + p.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.work_center_id}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                    <Input
                        id="avatar"
                        type="file"
                        disabled={processing}
                        ref={fileInputRef}
                        tabIndex={8}
                        onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                        accept=".jpg,.jpeg,.png,.webp"
                    />
                    <FieldError>{errors.avatar}</FieldError>
                </Field>
            </div>

            <Field>
                <FieldLabel htmlFor="roles">Roles</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild disabled={processing}>
                        <Button
                            size={'sm'}
                            type="button"
                            id="roles"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                setOpen(!open);
                            }}
                            tabIndex={9}
                        >
                            <ListChecks />
                            Select Roles
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0" align="end">
                        <Command>
                            <CommandList>
                                <CommandEmpty>No item found.</CommandEmpty>
                                {availableRoles.map((item) => (
                                    <CommandItem key={item} onSelect={() => toggle(item)} className="cursor-pointer">
                                        <Check className={cn('mr-2 h-4 w-4', selectedRoles.includes(item) ? 'opacity-100' : 'opacity-0')} />
                                        {item}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <FieldError>{errors.selectedRoles}</FieldError>
            </Field>

            <div className="flex flex-wrap gap-2">
                {selectedRoles.length > 0 ? (
                    selectedRoles.map((item) => (
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
                        No role selected.
                    </Badge>
                )}
            </div>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    label={buttonLabel}
                    disabled={processing || data.name == '' || data.employee_id == '' || data.email == ''}
                    tabIndex={10}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
