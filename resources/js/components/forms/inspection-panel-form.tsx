import usePermissions from '@/hooks/use-permissions';
import { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import InputError from '../input-error';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

export type InspectionPanelData = {
    equipment_id: number;
    is_operational: string;
    is_clean: string;
    temperature_incoming_r: string;
    temperature_incoming_s: string;
    temperature_incoming_t: string;
    temperature_cabinet: string;
    temperature_outgoing_r: string;
    temperature_outgoing_s: string;
    temperature_outgoing_t: string;
    current_r: string;
    current_s: string;
    current_t: string;
};

export type InspectionPanelFormProps = {
    submit: FormEventHandler;
    data: Required<InspectionPanelData>;
    setData: <K extends keyof InspectionPanelData>(key: K, value: InspectionPanelData[K]) => void;
    errors: Partial<Record<keyof InspectionPanelData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    showSuccessMessage?: boolean;
    isEditing?: boolean;
};

export default function InspectionPanelForm({
    submit,
    processing,
    setData,
    data,
    errors,
    recentlySuccessful,
    showSuccessMessage = false,
    isEditing = false,
}: InspectionPanelFormProps) {
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
                <div className="text-muted-foreground text-sm font-semibold">Temperature</div>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="temperature_incoming_r">Incoming R</Label>
                            <Input
                                id="temperature_incoming_r"
                                type="text"
                                tabIndex={3}
                                autoComplete="temperature_incoming_r"
                                inputMode="numeric"
                                value={data.temperature_incoming_r}
                                placeholder="&deg;C"
                                onChange={(e) => setData('temperature_incoming_r', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.temperature_incoming_r} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="temperature_incoming_s">Incoming S</Label>
                            <Input
                                id="temperature_incoming_s"
                                type="text"
                                tabIndex={4}
                                autoComplete="temperature_incoming_s"
                                inputMode="numeric"
                                value={data.temperature_incoming_s}
                                placeholder="&deg;C"
                                onChange={(e) => setData('temperature_incoming_s', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.temperature_incoming_s} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="temperature_incoming_t">Incoming T</Label>
                            <Input
                                id="temperature_incoming_t"
                                type="text"
                                tabIndex={5}
                                autoComplete="temperature_incoming_t"
                                inputMode="numeric"
                                value={data.temperature_incoming_t}
                                placeholder="&deg;C"
                                onChange={(e) => setData('temperature_incoming_t', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.temperature_incoming_t} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="temperature_outgoing_r">Outgoing R</Label>
                            <Input
                                id="temperature_outgoing_r"
                                type="text"
                                tabIndex={6}
                                autoComplete="temperature_outgoing_r"
                                inputMode="numeric"
                                value={data.temperature_outgoing_r}
                                placeholder="&deg;C"
                                onChange={(e) => setData('temperature_outgoing_r', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.temperature_outgoing_r} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="temperature_outgoing_s">Outgoing S</Label>
                            <Input
                                id="temperature_outgoing_s"
                                type="text"
                                tabIndex={7}
                                autoComplete="temperature_outgoing_s"
                                inputMode="numeric"
                                value={data.temperature_outgoing_s}
                                placeholder="&deg;C"
                                onChange={(e) => setData('temperature_outgoing_s', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.temperature_outgoing_s} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="temperature_outgoing_t">Outgoing T</Label>
                            <Input
                                id="temperature_outgoing_t"
                                type="text"
                                tabIndex={8}
                                autoComplete="temperature_outgoing_t"
                                inputMode="numeric"
                                value={data.temperature_outgoing_t}
                                placeholder="&deg;C"
                                onChange={(e) => setData('temperature_outgoing_t', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.temperature_outgoing_t} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="temperature_cabinet">Cabinet</Label>
                        <Input
                            id="temperature_cabinet"
                            type="text"
                            tabIndex={9}
                            autoComplete="temperature_cabinet"
                            inputMode="numeric"
                            value={data.temperature_cabinet}
                            placeholder="&deg;C"
                            onChange={(e) => setData('temperature_cabinet', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.temperature_cabinet} />
                    </div>
                </div>
            </div>

            <Separator className="mb-5" />

            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Current</div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="current_r">Current R</Label>
                        <Input
                            id="current_r"
                            type="text"
                            tabIndex={10}
                            autoComplete="current_r"
                            inputMode="numeric"
                            value={data.current_r}
                            placeholder="&deg;C"
                            onChange={(e) => setData('current_r', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.current_r} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="current_s">Current S</Label>
                        <Input
                            id="current_s"
                            type="text"
                            tabIndex={11}
                            autoComplete="current_s"
                            inputMode="numeric"
                            value={data.current_s}
                            placeholder="&deg;C"
                            onChange={(e) => setData('current_s', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.current_s} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="current_t">Current T</Label>
                        <Input
                            id="current_t"
                            type="text"
                            tabIndex={12}
                            autoComplete="current_t"
                            inputMode="numeric"
                            value={data.current_t}
                            placeholder="&deg;C"
                            onChange={(e) => setData('current_t', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.current_t} />
                    </div>
                </div>
            </div>

            {can.create_inspection && (
                <ButtonSubmit
                    tabIndex={13}
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
