import { ButtonGroup } from '@/components/ui/button-group';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import truncateText, { cn, tableCaption } from '@/lib/utils';
import {
    CauseCode,
    Department,
    Equipment,
    Finding,
    FindingClause,
    FindingImage,
    FindingPriority,
    FindingStatus,
    FunctionalLocation,
    Meta,
    WorkCenter,
} from '@/types';
import { router } from '@inertiajs/react';
import { Edit, Info, MoreHorizontalIcon, Trash2, Wrench } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { ActionConfirm } from '../action-confirm';
import { ActionFindingDialog } from '../action-finding-dialog';
import ButtonAdd from '../button-add';
import ButtonExport from '../button-export';
import { DateRangePopover } from '../date-range-popover';
import DialogFindingExportExcel from '../dialog-finding-export-excel';
import EmptyIcon from '../empty-icon';
import Filter from '../filter';
import FilterCauseCode from '../filter-cause-code';
import FilterDepartment from '../filter-department';
import FilterFindingClause from '../filter-finding-clause';
import FilterFindingPriority from '../filter-finding-priority';
import FilterFindingStatus from '../filter-finding-status';
import FilterWorkCenter from '../filter-work-center';
import { GeneratePagination } from '../generate-pagination';
import Lightbox from '../light-box';
import { PerPageSelector } from '../per-page-selector';
import SearchBar from '../search-bar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { CommandSeparator } from '../ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface FindingTableProps {
    mode: 'standalone' | 'functional-location' | 'equipment';
    asset?: Equipment | FunctionalLocation;
    isArchived?: boolean;
    isMom?: boolean;
    findingTypeCode?: 'AUD' | 'ABN';
    findings: {
        data: Finding[];
        meta: Meta;
    };
    findingClauses?: {
        data: FindingClause[];
    };
    findingPriorities?: {
        data: FindingPriority[];
    };
    findingStatuses?: {
        data: FindingStatus[];
    };
    departments?: {
        data: Department[];
    };
    workCenters?: {
        data: WorkCenter[];
    };
    causeCodes?: {
        data: CauseCode[];
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export function FindingStatusCell({ finding, className }: { finding: Finding; className?: string }) {
    return (
        <TableCell className={cn('align-center', className)}>
            <Badge
                variant={finding?.status?.name.toLowerCase() === 'open' ? 'destructive' : 'default'}
                className={`text-[10px] tracking-wider uppercase ${finding?.status?.name.toLowerCase() === 'closed' && 'bg-green-500 text-black'}`}
            >
                {finding.status?.name}
            </Badge>
        </TableCell>
    );
}

export function FindingPriorityAndDueDateCell({ finding, className }: { finding: Finding; className?: string }) {
    return (
        <TableCell className={cn('align-center', className)}>
            <div className="flex flex-col gap-1">
                <span className="text-sm">{finding.priority?.label}</span>
                <span
                    className={`w-fit rounded-full px-2 py-0.5 text-[11px] ${finding.is_overdue ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}
                >
                    {finding.due_date_readable}
                </span>
            </div>
        </TableCell>
    );
}

export function FindingDescriptionCell({ finding }: { finding: Finding }) {
    return (
        <TableCell className="align-center">
            <p className="text-xs text-wrap">{truncateText(finding.description, 100)}</p>
        </TableCell>
    );
}

export function FindingBeforeCell({
    finding,
    setSelectedImage,
}: {
    finding: Finding;
    setSelectedImage: Dispatch<SetStateAction<FindingImage | null>>;
}) {
    return (
        <TableCell className="align-center">
            <div className="bg-muted relative aspect-video w-24 cursor-zoom-in overflow-hidden rounded-lg border shadow-sm transition-transform hover:scale-105">
                {finding.gallery?.before?.[0]?.url ? (
                    <img
                        src={finding.gallery.before[0].url}
                        className="h-full w-full object-cover"
                        alt="Before"
                        onClick={() => setSelectedImage(finding.gallery?.before?.[0] ?? null)}
                    />
                ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">No Image</div>
                )}
            </div>
        </TableCell>
    );
}

export function FindingAfterCell({
    finding,
    setSelectedImage,
}: {
    finding: Finding;
    setSelectedImage: Dispatch<SetStateAction<FindingImage | null>>;
}) {
    return (
        <TableCell className="align-center">
            <div className="bg-muted relative aspect-video w-24 cursor-zoom-in overflow-hidden rounded-lg border shadow-sm transition-transform hover:scale-105">
                {finding.gallery?.after?.[0]?.url ? (
                    <img
                        src={finding.gallery.after[0].url}
                        className="h-full w-full object-cover"
                        alt="After"
                        onClick={() => setSelectedImage(finding.gallery?.after?.[0] ?? null)}
                    />
                ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center text-[10px] italic">Pending</div>
                )}
            </div>
        </TableCell>
    );
}

export function FindingCauseCodeCell({ finding }: { finding: Finding }) {
    return (
        <TableCell>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium">{finding.causeCode?.description}</span>
                <span className="text-muted-foreground text-xs">{finding.causeCode?.code}</span>
            </div>
        </TableCell>
    );
}

export default function TableFinding({
    mode = 'standalone',
    asset,
    isMom = false,
    isArchived = false,
    findingTypeCode,
    findings,
    findingClauses,
    findingPriorities,
    findingStatuses,
    departments,
    workCenters,
    causeCodes,
    withHeader = true,
    filters,
}: FindingTableProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { can } = usePermissions();
    const meta = findings.meta;
    const caption = tableCaption(meta);
    const [selectedImage, setSelectedImage] = useState<FindingImage | null>(null);

    function getEndpointFromFinding(finding: Finding): 'abnormalities' | 'audits' | undefined {
        switch (finding.type?.code) {
            case 'ABN':
                return 'abnormalities';
            case 'AUD':
                return 'audits';
            default:
                return undefined;
        }
    }

    function isStandAlone(finding: Finding): boolean {
        return mode == 'standalone' && getEndpointFromFinding(finding) != undefined;
    }

    function handleShowFinding(finding: Finding) {
        router.get(route(`${getEndpointFromFinding(finding)}.show`, finding.id));
    }

    function handleEditFinding(finding: Finding) {
        if (isStandAlone(finding)) {
            router.get(route(`${getEndpointFromFinding(finding)}.edit`, finding.id));
        }
    }

    function handleCloseFinding(finding: Finding) {
        if (isStandAlone(finding)) {
            router.post(
                route(`${getEndpointFromFinding(finding)}.close`, finding.id),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    }

    function handleDeletefinding(finding: Finding) {
        if (isStandAlone(finding)) {
            router.delete(route(`${getEndpointFromFinding(finding)}.destroy`, finding.id));
        }
    }

    const [exportDialog, setExportDialog] = useState<boolean>(false);

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters?.query} tabIndex={1} />
                        <PerPageSelector value={filters?.per_page?.toString() ?? '10'} tabIndex={2} />
                        <Filter open={open} setOpen={setOpen} keys={['clause', 'status', 'priority', 'department']}>
                            {mode == 'standalone' && findingClauses?.data && (
                                <FilterFindingClause filter={findingTypeCode} findingClauses={findingClauses?.data ?? []} />
                            )}
                            <CommandSeparator />
                            {causeCodes?.data && (
                                <>
                                    <FilterCauseCode causeCodes={causeCodes?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                            {findingStatuses?.data && (
                                <>
                                    <FilterFindingStatus findingStatuses={findingStatuses?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                            {findingPriorities?.data && (
                                <>
                                    <FilterFindingPriority findingPriorities={findingPriorities?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                            {departments?.data && (
                                <>
                                    <FilterDepartment departments={departments?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                            {workCenters?.data && (
                                <>
                                    <FilterWorkCenter workCenters={workCenters?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                        </Filter>
                        <DateRangePopover />
                    </div>
                    {isMom ? (
                        <ButtonExport
                            tabIndex={4}
                            onClick={() => (window.location.href = route('findings.mom.export'))}
                            label="Export"
                            variant={'outline'}
                        />
                    ) : (
                        <ButtonGroup>
                            {can.create_finding &&
                                !isArchived &&
                                mode === 'standalone' &&
                                (findingTypeCode != null && findingTypeCode == 'ABN' ? (
                                    <ButtonAdd route={route('abnormalities.create')} tabIndex={3} />
                                ) : (
                                    <ButtonAdd route={route('audits.create')} tabIndex={3} />
                                ))}
                            <ButtonExport tabIndex={4} onClick={() => setExportDialog(true)} label="Export" variant={'outline'} />
                        </ButtonGroup>
                    )}
                </div>
            )}
            {findings.data && findings.data.length > 0 ? (
                <div className="grid min-w-0 overflow-x-auto rounded-md">
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground w-12.5">#</TableHead>
                                <TableHead className="text-muted-foreground">Area & Clause</TableHead>
                                <TableHead className="text-muted-foreground hidden md:table-cell">Status</TableHead>
                                {!isArchived && <TableHead className="text-muted-foreground hidden md:table-cell">Priority & Due</TableHead>}
                                <TableHead className="text-muted-foreground min-w-50">Description</TableHead>
                                <TableHead className="text-muted-foreground">Before</TableHead>
                                <TableHead className="text-muted-foreground">After</TableHead>
                                <TableHead className="text-muted-foreground hidden min-w-50 md:table-cell">Rectification Action</TableHead>
                                <TableHead className="text-muted-foreground min-w-30">Created</TableHead>
                                {isArchived && <TableHead className="text-muted-foreground min-w-30">Closed</TableHead>}
                                <TableHead className="text-muted-foreground min-w-20">Dept.</TableHead>
                                <TableHead className="text-muted-foreground"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {findings.data?.map((finding: Finding) => (
                                <TableRow key={finding.id}>
                                    {can.close_finding ? (
                                        <TableCell className="align-center">
                                            <Checkbox
                                                checked={finding.status?.name.toLowerCase() === 'closed'}
                                                disabled={
                                                    finding.status?.name.toLowerCase() === 'closed' ||
                                                    (finding.gallery?.after && finding.gallery.after.length < 1)
                                                }
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        handleCloseFinding(finding);
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    ) : (
                                        <TableCell onClick={() => router.get(route(`${getEndpointFromFinding(finding)}.show`, finding.id))}>
                                            <Info className="h-4 w-4 text-blue-500" />
                                        </TableCell>
                                    )}
                                    <TableCell className="align-center">
                                        <div className="flex flex-col gap-1">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>{truncateText(finding.functionalLocation?.description ?? '', 20)}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{finding.functionalLocation?.code}</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="text-muted-foreground flex gap-2 text-xs">
                                                        <span>{finding?.clause?.code}</span>
                                                        {finding?.type?.name && (
                                                            <>
                                                                {' - '}
                                                                <span>{finding?.type?.name}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>{finding?.clause?.description}</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>

                                    <FindingStatusCell className="hidden md:table-cell" finding={finding} />

                                    {!isArchived && <FindingPriorityAndDueDateCell className="hidden md:table-cell" finding={finding} />}

                                    <FindingDescriptionCell finding={finding} />

                                    <FindingBeforeCell finding={finding} setSelectedImage={setSelectedImage} />

                                    <FindingAfterCell finding={finding} setSelectedImage={setSelectedImage} />

                                    <TableCell className="align-center hidden md:table-cell">
                                        <p className="text-xs text-wrap">{truncateText(finding.rectification_action ?? '', 100)}</p>
                                    </TableCell>

                                    <TableCell className="align-center text-xs">
                                        <div className="grid grid-cols-1 gap-2">
                                            <span>{truncateText(finding?.inspector?.name ?? 'N/A', 15)}</span>
                                            <Tooltip>
                                                <TooltipTrigger className="text-left">
                                                    <span className="text-muted-foreground">{finding?.created_at ?? 'N/A'}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{finding?.created ?? '-'}</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>

                                    {isArchived && (
                                        <TableCell className="align-center text-xs">
                                            <div className="grid grid-cols-1 gap-2">
                                                <span>{truncateText(finding?.rectifier?.name ?? 'N/A', 15)}</span>
                                                <Tooltip>
                                                    <TooltipTrigger className="text-left">
                                                        <span className="text-muted-foreground">{finding?.closed_at ?? 'N/A'}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{finding?.closed ?? '-'}</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    )}

                                    <TableCell className="align-center text-xs">
                                        <div className="flex flex-col gap-1">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate text-left text-xs">
                                                    {truncateText(finding.department?.code ?? 'N/A', 15)}
                                                </TooltipTrigger>
                                                <TooltipContent>{finding.department?.name}</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger className="text-muted-foreground truncate text-left text-xs">
                                                    {truncateText(finding.workCenter?.name ?? 'N/A', 15)}
                                                </TooltipTrigger>
                                                <TooltipContent>{finding.workCenter?.code ?? 'N/A'}</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>

                                    {mode === 'standalone' ? (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontalIcon />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {finding.can?.show && (
                                                        <DropdownMenuItem onClick={() => handleShowFinding(finding)}>
                                                            <Info />
                                                            Details
                                                        </DropdownMenuItem>
                                                    )}

                                                    {finding.can?.update && (
                                                        <DropdownMenuItem onClick={() => handleEditFinding(finding)}>
                                                            <Edit />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}

                                                    {finding.status?.name.toLowerCase() != 'closed' && (
                                                        <ActionFindingDialog finding={finding}>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Wrench />
                                                                Resolve
                                                            </DropdownMenuItem>
                                                        </ActionFindingDialog>
                                                    )}

                                                    {finding.can?.delete && (
                                                        <ActionConfirm
                                                            action={() => handleDeletefinding(finding)}
                                                            title="Delete Finding"
                                                            description="Are you sure? This will permanently delete the finding and its images from the storage."
                                                        >
                                                            <DropdownMenuItem
                                                                onSelect={(e) => e.preventDefault()}
                                                                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500 focus:text-red-800" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </ActionConfirm>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    ) : (
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleShowFinding(finding)} variant="ghost" size="icon" className="size-8">
                                                <Info />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <EmptyIcon />
            )}
            <GeneratePagination meta={meta} />

            <DialogFindingExportExcel
                asset={asset}
                isArchived={isArchived}
                findingTypeCode={findingTypeCode}
                open={exportDialog}
                setOpen={setExportDialog}
                findingPriorities={findingPriorities}
                findingStatuses={findingStatuses}
                departments={departments}
                workCenters={workCenters}
                mode={mode}
            />

            {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </>
    );
}
