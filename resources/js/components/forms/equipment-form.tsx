import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import usePermissions from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
import { EquipmentClass, EquipmentStatus, FunctionalLocation } from '@/types';
import { Info } from 'lucide-react';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import FunctionalLocationSelect from '../functional-location-select';
import TextLink from '../text-link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export type EquipmentFormData = {
    code: string;
    sort_field: string;
    description: string;
    functional_location_id: string;
    equipment_class_id: string;
    equipment_status_id: string;
};

interface EquipmentFormProps {
    id?: number | undefined;
    functionalLocation?: FunctionalLocation | null;
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
    isEditing?: boolean;
    className?: string;
}

export default function EquipmentForm({
    id,
    functionalLocation,
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
    isEditing,
    className,
}: EquipmentFormProps) {
    const can = usePermissions();

    return (
        <form onSubmit={submit} className={cn('space-y-6', className)}>
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
                    className="mt-1"
                    value={data.functional_location_id}
                    isEditing={isEditing}
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    tabIndex={4}
                    id="functional_location_id"
                    currentValue={functionalLocation}
                    onChange={(val) => setData('functional_location_id', val ? val.toString() : '')}
                />

                <InputError message={errors.functional_location_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="equipment_class_id">Equipment class</Label>
                <Select disabled={processing} onValueChange={(e) => setData('equipment_class_id', e)} value={data.equipment_class_id}>
                    <SelectTrigger tabIndex={5} className="mt-1 truncate overflow-hidden whitespace-nowrap">
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
                    <SelectTrigger tabIndex={6} className="mt-1 truncate overflow-hidden whitespace-nowrap">
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

            {isEditing && (
                <Alert>
                    <Info />
                    <AlertTitle>Note</AlertTitle>
                    <AlertDescription>
                        <span>Changes to equipment status or functional location will be recorded in the equipment's install/dismantle history.</span>
                        {can.read_installdismantlehistory && <TextLink href={route('equipments.history', id)}>View history</TextLink>}
                    </AlertDescription>
                </Alert>
            )}

            {canSubmit && (
                <ButtonSubmit
                    label={buttonLabel}
                    disabled={
                        processing || data.code == '' || data.description == '' || data.equipment_class_id == '' || data.equipment_status_id == ''
                    }
                    tabIndex={7}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={successMessage}
                />
            )}
        </form>
    );
}
