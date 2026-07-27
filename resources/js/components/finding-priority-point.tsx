import { FindingPriority } from '@/types';
import { DialogClose } from '@radix-ui/react-dialog';
import { Info, Save } from 'lucide-react';
import React, { useState } from 'react';
import RequiredLabel from './required-label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field';
import { Separator } from './ui/separator';

export interface Props {
    selectedPriority: string;
    priorities: {
        data: FindingPriority[];
    };
    setData: (priority: FindingPriority) => void;
    priorityScales: {
        safety: {
            label: string;
            point: number;
        }[];
        quality: {
            label: string;
            point: number;
        }[];
        breakdown: {
            label: string;
            point: number;
        }[];
    };
}

export default function FindingPriorityPoint({ selectedPriority, priorities, setData, priorityScales }: Props) {
    const safetyItems = priorityScales.safety;
    const qualityItems = priorityScales.quality;
    const breakdownItems = priorityScales.breakdown;

    const priority = priorities.data.find((item) => item.id == parseInt(selectedPriority));

    const [open, setOpen] = useState(false);
    const [safetyPoint, setSafetyPoint] = React.useState<number>(safetyItems[safetyItems.length - 1]['point']);
    const [qualityPoint, setQualityPoint] = React.useState<number>(qualityItems[qualityItems.length - 1]['point']);
    const [breakdownPoint, setBreakdownPoint] = React.useState<number>(breakdownItems[breakdownItems.length - 1]['point']);

    const handleChange = (point: number, method: (value: number) => void) => {
        method(point);
    };

    const point = React.useMemo(() => safetyPoint + qualityPoint + breakdownPoint, [safetyPoint, qualityPoint, breakdownPoint]);

    function calculate(point: number) {
        const priority = priorities.data.find((item) => point >= item.minimum_point && point <= item.maximum_point);
        if (priority) {
            setData(priority);
        }
        setOpen(false);
    }

    return (
        <Field>
            <FieldLabel htmlFor="finding_status_id">
                Finding Priority
                <RequiredLabel />
            </FieldLabel>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button
                        size={'sm'}
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            setOpen(!open);
                        }}
                        className="w-full"
                        style={{
                            borderColor: priority?.color_code,
                            color: priority?.color_code,
                        }}
                    >
                        {priority?.label}
                    </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()} className="rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Priority Scale</DialogTitle>
                        <DialogDescription>Priority is determined from the accumulation of several points below.</DialogDescription>
                    </DialogHeader>
                    <div className="no-scrollbar -mx-4 max-h-[50vh] space-y-6 overflow-y-auto px-4">
                        <Separator />
                        <FieldSet>
                            <FieldLegend className="mb-1" variant="label">
                                Safety
                            </FieldLegend>
                            <FieldDescription>Apakah temuan berpengaruh terhadap safety?</FieldDescription>
                            <FieldGroup className="gap-3 p-0">
                                {safetyItems.map((e) => (
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id={e.label}
                                            name="safety"
                                            checked={safetyPoint == e.point}
                                            onCheckedChange={() => handleChange(e.point, setSafetyPoint)}
                                        />
                                        <FieldLabel htmlFor={e.label} className="font-normal">
                                            ({e.point}) {e.label}
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </FieldGroup>
                        </FieldSet>
                        <Separator />
                        <FieldSet>
                            <FieldLegend className="mb-1" variant="label">
                                Quality
                            </FieldLegend>
                            <FieldDescription>Apakah temuan berpengaruh terhadap quality?</FieldDescription>
                            <FieldGroup className="gap-3">
                                {qualityItems.map((e) => (
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id={e.label}
                                            name="quality"
                                            checked={qualityPoint == e.point}
                                            onCheckedChange={() => handleChange(e.point, setQualityPoint)}
                                        />
                                        <FieldLabel htmlFor={e.label} className="font-normal">
                                            ({e.point}) {e.label}
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </FieldGroup>
                        </FieldSet>
                        <Separator />
                        <FieldSet>
                            <FieldLegend className="mb-1" variant="label">
                                Breakdown
                            </FieldLegend>
                            <FieldDescription>Apakah temuan menyebabkan breakdown?</FieldDescription>
                            <FieldGroup className="gap-3">
                                {breakdownItems.map((e) => (
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id={e.label}
                                            name="breakdown"
                                            checked={breakdownPoint == e.point}
                                            onCheckedChange={() => handleChange(e.point, setBreakdownPoint)}
                                        />
                                        <FieldLabel htmlFor={e.label} className="font-normal">
                                            ({e.point}) {e.label}
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </FieldGroup>
                        </FieldSet>
                        <Separator />
                    </div>

                    <div className="text-muted-foreground text-sm">Point: {point}</div>

                    <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <Info className="size-3 shrink-0" />
                            Jumlah point &gt; 6 (Priority 1)
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <Info className="size-3 shrink-0" />
                            Jumlah point 3 s.d. 6 (Priority 2)
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <Info className="size-3 shrink-0" />
                            Jumlah point &lt;= 2 (Priority 3)
                        </div>
                    </div>
                    <DialogFooter className="items-end">
                        <DialogClose className="w-full sm:w-auto">
                            <Button
                                className="w-full"
                                size={'sm'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    calculate(point);
                                }}
                            >
                                <Save />
                                Save
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Field>
    );
}
