import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import TableLayout from '@/layouts/table/layout';
import { EquipmentClass, EquipmentStatus } from '@/types';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import FunctionalLocationSelect from '../functional-location-select';

export type EquipmentFormData = {
    code: string;
    sort_field: string;
    description: string;
    functional_location_id: string;
    equipment_class_id: string;
    equipment_status_id: string;
};

interface EquipmentFormProps {
    equipmentClasses: {
        data: EquipmentClass[];
    };
    equipmentStatuses: {
        data: EquipmentStatus[];
    };
    data: Required<EquipmentFormData>;
    setData: <K extends keyof EquipmentFormData>(key: K, value: EquipmentFormData[K]) => void;
    errors: Partial<Record<keyof EquipmentFormData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    submit: FormEventHandler;
    canSubmit: boolean;
    buttonLabel: string;
    successMessage?: string;
}

export default function EquipmentForm({
    equipmentClasses,
    equipmentStatuses,
    data,
    setData,
    errors,
    processing,
    submit,
    canSubmit,
    buttonLabel,
    recentlySuccessful,
    successMessage,
}: EquipmentFormProps) {
    return (
        <TableLayout title="Equipments" description="Overview and management of equipments in the system">
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="code">Code</Label>

                    <Input
                        tabIndex={1}
                        id="code"
                        maxLength={9}
                        className="mt-1 block w-full"
                        value={data.code}
                        autoFocus
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        placeholder="EMO000123"
                        required
                        disabled={processing}
                        autoComplete="code"
                    />

                    <InputError message={errors.code} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="sort_field">Sort field</Label>

                    <Input
                        tabIndex={2}
                        id="sort_field"
                        className="mt-1 block w-full"
                        value={data.sort_field}
                        onChange={(e) => setData('sort_field', e.target.value.toUpperCase())}
                        placeholder="PM1.BR.C2/P1/M"
                        disabled={processing}
                        autoComplete="sort_field"
                    />

                    <InputError message={errors.sort_field} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>

                    <Input
                        tabIndex={3}
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value.toUpperCase())}
                        placeholder="AC MOTOR;380V,50Hz,90kW,4P,280M,B3"
                        required
                        disabled={processing}
                        autoComplete="description"
                    />

                    <InputError message={errors.description} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="functional_location_id">Functional location</Label>

                    <FunctionalLocationSelect
                        recentlySuccessful={recentlySuccessful}
                        tabIndex={4}
                        id="functional_location_id"
                        value={data.functional_location_id}
                        onChange={(val) => setData('functional_location_id', val ? val.toString() : '')}
                    />

                    <InputError message={errors.functional_location_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="equipment_class_id">Equipment class</Label>
                    <Select disabled={processing} onValueChange={(e) => setData('equipment_class_id', e)} value={data.equipment_class_id}>
                        <SelectTrigger tabIndex={5} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select a equipment class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Equipment class</SelectLabel>
                                {equipmentClasses.data.map((p) => {
                                    return (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.code + ' - ' + p.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.equipment_class_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="equipment_status_id">Equipment status</Label>
                    <Select disabled={processing} onValueChange={(e) => setData('equipment_status_id', e)} value={data.equipment_status_id}>
                        <SelectTrigger tabIndex={6} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select a equipment status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Equipment status</SelectLabel>
                                {equipmentStatuses.data.map((p) => {
                                    return (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.code + ' - ' + p.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.equipment_status_id} />
                </div>

                {canSubmit && (
                    <ButtonSubmit
                        label={buttonLabel}
                        // disabled={
                        //     processing ||
                        //     data.code == '' ||
                        //     data.sort_field == '' ||
                        //     data.description == '' ||
                        //     data.equipment_class_id == '' ||
                        //     data.equipment_status_id == ''
                        // }
                        disabled={processing}
                        tabIndex={7}
                        recentlySuccessful={recentlySuccessful}
                        successMessage={successMessage}
                    />
                )}
            </form>
        </TableLayout>
    );
}
