import { CauseCode, Department, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import React, { FormEventHandler } from 'react';
import ButtonSubmit from '../button-submit';
import AbnormalityFormSection, { AbnormalityData } from './abnormality-form-section';
import BinarySelect from './binary-select';
import HeaderSmall from './header-small';
import NumericalInput from './numerical-input';

export interface InspectionPanelData extends AbnormalityData {
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
}

export type InspectionPanelFormProps = {
    submit: FormEventHandler;
    data: Required<InspectionPanelData>;
    setData: <K extends keyof InspectionPanelData>(key: K, value: InspectionPanelData[K]) => void;
    errors: Partial<Record<keyof InspectionPanelData, string>>;
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

const nullWhenStopped: Array<keyof InspectionPanelData> = [
    'temperature_incoming_r',
    'temperature_incoming_s',
    'temperature_incoming_t',
    'temperature_cabinet',
    'temperature_outgoing_r',
    'temperature_outgoing_s',
    'temperature_outgoing_t',
    'current_r',
    'current_s',
    'current_t',
];

export default function InspectionPanelForm({
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
}: InspectionPanelFormProps) {
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
                        <HeaderSmall title="Temperature" />

                        <div className="grid grid-cols-3 gap-2">
                            {Array.from(['temperature_incoming_r', 'temperature_incoming_s', 'temperature_incoming_t'] as const).map(
                                (field, index) => (
                                    <NumericalInput
                                        key={field}
                                        id={field}
                                        label={`Incoming ${String.fromCharCode(82 + index)}`} // R, S, T
                                        tabIndex={3 + index}
                                        placeholder="°C"
                                        value={data[field]}
                                        onChange={(value) => setData(field, value)}
                                        errorMessage={errors[field]}
                                        disabled={processing || data.is_operational === '0'}
                                    />
                                ),
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {Array.from(['temperature_outgoing_r', 'temperature_outgoing_s', 'temperature_outgoing_t'] as const).map(
                                (field, index) => (
                                    <NumericalInput
                                        key={field}
                                        id={field}
                                        label={`Outgoing ${String.fromCharCode(82 + index)}`}
                                        tabIndex={6 + index}
                                        placeholder={'°C'}
                                        value={data[field]}
                                        onChange={(value) => setData(field, value)}
                                        errorMessage={errors[field]}
                                        disabled={processing || data.is_operational === '0'}
                                    />
                                ),
                            )}
                        </div>

                        <NumericalInput
                            id="temperature_cabinet"
                            label="Cabinet"
                            tabIndex={9}
                            placeholder="°C"
                            value={data.temperature_cabinet}
                            onChange={(value) => setData('temperature_cabinet', value)}
                            errorMessage={errors.temperature_cabinet}
                            required={data.is_operational === '1'}
                            disabled={processing || data.is_operational === '0'}
                        />
                    </div>

                    <div className="space-y-6">
                        <HeaderSmall title="Ampere" />
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from(['current_r', 'current_s', 'current_t'] as const).map((field, index) => (
                                <NumericalInput
                                    key={field}
                                    id={field}
                                    label={`Phase ${String.fromCharCode(82 + index)}`}
                                    tabIndex={10 + index}
                                    placeholder="A"
                                    value={data[field]}
                                    onChange={(value) => setData(field, value)}
                                    errorMessage={errors[field]}
                                    disabled={processing || data.is_operational === '0'}
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
                        startTabIndex={13}
                    />
                )}
            </div>

            {canSubmit && (
                <ButtonSubmit
                    tabIndex={21}
                    processing={processing}
                    disabled={processing || data.temperature_cabinet == '' || abnormalitiesField}
                    recentlySuccessful={recentlySuccessful}
                    successMessage={isEditing ? 'Updated' : 'Saved'}
                    showSuccessMessage={showSuccessMessage}
                    label={isEditing ? 'Update' : 'Submit'}
                />
            )}
        </form>
    );
}
