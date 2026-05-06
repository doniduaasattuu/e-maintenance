import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import usePermissions from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';
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

const Ul = ({ children, type }: { children: React.ReactNode; type: 'AUD' | 'ABN' }) => {
    return <div className={cn('grid gap-2 space-y-3 text-sm', type == 'ABN' ? 'grid-rows-6' : 'grid-rows-5')}>{children}</div>;
};

const handleEditFinding = (id: number, type: 'AUD' | 'ABN') => {
    const endpoint = type == 'ABN' ? 'abnormalities' : 'audits';
    router.get(route(`${endpoint}.edit`, id));
};

export default function CardFindingDetail({ finding, type }: Props) {
    const { can } = usePermissions();
    const isMobile = useIsMobile();
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
                    <Ul type={type}>
                        <Li title="Priority">
                            <AlertCircle
                                color={finding?.data?.priority?.color_code ? finding?.data?.priority?.color_code : undefined}
                                className="text-muted-foreground mt-0.5 size-4 shrink-0"
                            />
                            <span>{finding.data.priority?.label ?? '-'}</span>
                        </Li>
                        <Li title="Inspector">
                            <UserPen className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.inspector?.name ?? '-'}</span>
                        </Li>
                        <Li title="Issued Date">
                            <Calendar className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{isMobile ? finding?.data?.created_at : finding?.data?.created}</span>
                        </Li>
                        <Li title="Action by">
                            <HardHat className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>{finding.data.rectifier?.name ?? '-'}</span>
                        </Li>
                        <Li title="Department">
                            <BuildingIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                            <span>
                                <Tooltip>
                                    <TooltipTrigger className="text-left">{finding.data.department?.name ?? '-'}</TooltipTrigger>
                                    <TooltipContent>{finding.data.department?.code ?? '-'}</TooltipContent>
                                </Tooltip>
                            </span>
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
                    <Ul type={type}>
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
                            <span>{isMobile ? finding?.data?.closed_at : (finding?.data?.closed ?? '-')}</span>
                        </Li>
                        <Li title="Work Center">
                            <BuildingIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <span>
                                <Tooltip>
                                    <TooltipTrigger className="text-left">{finding.data.workCenter?.name ?? '-'}</TooltipTrigger>
                                    <TooltipContent>{finding.data.workCenter?.code ?? '-'}</TooltipContent>
                                </Tooltip>
                            </span>
                        </Li>
                    </Ul>
                </div>
            </CardContent>
            {(can.edit_abnormality || can.edit_audit) && (
                <CardFooter>
                    <Button onClick={() => handleEditFinding(finding.data.id, type)} variant="outline" size="sm" className="w-full">
                        <Edit className="size-4" /> Edit
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
