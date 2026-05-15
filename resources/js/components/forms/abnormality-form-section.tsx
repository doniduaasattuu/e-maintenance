import { useImageCompressor } from '@/hooks/use-image-compressor';
import { CauseCode, Department, FindingClause, FindingPriority, FindingStatus, WorkCenter } from '@/types';
import { ChangeEvent, useState } from 'react';
import CauseCodeSelect from '../cause-code-select';
import DepartmentSelect from '../department-select';
import FindingClauseSelect from '../finding-clause-select';
import FindingDescriptionInput from '../finding-description-input';
import FindingPhotoInput from '../finding-photo-input';
import FindingPrioritySelect from '../finding-priority-select';
import FindingStatusSelect from '../finding-status-select';
import WorkCenterSelect from '../work-center-select';

export interface AbnormalityData {
    has_abnormality: boolean;
    finding_clause_id?: string;
    cause_code_id?: string;
    description?: string;
    department_id?: string;
    work_center_id?: string;
    finding_status_id?: string;
    finding_priority_id?: string;
    images?: File[] | null;
}

interface AbnormalityFormSectionProps {
    data: AbnormalityData;
    errors: Partial<Record<keyof AbnormalityData, string>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: (key: keyof AbnormalityData, value: any) => void;
    processing: boolean;
    findingClauses?: FindingClause[];
    causeCodes?: CauseCode[];
    findingStatuses?: FindingStatus[];
    findingPriorities?: FindingPriority[];
    departments?: Department[];
    workCenters?: WorkCenter[];
    showAssignmentFields?: boolean;
    descriptionPlaceholder?: string;
    startTabIndex?: number;
}

export default function AbnormalityFormSection({
    data,
    errors,
    setData,
    processing,
    findingClauses,
    causeCodes,
    findingStatuses,
    findingPriorities,
    departments,
    workCenters,
    showAssignmentFields,
    descriptionPlaceholder = 'Describe the issue...',
    startTabIndex = 13,
}: AbnormalityFormSectionProps) {
    const compressImage = useImageCompressor();
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        setIsCompressing(true);

        try {
            const fileArray = Array.from(files);

            const compressionPromises = fileArray.map(async (file) => {
                return await compressImage(file);
            });

            const compressedFiles = await Promise.all(compressionPromises);

            setData('images', compressedFiles);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Compression failed: ', error);
            }
        } finally {
            setIsCompressing(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 space-y-6 rounded-xl border-2 border-red-200 bg-red-50/20 p-6 duration-200">
            <div className="mb-4 flex items-center gap-2">
                <h3 className="text-md font-bold text-red-500">Abnormality Discovery</h3>
            </div>

            <div className="grid grid-cols-1 space-y-6 sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                <FindingClauseSelect
                    tabIndex={startTabIndex}
                    clauses={findingClauses}
                    value={data.finding_clause_id ?? ''}
                    onChange={(val) => setData('finding_clause_id', val)}
                    error={errors.finding_clause_id}
                    disabled={processing}
                />
                <CauseCodeSelect
                    tabIndex={startTabIndex + 1}
                    causeCodes={causeCodes}
                    value={data.cause_code_id ?? ''}
                    onChange={(val) => setData('cause_code_id', val)}
                    error={errors.cause_code_id}
                    disabled={processing}
                />
            </div>

            <FindingDescriptionInput
                tabIndex={startTabIndex + 2}
                value={data.description ?? ''}
                onChange={(val) => setData('description', val)}
                error={errors.description}
                placeholder={descriptionPlaceholder}
                disabled={processing}
            />

            {showAssignmentFields && (
                <div className="grid grid-cols-2 gap-4">
                    <DepartmentSelect
                        placeholder="Responsible Department"
                        tabIndex={startTabIndex + 3}
                        departments={departments ?? []}
                        value={data.department_id ?? ''}
                        onChange={(val) => setData('department_id', val)}
                        disabled={processing}
                        required={false}
                    />
                    <WorkCenterSelect
                        tabIndex={startTabIndex + 4}
                        placeholder="Responsible Work Center"
                        workCenters={workCenters ?? []}
                        value={data.work_center_id ?? ''}
                        onChange={(val) => setData('work_center_id', val)}
                        disabled={processing}
                        required={false}
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FindingStatusSelect
                    tabIndex={startTabIndex + 5}
                    statuses={findingStatuses}
                    value={data.finding_status_id ?? ''}
                    onChange={(val) => setData('finding_status_id', val)}
                />
                <FindingPrioritySelect
                    tabIndex={startTabIndex + 6}
                    priorities={findingPriorities}
                    value={data.finding_priority_id ?? ''}
                    onChange={(val) => setData('finding_priority_id', val)}
                />
            </div>

            <FindingPhotoInput
                images={data.images ?? null}
                onFileChange={handleFileChange}
                error={errors.images}
                isCompressing={isCompressing}
                disabled={processing}
                tabIndex={startTabIndex + 7}
            />
        </div>
    );
}
