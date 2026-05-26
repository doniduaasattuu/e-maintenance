import { CauseCode, Department, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import React, { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import AbnormalityFormSection, { AbnormalityData } from './abnormality-form-section';
import BinarySelect from './binary-select';
import HeaderSmall from './header-small';
import NumericalInput from './numerical-input';

export interface InspectionAirConditionerData extends AbnormalityData {
    equipment_id: number;
    is_operational: string;
    is_drain_leaking: string;
    current_load: string;
    blowing_temperature: string;
    ambient_temperature: string;
    is_filter_clean: string;
    is_evaporator_clean: string;
    is_condensor_clean: string;
}

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

const nullWhenStopped: Array<keyof InspectionAirConditionerData> = ['blowing_temperature', 'ambient_temperature'];

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
    findingClauses,
    findingStatuses,
    findingPriorities,
    causeCodes,
    departments,
    workCenters,
    showAssignmentFields = false,
}: InspectionAirConditionerFormProps) {
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

    const requiredIfField = data.is_operational == '1' ? data.blowing_temperature == '' || data.ambient_temperature == '' : false;

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
                            errorMessage={errors.is_drain_leaking}
                            onChange={(value) => setData('is_drain_leaking', value)}
                            processing={processing}
                            required={true}
                            value={data.is_drain_leaking}
                            tabIndex={2}
                            id="is_drain_leaking"
                            label="Drain Leaking"
                            selectLabel="Drain is leaking"
                            placeholder="Is the drain leaking?"
                        />
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Parameter" />
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from([
                                {
                                    field: 'current_load',
                                    label: 'Current Load',
                                    required: false,
                                    placehoder: 'A',
                                    disabled: false,
                                },
                                {
                                    field: 'blowing_temperature',
                                    label: 'Blowing Temp.',
                                    required: data.is_operational === '1',
                                    placehoder: '°C',
                                    disabled: data.is_operational !== '1',
                                },
                                {
                                    field: 'ambient_temperature',
                                    label: 'Ambient Temp.',
                                    required: data.is_operational === '1',
                                    placehoder: '°C',
                                    disabled: data.is_operational !== '1',
                                },
                            ] as const).map((item, index) => (
                                <NumericalInput
                                    key={item.field}
                                    id={item.field}
                                    label={item.label}
                                    tabIndex={3 + index}
                                    placeholder={item.placehoder}
                                    value={data[item.field]}
                                    onChange={(value) => setData(item.field, value)}
                                    errorMessage={errors[item.field]}
                                    disabled={processing || item.disabled}
                                    required={item.required}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Cleanliness" />
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from([
                                {
                                    field: 'is_filter_clean',
                                    label: 'Filter',
                                    required: true,
                                },
                                {
                                    field: 'is_evaporator_clean',
                                    label: 'Evaporator',
                                    required: true,
                                },
                                {
                                    field: 'is_condensor_clean',
                                    label: 'Condenser',
                                    required: true,
                                },
                            ] as const).map((item, index) => (
                                <BinarySelect
                                    key={item.field}
                                    errorMessage={errors[item.field]}
                                    onChange={(value) => setData(item.field, value)}
                                    processing={processing}
                                    required={item.required}
                                    value={data[item.field]}
                                    tabIndex={6 + index}
                                    id={item.field}
                                    label={item.label}
                                    selectLabel={`${item.label} is clean`}
                                    placeholder={`Is the ${item.label.toLowerCase()} clean?`}
                                />
                            ))}
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
                        startTabIndex={9}
                    />
                )}
            </div>

            {canSubmit && (
                <ButtonSubmit
                    processing={processing}
                    tabIndex={17}
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
