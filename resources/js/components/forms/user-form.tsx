import ButtonSubmit from '@/components/button-submit';
import InputError from '@/components/input-error';
import { Command, CommandEmpty, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import TableLayout from '@/layouts/table/layout';
import { cn } from '@/lib/utils';
import { Department, Position, WorkCenter } from '@/types';
import { Check, ListChecks, X } from 'lucide-react';
import React, { FormEventHandler } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

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
        <React.Fragment>
            <TableLayout title="Users" description="User management">
                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
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
                            <InputError message={errors.name} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="employee_id">Employee ID</Label>
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
                            <InputError message={errors.employee_id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
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
                            <InputError message={errors.email} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone_number">Phone</Label>
                            <Input
                                id="phone_number"
                                type="text"
                                tabIndex={4}
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                disabled={processing}
                                placeholder="+62213441316"
                            />
                            <InputError message={errors.phone_number} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="department">Department</Label>
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
                            <InputError message={errors.department_id} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="position">Position</Label>
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
                            <InputError message={errors.position_id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="work_center">Work Center</Label>
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
                            <InputError message={errors.work_center_id} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="avatar">Avatar</Label>
                            <Input
                                id="avatar"
                                type="file"
                                disabled={processing}
                                ref={fileInputRef}
                                tabIndex={8}
                                onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                                accept=".jpg,.jpeg,.png,.webp"
                            />
                            <InputError message={errors.avatar} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="roles">Roles</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild disabled={processing}>
                                <Button
                                    type="button"
                                    id="roles"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(!open);
                                    }}
                                    tabIndex={9}
                                >
                                    <ListChecks /> Roles
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
                        <InputError message={errors.selectedRoles} />
                    </div>

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

                    {canSubmit && <ButtonSubmit label={buttonLabel} disabled={processing} tabIndex={10} />}
                </form>
            </TableLayout>
        </React.Fragment>
    );
}
