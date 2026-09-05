import { Improvement } from '@/types';
import { CalendarDays, ClipboardCheck, Factory, FileText, MapPin, User, Wrench } from 'lucide-react';

interface CardImprovementDetailProps {
    improvement: {
        data: Improvement;
    };
}

interface DetailItemProps {
    icon: React.ElementType;
    label: string;
    value?: React.ReactNode;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
    return (
        <div className="space-y-1.5">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Icon className="size-4" />
                <span>{label}</span>
            </div>

            <div className="pl-6 text-sm font-medium">{value || '-'}</div>
        </div>
    );
}

export default function CardImprovementDetail({ improvement }: CardImprovementDetailProps) {
    const data = improvement.data;

    return (
        <div className="rounded-xl border">
            {/* Header */}
            <div className="border-b p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="text-muted-foreground mb-1 text-sm">{data.code}</div>

                        <h2 className="text-md font-semibold tracking-tight sm:text-lg">{data.title}</h2>
                    </div>

                    {data.status && (
                        <span
                            className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium"
                            style={{
                                color: data.status.color,
                                borderColor: data.status.color,
                            }}
                        >
                            {data.status.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Asset Information */}
            <div className="space-y-5 border-b p-5">
                <h3 className="text-sm font-semibold">Asset Information</h3>

                <div className="grid gap-5 sm:grid-cols-2">
                    <DetailItem icon={MapPin} label="Funcloc" value={data.functionalLocation?.description ?? data.functionalLocation?.code} />

                    <DetailItem
                        icon={Wrench}
                        label="Equipment"
                        value={
                            data.equipment?.code
                                ? `${data.equipment.code}${data.equipment.description ? ` - ${data.equipment.description}` : ''}`
                                : undefined
                        }
                    />

                    <DetailItem icon={Factory} label="Department" value={data.department?.name} />

                    <DetailItem icon={ClipboardCheck} label="Improvement Category" value={data.category?.name} />
                </div>
            </div>

            {/* Improvement Details */}
            <div className="space-y-6 border-b p-5">
                <h3 className="text-sm font-semibold">Improvement Details</h3>

                <div className="space-y-5">
                    <div>
                        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                            <FileText className="size-4" />
                            <span>Problem</span>
                        </div>

                        <p className="pl-6 text-sm leading-6 whitespace-pre-line">{data.problem || '-'}</p>
                    </div>

                    <div>
                        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                            <Wrench className="size-4" />
                            <span>Improvement Description</span>
                        </div>

                        <p className="pl-6 text-sm leading-6 whitespace-pre-line">{data.description || '-'}</p>
                    </div>

                    <div>
                        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                            <FileText className="size-4" />
                            <span>Root Cause</span>
                        </div>

                        <p className="pl-6 text-sm leading-6 whitespace-pre-line">{data.root_cause || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Benefit & Implementation */}
            <div className="space-y-5 p-5">
                <h3 className="text-sm font-semibold">Benefit & Implementation</h3>

                <div className="grid gap-5 sm:grid-cols-2">
                    <DetailItem
                        icon={FileText}
                        label="Expected Benefit"
                        value={
                            data.expected_benefit ? (
                                <span className="leading-6 font-normal whitespace-pre-line">{data.expected_benefit}</span>
                            ) : undefined
                        }
                    />

                    <DetailItem
                        icon={FileText}
                        label="Actual Benefit"
                        value={
                            data.actual_benefit ? <span className="leading-6 font-normal whitespace-pre-line">{data.actual_benefit}</span> : undefined
                        }
                    />

                    <DetailItem icon={CalendarDays} label="Implementation Date" value={data.implementation_date} />

                    <DetailItem icon={User} label="Created By" value={data.creator?.name} />
                </div>

                {data.remarks && (
                    <div>
                        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                            <FileText className="size-4" />
                            <span>Remarks</span>
                        </div>

                        <p className="pl-6 text-sm leading-6 whitespace-pre-line">{data.remarks}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
