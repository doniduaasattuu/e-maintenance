import usePermissions from '@/hooks/use-permissions';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import InputError from '../input-error';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

export type InspectionTransformerData = {
    equipment_id: number;
    is_operational: string;
    is_clean: string;
    primary_current_r: string;
    primary_current_s: string;
    primary_current_t: string;
    primary_voltage_r: string;
    primary_voltage_s: string;
    primary_voltage_t: string;
    secondary_current_r: string;
    secondary_current_s: string;
    secondary_current_t: string;
    secondary_voltage_r: string;
    secondary_voltage_s: string;
    secondary_voltage_t: string;
    temperature_oil: string;
    temperature_winding: string;
    desicant_level_id: string;
};

export type InspectionTransformerFormProps = {
    submit: FormEventHandler;
    data: Required<InspectionTransformerData>;
    setData: <K extends keyof InspectionTransformerData>(key: K, value: InspectionTransformerData[K]) => void;
    errors: Partial<Record<keyof InspectionTransformerData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    showSuccessMessage?: boolean;
    isEditing?: boolean;
};

export default function InspectionTransformerForm({
    submit,
    processing,
    setData,
    data,
    errors,
    recentlySuccessful,
    showSuccessMessage = false,
    isEditing = false,
}: InspectionTransformerFormProps) {
    const can = usePermissions();

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="equipment_class_id">Operated</Label>
                    <Select disabled={processing} onValueChange={(e) => setData('is_operational', e)} value={data.is_operational}>
                        <SelectTrigger tabIndex={1} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Operating status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Equipment is operational</SelectLabel>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.is_operational} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="equipment_class_id">Cleanliness</Label>
                    <Select disabled={processing} onValueChange={(e) => setData('is_clean', e)} value={data.is_clean}>
                        <SelectTrigger tabIndex={2} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Operating status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Equipment is clean</SelectLabel>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.is_clean} />
                </div>
            </div>

            <Separator className="mb-5" />

            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Primary</div>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="primary_current_r">Current R</Label>
                            <Input
                                id="primary_current_r"
                                type="text"
                                tabIndex={3}
                                autoComplete="primary_current_r"
                                inputMode="numeric"
                                value={data.primary_current_r}
                                placeholder="A"
                                onChange={(e) => setData('primary_current_r', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.primary_current_r} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="primary_current_s">Current S</Label>
                            <Input
                                id="primary_current_s"
                                type="text"
                                tabIndex={4}
                                autoComplete="primary_current_s"
                                inputMode="numeric"
                                value={data.primary_current_s}
                                placeholder="A"
                                onChange={(e) => setData('primary_current_s', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.primary_current_s} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="primary_current_t">Current T</Label>
                            <Input
                                id="primary_current_t"
                                type="text"
                                tabIndex={5}
                                autoComplete="primary_current_t"
                                inputMode="numeric"
                                value={data.primary_current_t}
                                placeholder="A"
                                onChange={(e) => setData('primary_current_t', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.primary_current_t} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="primary_voltage_r">Voltage R</Label>
                            <Input
                                id="primary_voltage_r"
                                type="text"
                                tabIndex={6}
                                autoComplete="primary_voltage_r"
                                inputMode="numeric"
                                value={data.primary_voltage_r}
                                placeholder="V"
                                onChange={(e) => setData('primary_voltage_r', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.primary_voltage_r} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="primary_voltage_s">Voltage S</Label>
                            <Input
                                id="primary_voltage_s"
                                type="text"
                                tabIndex={7}
                                autoComplete="primary_voltage_s"
                                inputMode="numeric"
                                value={data.primary_voltage_s}
                                placeholder="V"
                                onChange={(e) => setData('primary_voltage_s', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.primary_voltage_s} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="primary_voltage_t">Voltage S</Label>
                            <Input
                                id="primary_voltage_t"
                                type="text"
                                tabIndex={8}
                                autoComplete="primary_voltage_t"
                                inputMode="numeric"
                                value={data.primary_voltage_t}
                                placeholder="V"
                                onChange={(e) => setData('primary_voltage_t', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.primary_voltage_t} />
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="mb-5" />

            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Secondary</div>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="secondary_current_r">Current R</Label>
                            <Input
                                id="secondary_current_r"
                                type="text"
                                tabIndex={9}
                                autoComplete="secondary_current_r"
                                inputMode="numeric"
                                value={data.secondary_current_r}
                                placeholder="A"
                                onChange={(e) => setData('secondary_current_r', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.secondary_current_r} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="secondary_current_s">Current S</Label>
                            <Input
                                id="secondary_current_s"
                                type="text"
                                tabIndex={10}
                                autoComplete="secondary_current_s"
                                inputMode="numeric"
                                value={data.secondary_current_s}
                                placeholder="A"
                                onChange={(e) => setData('secondary_current_s', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.secondary_current_s} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="secondary_current_t">Current T</Label>
                            <Input
                                id="secondary_current_t"
                                type="text"
                                tabIndex={11}
                                autoComplete="secondary_current_t"
                                inputMode="numeric"
                                value={data.secondary_current_t}
                                placeholder="A"
                                onChange={(e) => setData('secondary_current_t', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.secondary_current_t} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="secondary_voltage_r">Voltage R</Label>
                            <Input
                                id="secondary_voltage_r"
                                type="text"
                                tabIndex={12}
                                autoComplete="secondary_voltage_r"
                                inputMode="numeric"
                                value={data.secondary_voltage_r}
                                placeholder="V"
                                onChange={(e) => setData('secondary_voltage_r', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.secondary_voltage_r} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="secondary_voltage_s">Voltage S</Label>
                            <Input
                                id="secondary_voltage_s"
                                type="text"
                                tabIndex={13}
                                autoComplete="secondary_voltage_s"
                                inputMode="numeric"
                                value={data.secondary_voltage_s}
                                placeholder="V"
                                onChange={(e) => setData('secondary_voltage_s', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.secondary_voltage_s} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="secondary_voltage_t">Voltage S</Label>
                            <Input
                                id="secondary_voltage_t"
                                type="text"
                                tabIndex={14}
                                autoComplete="secondary_voltage_t"
                                inputMode="numeric"
                                value={data.secondary_voltage_t}
                                placeholder="V"
                                onChange={(e) => setData('secondary_voltage_t', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.secondary_voltage_t} />
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="mb-5" />

            <div className="grid grid-cols-1 gap-2 space-y-6 sm:grid-cols-3 sm:space-y-0">
                <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                    <div className="grid gap-2">
                        <Label htmlFor="temperature_oil">Oil temp</Label>
                        <Input
                            id="temperature_oil"
                            type="text"
                            tabIndex={15}
                            autoComplete="temperature_oil"
                            inputMode="numeric"
                            value={data.temperature_oil}
                            placeholder="&deg;C"
                            onChange={(e) => setData('temperature_oil', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.temperature_oil} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="temperature_winding">Winding temp</Label>
                        <Input
                            id="temperature_winding"
                            type="text"
                            tabIndex={16}
                            autoComplete="temperature_winding"
                            inputMode="numeric"
                            value={data.temperature_winding}
                            placeholder="&deg;C"
                            onChange={(e) => setData('temperature_winding', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.temperature_winding} />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="desicant_level_id">Desicant</Label>
                    <Select disabled={processing} onValueChange={(e) => setData('desicant_level_id', e)} value={data.desicant_level_id}>
                        <SelectTrigger tabIndex={17} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Good" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Desicant level quality</SelectLabel>
                                <SelectItem value="1">Good</SelectItem>
                                <SelectItem value="2">Satisfactory</SelectItem>
                                <SelectItem value="3">Acceptable</SelectItem>
                                <SelectItem value="4">Unacceptable</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.desicant_level_id} />
                </div>
            </div>

            {can.create_inspection && (
                <ButtonSubmit
                    tabIndex={18}
                    disabled={processing}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={isEditing ? 'Updated' : 'Saved'}
                    showSuccessMessage={showSuccessMessage}
                    label={isEditing ? 'Update' : 'Submit'}
                />
            )}
        </form>
    );
}
