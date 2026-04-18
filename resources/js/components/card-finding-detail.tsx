import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import usePermissions from '@/hooks/use-permissions';
import { Finding } from '@/types';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    BuildingIcon,
    Calendar,
    CalendarCheck,
    CalendarFold,
    CheckSquare,
    Edit,
    HardHat,
    Microscope,
    TriangleAlert,
    User,
    UserPen,
} from 'lucide-react';

interface Props {
    finding: {
        data: Finding;
    };
    type: 'AUD' | 'ABN';
}

interface LiProps {
    title: string;
    children: React.ReactNode;
}

const Li = ({ title, children }: LiProps) => {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">{title}</span>
            <div className="flex gap-2">{children}</div>
        </div>
    );
};

const Ul = ({ children }: { children: React.ReactNode }) => {
    return <div className="grid grid-rows-5 gap-2 space-y-3 text-sm">{children}</div>;
};

const handleEditFinding = (id: number) => {
    router.get(route('abnormalities.edit', id));
};

export default function CardFindingDetail({ finding, type }: Props) {
    const { can } = usePermissions();
    const isClosed: boolean = finding.data.status?.name.toLocaleLowerCase() == 'closed';

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <CardTitle className="text-md w-full truncate">
                    <div className="grid grid-cols-1">
                        <span className="w-full">{finding.data.functionalLocation?.description ?? 'N/A'}</span>
                        <span className="text-muted-foreground text-xs tracking-wide">{finding.data.equipment?.code ?? 'N/A'}</span>
                    </div>
                </CardTitle>
                <CardDescription className="text-foreground">
                    <div className="mt-2 grid grid-cols-1 gap-2 space-y-2 sm:grid-cols-2 sm:space-y-0">
                        <div>
                            <span className="text-muted-foreground text-xs font-light">Description:</span>
                            <br />
                            {finding.data.description ?? '-'}
                        </div>
                        <div>
                            <span className="text-muted-foreground text-xs font-light">Rectification Action:</span>
                            <br />
                            {finding.data.rectification_action ?? '-'}
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <Ul>
                        <Li title="Priority">
                            <AlertCircle color={finding.data.priority?.color_code} className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.priority?.label ?? '-'}</span>
                        </Li>
                        <Li title="Inspector">
                            <UserPen className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.inspector?.name ?? '-'}</span>
                        </Li>
                        <Li title="Issued Date">
                            <Calendar className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.created_at ?? '-'}</span>
                        </Li>
                        <Li title="Action by">
                            <HardHat className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.rectifier?.name ?? '-'}</span>
                        </Li>

                        <Li title="Department">
                            <BuildingIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.department?.name ?? '-'}</span>
                        </Li>
                    </Ul>
                    <Ul>
                        <Li title="Status">
                            {isClosed ? (
                                <CheckSquare className="mt-0.5 size-4 shrink-0 text-green-400" />
                            ) : (
                                <TriangleAlert className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            )}

                            <span className={isClosed ? 'text-green-400' : undefined}>{finding.data.status?.name ?? '-'}</span>
                        </Li>
                        <Li title="Verifier">
                            <User className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.verifier?.name ?? '-'}</span>
                        </Li>

                        <Li title="Deadline">
                            <CalendarFold className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.due_date_readable ?? '-'} </span>
                        </Li>
                        <Li title="Closed Date">
                            <CalendarCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.closed_at ?? '-'}</span>
                        </Li>
                        {type === 'ABN' && (
                            <Li title="Cause Code">
                                <Microscope className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                <span>
                                    <Tooltip>
                                        <TooltipTrigger className="text-left">{finding.data.causeCode?.description ?? '-'}</TooltipTrigger>
                                        <TooltipContent>{finding.data.causeCode?.code ?? '-'}</TooltipContent>
                                    </Tooltip>
                                </span>
                            </Li>
                        )}
                    </Ul>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                {can.edit_abnormality && (
                    <Button onClick={() => handleEditFinding(finding.data.id)} variant="outline" size="sm" className="w-full">
                        <Edit className="size-4" /> Edit
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
