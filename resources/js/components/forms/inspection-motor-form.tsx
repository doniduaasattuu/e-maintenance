import ButtonSubmit from '@/components/button-submit';
import { CauseCode, Department, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import React, { FormEventHandler } from 'react';
import AbnormalityFormSection, { AbnormalityData } from './abnormality-form-section';
import BinarySelect from './binary-select';
import HeaderSmall from './header-small';
import NumericalInput from './numerical-input';

export interface InspectionMotorData extends AbnormalityData {
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
}

export type InspectionMotorFormProps = {
    submit: FormEventHandler;
    data: Required<InspectionMotorData>;
    setData: <K extends keyof InspectionMotorData>(key: K, value: InspectionMotorData[K]) => void;
    errors: Partial<Record<keyof InspectionMotorData, string>>;
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

const nullWhenStopped: Array<keyof InspectionMotorData> = [
    'temperature_de',
    'temperature_body',
    'temperature_nde',
    'vibration_dev',
    'vibration_deh',
    'vibration_dea',
    'vibration_def',
    'vibration_ndev',
    'vibration_ndeh',
    'vibration_ndef',
];

export default function InspectionMotorForm({
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
}: InspectionMotorFormProps) {
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
        data.is_operational == '1' ? data.temperature_body == '' || data.temperature_de == '' || data.temperature_nde == '' : false;

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className={data.has_abnormality ? 'grid grid-cols-1 items-start gap-8 xl:grid-cols-2' : 'block'}>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2">
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
                        <NumericalInput
                            key={'number_of_greasing'}
                            id={'number_of_greasing'}
                            label={'Greasing'}
                            tabIndex={3}
                            value={data['number_of_greasing'].toString()}
                            onChange={(value) => setData('number_of_greasing', parseInt(value) || 0)}
                            errorMessage={errors['number_of_greasing']}
                            disabled={processing}
                        />
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Temperature" />
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from([
                                {
                                    field: 'temperature_de',
                                    label: 'DE',
                                },
                                {
                                    field: 'temperature_body',
                                    label: 'Body',
                                },
                                {
                                    field: 'temperature_nde',
                                    label: 'NDE',
                                },
                            ] as const).map((item, index) => (
                                <NumericalInput
                                    key={item.field}
                                    id={item.field}
                                    label={item.label}
                                    tabIndex={4 + index}
                                    placeholder="°C"
                                    value={data[item.field]}
                                    onChange={(value) => setData(item.field, value)}
                                    errorMessage={errors[item.field]}
                                    disabled={processing || data.is_operational === '0'}
                                    required={data.is_operational == '1'}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Drive End (DE)" />
                        <div className="grid grid-cols-2 gap-2 gap-y-6 sm:grid-cols-4">
                            {Array.from([
                                {
                                    field: 'vibration_dev',
                                    label: 'Vertical',
                                },
                                {
                                    field: 'vibration_deh',
                                    label: 'Horizontal',
                                },
                                {
                                    field: 'vibration_dea',
                                    label: 'Axial',
                                },
                                {
                                    field: 'vibration_def',
                                    label: 'Frame',
                                },
                            ] as const).map((item, index) => (
                                <NumericalInput
                                    key={item.field}
                                    id={item.field}
                                    label={item.label}
                                    tabIndex={7 + index}
                                    placeholder="mm/s"
                                    value={data[item.field]}
                                    onChange={(value) => setData(item.field, value)}
                                    errorMessage={errors[item.field]}
                                    disabled={processing || data.is_operational === '0'}
                                />
                            ))}
                        </div>

                        <BinarySelect
                            errorMessage={errors.is_noisy_de}
                            onChange={(value) => setData('is_noisy_de', value)}
                            processing={processing}
                            required={true}
                            value={data.is_noisy_de}
                            tabIndex={11}
                            id="is_noisy_de"
                            label="DE Noise"
                            selectLabel="Noise DE"
                            placeholder="Is bearing DE noise?"
                        />
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Non Drive End (NDE)" />
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from([
                                {
                                    field: 'vibration_ndev',
                                    label: 'Vertical',
                                },
                                {
                                    field: 'vibration_ndeh',
                                    label: 'Horizontal',
                                },
                                {
                                    field: 'vibration_ndef',
                                    label: 'Frame',
                                },
                            ] as const).map((item, index) => (
                                <NumericalInput
                                    key={item.field}
                                    id={item.field}
                                    label={item.label}
                                    tabIndex={12 + index}
                                    placeholder="mm/s"
                                    value={data[item.field]}
                                    onChange={(value) => setData(item.field, value)}
                                    errorMessage={errors[item.field]}
                                    disabled={processing || data.is_operational === '0'}
                                />
                            ))}
                        </div>

                        <BinarySelect
                            errorMessage={errors.is_noisy_nde}
                            onChange={(value) => setData('is_noisy_nde', value)}
                            processing={processing}
                            required={true}
                            value={data.is_noisy_nde}
                            tabIndex={15}
                            id="is_noisy_nde"
                            label="NDE Noise"
                            selectLabel="Noise NDE"
                            placeholder="Is bearing NDE noise?"
                        />
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
                    disabled={processing || requiredIfField || abnormalitiesField}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={isEditing ? 'Updated' : 'Saved'}
                    showSuccessMessage={showSuccessMessage}
                    label={isEditing ? 'Update' : 'Submit'}
                />
            )}
        </form>
    );
}
