import ButtonSubmit from '@/components/button-submit';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import usePermissions from '@/hooks/use-permissions';
import { FormEventHandler } from 'react';

export type InspectionMotorData = {
    equipment_id: number;
    is_operational: string;
    is_clean: string;
    number_of_greasing: number;
    temperature_de: string;
    temperature_body: string;
    temperature_nde: string;
    vibration_dev: string;
    vibration_deh: string;
    vibration_dea: string;
    vibration_def: string;
    is_noisy_de: string;
    vibration_ndev: string;
    vibration_ndeh: string;
    vibration_ndef: string;
    is_noisy_nde: string;
};

export type InspectionMotorFormProps = {
    submit: FormEventHandler;
    data: Required<InspectionMotorData>;
    setData: <K extends keyof InspectionMotorData>(key: K, value: InspectionMotorData[K]) => void;
    errors: Partial<Record<keyof InspectionMotorData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    showSuccessMessage?: boolean;
    isEditing?: boolean;
};

export default function InspectionMotorForm({
    submit,
    processing,
    setData,
    data,
    errors,
    recentlySuccessful,
    showSuccessMessage = false,
    isEditing = false,
}: InspectionMotorFormProps) {
    const can = usePermissions();

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-2">
                <div className="col-span-2 grid grid-cols-2 gap-2">
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
                <div className="grid gap-2">
                    <Label htmlFor="number_of_greasing">Number of greasing</Label>
                    <Input
                        id="number_of_greasing"
                        type="text"
                        tabIndex={3}
                        autoComplete="number_of_greasing"
                        inputMode="numeric"
                        value={data.number_of_greasing}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, ''); // remove non-digits
                            setData('number_of_greasing', Number(e.target.value ?? 0));
                        }}
                        disabled={processing}
                    />
                    <InputError message={errors.number_of_greasing} />
                </div>
            </div>

            <Separator className="mb-5" />

            {/* TEMPERATURE */}
            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Temperature</div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="temperature_de">DE</Label>
                        <Input
                            id="temperature_de"
                            type="text"
                            tabIndex={4}
                            autoComplete="temperature_de"
                            inputMode="numeric"
                            value={data.temperature_de}
                            placeholder="&deg;C"
                            onChange={(e) => setData('temperature_de', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.temperature_de} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="temperature_body">Body</Label>
                        <Input
                            id="temperature_body"
                            type="text"
                            tabIndex={5}
                            autoComplete="temperature_body"
                            inputMode="numeric"
                            value={data.temperature_body}
                            placeholder="&deg;C"
                            onChange={(e) => setData('temperature_body', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.temperature_body} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="temperature_nde">NDE</Label>
                        <Input
                            id="temperature_nde"
                            type="text"
                            tabIndex={6}
                            autoComplete="temperature_nde"
                            inputMode="numeric"
                            value={data.temperature_nde}
                            placeholder="&deg;C"
                            onChange={(e) => setData('temperature_nde', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.temperature_nde} />
                    </div>
                </div>
            </div>

            <Separator className="mb-5" />

            {/* VIBRATION DE */}
            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Vibration DE</div>
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-2 gap-y-6 sm:grid-cols-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vibration_dev">Vertical</Label>
                            <Input
                                id="vibration_dev"
                                type="text"
                                tabIndex={7}
                                autoComplete="vibration_dev"
                                inputMode="numeric"
                                value={data.vibration_dev}
                                placeholder="mm/s"
                                onChange={(e) => setData('vibration_dev', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.vibration_dev} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vibration_deh">Horizontal</Label>
                            <Input
                                id="vibration_deh"
                                type="text"
                                tabIndex={8}
                                autoComplete="vibration_deh"
                                inputMode="numeric"
                                value={data.vibration_deh}
                                placeholder="mm/s"
                                onChange={(e) => setData('vibration_deh', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.vibration_deh} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vibration_dea">Axial</Label>
                            <Input
                                id="vibration_dea"
                                type="text"
                                tabIndex={9}
                                autoComplete="vibration_dea"
                                inputMode="numeric"
                                value={data.vibration_dea}
                                placeholder="mm/s"
                                onChange={(e) => setData('vibration_dea', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.vibration_dea} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="vibration_def">Frame</Label>
                            <Input
                                id="vibration_def"
                                type="text"
                                tabIndex={10}
                                autoComplete="vibration_def"
                                inputMode="numeric"
                                value={data.vibration_def}
                                placeholder="mm/s"
                                onChange={(e) => setData('vibration_def', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.vibration_def} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_noisy_de">Noisy</Label>
                        <Select disabled={processing} onValueChange={(e) => setData('is_noisy_de', e)} value={data.is_noisy_de}>
                            <SelectTrigger tabIndex={11} className="truncate overflow-hidden whitespace-nowrap">
                                <SelectValue placeholder="Select a equipment class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground">Noise</SelectLabel>
                                    <SelectItem value="0">No</SelectItem>
                                    <SelectItem value="1">Yes</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.is_noisy_de} />
                    </div>
                </div>
            </div>

            <Separator className="mb-5" />

            {/* VIBRATION NDE */}
            <div className="space-y-5">
                <div className="text-muted-foreground text-sm font-semibold">Vibration NDE</div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="vibration_ndev">Vertical</Label>
                        <Input
                            id="vibration_ndev"
                            type="text"
                            tabIndex={12}
                            autoComplete="vibration_ndev"
                            inputMode="numeric"
                            value={data.vibration_ndev}
                            placeholder="mm/s"
                            onChange={(e) => setData('vibration_ndev', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.vibration_ndev} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="vibration_ndeh">Horizontal</Label>
                        <Input
                            id="vibration_ndeh"
                            type="text"
                            tabIndex={13}
                            autoComplete="vibration_ndeh"
                            inputMode="numeric"
                            value={data.vibration_ndeh}
                            placeholder="mm/s"
                            onChange={(e) => setData('vibration_ndeh', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.vibration_ndeh} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="vibration_ndef">Frame</Label>
                        <Input
                            id="vibration_ndef"
                            type="text"
                            tabIndex={14}
                            autoComplete="vibration_ndef"
                            inputMode="numeric"
                            value={data.vibration_ndef}
                            placeholder="mm/s"
                            onChange={(e) => setData('vibration_ndef', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.vibration_ndef} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="is_noisy_nde">Noisy</Label>
                    <Select disabled={processing} onValueChange={(e) => setData('is_noisy_nde', e)} value={data.is_noisy_nde}>
                        <SelectTrigger tabIndex={15} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select a equipment class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Noise</SelectLabel>
                                <SelectItem value="0">No</SelectItem>
                                <SelectItem value="1">Yes</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.is_noisy_nde} />
                </div>
            </div>

            {can.create_inspection && (
                <ButtonSubmit
                    tabIndex={16}
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
