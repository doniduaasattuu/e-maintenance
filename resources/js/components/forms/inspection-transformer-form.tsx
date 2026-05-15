import { CauseCode, Department, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import React, { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import RequiredLabel from '../required-label';
import { Field, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import AbnormalityFormSection, { AbnormalityData } from './abnormality-form-section';
import BinarySelect from './binary-select';
import HeaderSmall from './header-small';
import NumericalInput from './numerical-input';

export interface InspectionTransformerData extends AbnormalityData {
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
}

export type InspectionTransformerFormProps = {
    submit: FormEventHandler;
    data: Required<InspectionTransformerData>;
    setData: <K extends keyof InspectionTransformerData>(key: K, value: InspectionTransformerData[K]) => void;
    errors: Partial<Record<keyof InspectionTransformerData, string>>;
    processing: boolean;
    recentlySuccessful: boolean;
    showSuccessMessage?: boolean;
    isEditing?: boolean;
    canSubmit: boolean;
    findingClauses: {
        data: FindingClause[];
    };
    findingStatuses: {
        data: FindingStatus[];
    };
    findingPriorities: {
        data: FindingPriority[];
    };
    causeCodes: {
        data: CauseCode[];
    };
    departments: {
        data: Department[];
    };
    workCenters: {
        data: WorkCenter[];
    };
    showAssignmentFields?: boolean;
};

const nullWhenStopped: Array<keyof InspectionTransformerData> = [
    'primary_current_r',
    'primary_current_s',
    'primary_current_t',
    'primary_voltage_r',
    'primary_voltage_s',
    'primary_voltage_t',
    'secondary_current_r',
    'secondary_current_s',
    'secondary_current_t',
    'secondary_voltage_r',
    'secondary_voltage_s',
    'secondary_voltage_t',
];

export default function InspectionTransformerForm({
    submit,
    processing,
    setData,
    data,
    errors,
    recentlySuccessful,
    showSuccessMessage = false,
    isEditing = false,
    canSubmit,
    findingClauses,
    findingStatuses,
    findingPriorities,
    causeCodes,
    departments,
    workCenters,
    showAssignmentFields = false,
}: InspectionTransformerFormProps) {
    React.useEffect(() => {
        if (data.is_operational == '0') {
            for (const field of nullWhenStopped) {
                setData(field, '');
            }
        }
    }, [data.is_operational, setData]);

    const abnormalitiesField = data.has_abnormality
        ? data.finding_clause_id == '' ||
          data.cause_code_id == '' ||
          data.description == '' ||
          data.finding_status_id == '' ||
          data.finding_priority_id == '' ||
          data.images == null
        : false;

    const requiredIfField =
        data.is_operational == '1'
            ? data.primary_current_r == '' ||
              data.primary_current_s == '' ||
              data.primary_current_t == '' ||
              data.primary_voltage_r == '' ||
              data.primary_voltage_s == '' ||
              data.primary_voltage_t == '' ||
              data.secondary_current_r == '' ||
              data.secondary_current_s == '' ||
              data.secondary_current_t == '' ||
              data.secondary_voltage_r == '' ||
              data.secondary_voltage_s == '' ||
              data.secondary_voltage_t == ''
            : false;

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className={data.has_abnormality ? 'grid grid-cols-1 items-start gap-8 xl:grid-cols-2' : 'block'}>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                        <BinarySelect
                            errorMessage={errors.is_operational}
                            onChange={(value) => setData('is_operational', value)}
                            processing={processing}
                            required={true}
                            value={data.is_operational}
                            tabIndex={1}
                            id="is_operational"
                            label="Operated"
                            selectLabel="Equipment is operational"
                            placeholder="Is the equipment operational?"
                        />
                        <BinarySelect
                            errorMessage={errors.is_clean}
                            onChange={(value) => setData('is_clean', value)}
                            processing={processing}
                            required={true}
                            value={data.is_clean}
                            tabIndex={2}
                            id="is_clean"
                            label="Cleanliness"
                            selectLabel="Equipment is clean"
                            placeholder="Is the equipment clean?"
                        />
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Primary" />
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from([
                                    {
                                        field: 'primary_current_r',
                                        label: 'Pri. Curr. R',
                                    },
                                    {
                                        field: 'primary_current_s',
                                        label: 'Pri. Curr. S',
                                    },
                                    {
                                        field: 'primary_current_t',
                                        label: 'Pri. Curr. T',
                                    },
                                ] as const).map((item, index) => (
                                    <NumericalInput
                                        key={item.field}
                                        id={item.field}
                                        label={item.label}
                                        tabIndex={3 + index}
                                        placeholder="A"
                                        value={data[item.field]}
                                        onChange={(value) => setData(item.field, value)}
                                        errorMessage={errors[item.field]}
                                        disabled={processing || data.is_operational === '0'}
                                        required={data.is_operational === '1'}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {Array.from([
                                    {
                                        field: 'primary_voltage_r',
                                        label: 'Pri. Volt. R',
                                    },
                                    {
                                        field: 'primary_voltage_s',
                                        label: 'Pri. Volt. S',
                                    },
                                    {
                                        field: 'primary_voltage_t',
                                        label: 'Pri. Volt. T',
                                    },
                                ] as const).map((item, index) => (
                                    <NumericalInput
                                        key={item.field}
                                        id={item.field}
                                        label={item.label}
                                        tabIndex={4 + index}
                                        placeholder="V"
                                        value={data[item.field]}
                                        onChange={(value) => setData(item.field, value)}
                                        errorMessage={errors[item.field]}
                                        disabled={processing || data.is_operational === '0'}
                                        required={data.is_operational === '1'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Secondary" />
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from([
                                    {
                                        field: 'secondary_current_r',
                                        label: 'Sec. Curr. R',
                                    },
                                    {
                                        field: 'secondary_current_s',
                                        label: 'Sec. Curr. S',
                                    },
                                    {
                                        field: 'secondary_current_t',
                                        label: 'Sec. Curr. T',
                                    },
                                ] as const).map((item, index) => (
                                    <NumericalInput
                                        key={item.field}
                                        id={item.field}
                                        label={item.label}
                                        tabIndex={7 + index}
                                        placeholder="A"
                                        value={data[item.field]}
                                        onChange={(value) => setData(item.field, value)}
                                        errorMessage={errors[item.field]}
                                        disabled={processing || data.is_operational === '0'}
                                        required={data.is_operational === '1'}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {Array.from([
                                    {
                                        field: 'secondary_voltage_r',
                                        label: 'Sec. Volt. R',
                                    },
                                    {
                                        field: 'secondary_voltage_s',
                                        label: 'Sec. Volt. S',
                                    },
                                    {
                                        field: 'secondary_voltage_t',
                                        label: 'Sec. Volt. T',
                                    },
                                ] as const).map((item, index) => (
                                    <NumericalInput
                                        key={item.field}
                                        id={item.field}
                                        label={item.label}
                                        tabIndex={10 + index}
                                        placeholder="V"
                                        value={data[item.field]}
                                        onChange={(value) => setData(item.field, value)}
                                        errorMessage={errors[item.field]}
                                        disabled={processing || data.is_operational === '0'}
                                        required={data.is_operational === '1'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Others" />

                        <div className="grid grid-cols-3 gap-2">
                            <NumericalInput
                                id="temperature_oil"
                                label="Oil Temp."
                                tabIndex={13}
                                placeholder="°C"
                                value={data.temperature_oil}
                                onChange={(value) => setData('temperature_oil', value)}
                                errorMessage={errors.temperature_oil}
                                disabled={processing}
                                required={true}
                            />
                            <NumericalInput
                                id="temperature_winding"
                                label="Winding Temp."
                                tabIndex={14}
                                placeholder="°C"
                                value={data.temperature_winding}
                                onChange={(value) => setData('temperature_winding', value)}
                                errorMessage={errors.temperature_winding}
                                disabled={processing}
                                required={true}
                            />
                            <Field>
                                <FieldLabel htmlFor="desicant_level">
                                    Desicant Level
                                    <RequiredLabel />
                                </FieldLabel>
                                <Select disabled={processing} onValueChange={(e) => setData('desicant_level_id', e)} value={data.desicant_level_id}>
                                    <SelectTrigger tabIndex={15} className="truncate overflow-hidden whitespace-nowrap">
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
                            </Field>
                        </div>
                    </div>
                </div>

                {data.has_abnormality && (
                    <AbnormalityFormSection
                        data={data}
                        causeCodes={causeCodes.data}
                        departments={departments.data}
                        workCenters={workCenters.data}
                        findingClauses={findingClauses.data}
                        findingPriorities={findingPriorities.data}
                        findingStatuses={findingStatuses.data}
                        processing={processing}
                        setData={setData}
                        errors={errors}
                        showAssignmentFields={showAssignmentFields}
                        startTabIndex={16}
                    />
                )}
            </div>
            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    tabIndex={24}
                    disabled={processing || data.temperature_oil == '' || data.temperature_winding == '' || requiredIfField || abnormalitiesField}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={isEditing ? 'Updated' : 'Saved'}
                    showSuccessMessage={showSuccessMessage}
                    label={isEditing ? 'Update' : 'Submit'}
                />
            )}
        </form>
    );
}
