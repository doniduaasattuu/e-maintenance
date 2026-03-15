import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import { Input } from '../ui/input';

export type InspectionAirConditionerData = {
    equipment_id: number;
    is_operational: string;
    is_drain_leaking: string;
    current_load: string;
    blowing_temperature: string;
    ambient_temperature: string;
    is_filter_clean: string;
    is_evaporator_clean: string;
    is_condensor_clean: string;
};

export type InspectionAirConditionerFormProps = {
    submit: FormEventHandler;
    data: Required<InspectionAirConditionerData>;
    setData: <K extends keyof InspectionAirConditionerData>(key: K, value: InspectionAirConditionerData[K]) => void;
    errors: Partial<Record<keyof InspectionAirConditionerData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    showSuccessMessage?: boolean;
    isEditing?: boolean;
    canSubmit: boolean;
};

export default function InspectionAirConditionerForm({
    submit,
    processing,
    setData,
    data,
    errors,
    recentlySuccessful,
    showSuccessMessage = false,
    isEditing = false,
    canSubmit,
}: InspectionAirConditionerFormProps) {
    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="is_operational">Operated</Label>
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
                    <Label htmlFor="is_drain_leaking">Drainage</Label>
                    <Select disabled={processing} onValueChange={(e) => setData('is_drain_leaking', e)} value={data.is_drain_leaking}>
                        <SelectTrigger tabIndex={2} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Drain leaking" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Drainage is leaking</SelectLabel>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.is_drain_leaking} />
                </div>
            </div>

            <Separator className="mb-5" />

            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Parameter</div>

                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="current_load">Current</Label>
                        <Input
                            id="current_load"
                            type="text"
                            tabIndex={3}
                            autoComplete="current_load"
                            inputMode="numeric"
                            value={data.current_load}
                            placeholder="A"
                            onChange={(e) => setData('current_load', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.current_load} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                        <div className="grid gap-2">
                            <Label htmlFor="blowing_temperature">Blowing Temp.</Label>
                            <Input
                                id="blowing_temperature"
                                type="text"
                                tabIndex={4}
                                autoComplete="blowing_temperature"
                                inputMode="numeric"
                                value={data.blowing_temperature}
                                placeholder="&deg;C"
                                onChange={(e) => setData('blowing_temperature', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.blowing_temperature} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ambient_temperature">Ambient Temp.</Label>
                            <Input
                                id="ambient_temperature"
                                type="text"
                                tabIndex={5}
                                autoComplete="ambient_temperature"
                                inputMode="numeric"
                                value={data.ambient_temperature}
                                placeholder="&deg;C"
                                onChange={(e) => setData('ambient_temperature', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.ambient_temperature} />
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="mb-5" />

            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Cleanliness</div>

                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="is_filter_clean">Filter</Label>
                        <Select disabled={processing} onValueChange={(e) => setData('is_filter_clean', e)} value={data.is_filter_clean}>
                            <SelectTrigger tabIndex={6} className="truncate overflow-hidden whitespace-nowrap">
                                <SelectValue placeholder="Filter is clean" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground">Filter is clean</SelectLabel>
                                    <SelectItem value="0">Dirty</SelectItem>
                                    <SelectItem value="1">Clean</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.is_filter_clean} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="is_evaporator_clean">Evaporator</Label>
                        <Select disabled={processing} onValueChange={(e) => setData('is_evaporator_clean', e)} value={data.is_evaporator_clean}>
                            <SelectTrigger tabIndex={7} className="truncate overflow-hidden whitespace-nowrap">
                                <SelectValue placeholder="Evaporator is clean" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground">Evaporator is clean</SelectLabel>
                                    <SelectItem value="0">Dirty</SelectItem>
                                    <SelectItem value="1">Clean</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.is_evaporator_clean} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="is_condensor_clean">Condensor</Label>
                        <Select disabled={processing} onValueChange={(e) => setData('is_condensor_clean', e)} value={data.is_condensor_clean}>
                            <SelectTrigger tabIndex={8} className="truncate overflow-hidden whitespace-nowrap">
                                <SelectValue placeholder="Condensor is clean" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground">Condensor is clean</SelectLabel>
                                    <SelectItem value="0">Dirty</SelectItem>
                                    <SelectItem value="1">Clean</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.is_condensor_clean} />
                    </div>
                </div>
            </div>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    tabIndex={9}
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
