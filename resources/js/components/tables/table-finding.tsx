import { ButtonGroup } from '@/components/ui/button-group';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import truncateText, { cn, tableCaption } from '@/lib/utils';
import { CauseCode, Department, Finding, FindingClause, FindingImage, FindingPriority, FindingStatus, Meta } from '@/types';
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
import { GeneratePagination } from '../generate-pagination';
import Lightbox from '../light-box';
import { PerPageSelector } from '../per-page-selector';
import SearchBar from '../search-bar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { CommandSeparator } from '../ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface FindingTableProps {
    mode: 'standalone' | 'functional-location' | 'equipment';
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
        <TableCell className="align-center w-50">
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
    findingTypeCode,
    findings,
    findingClauses,
    findingPriorities,
    findingStatuses,
    departments,
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
        if (isStandAlone(finding)) {
            router.get(route(`${getEndpointFromFinding(finding)}.show`, finding.id));
        }
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
                            {mode == 'standalone' && <FilterFindingClause filter={findingTypeCode} findingClauses={findingClauses?.data ?? []} />}
                            <CommandSeparator />
                            <>
                                <FilterCauseCode causeCodes={causeCodes?.data ?? []} />
                                <CommandSeparator />
                            </>
                            <FilterFindingStatus findingStatuses={findingStatuses?.data ?? []} />
                            <CommandSeparator />
                            <FilterFindingPriority findingPriorities={findingPriorities?.data ?? []} />
                            <CommandSeparator />
                            <FilterDepartment departments={departments?.data ?? []} />
                        </Filter>
                        <DateRangePopover />
                    </div>
                    <ButtonGroup>
                        {can.create_finding &&
                            mode === 'standalone' &&
                            (findingTypeCode != null && findingTypeCode == 'ABN' ? (
                                <ButtonAdd route={route('abnormalities.create')} tabIndex={3} />
                            ) : (
                                <ButtonAdd route={route('audits.create')} tabIndex={3} />
                            ))}
                        <ButtonExport tabIndex={4} onClick={() => setExportDialog(true)} label="Export" variant={'outline'} />
                    </ButtonGroup>
                </div>
            )}
            {findings.data && findings.data.length > 0 ? (
                <div className="grid min-w-0 overflow-x-auto rounded-md">
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {can.close_finding ? (
                                    <TableHead className="text-muted-foreground w-12.5">#</TableHead>
                                ) : mode != 'standalone' ? (
                                    <TableHead className="text-muted-foreground w-12.5">#</TableHead>
                                ) : null}
                                <TableHead className="text-muted-foreground w-40">Area & Clause</TableHead>
                                <TableHead className="text-muted-foreground hidden w-25 md:table-cell">Status</TableHead>
                                <TableHead className="text-muted-foreground hidden w-25 md:table-cell">Priority & Due</TableHead>
                                <TableHead className="text-muted-foreground min-w-50">Description</TableHead>
                                <TableHead className="text-muted-foreground w-25">Before</TableHead>
                                <TableHead className="text-muted-foreground w-25">After</TableHead>
                                <TableHead className="text-muted-foreground hidden min-w-50 md:table-cell">Rectification Action</TableHead>
                                <TableHead className="text-muted-foreground hidden w-17.5 md:table-cell">
                                    {findingTypeCode == 'ABN' ? 'Equipment' : 'Department'}
                                </TableHead>
                                {mode === 'standalone' && findingTypeCode != 'AUD' && (
                                    <TableHead className="text-muted-foreground w-17.5">Cause Code</TableHead>
                                )}

                                {mode == 'standalone' && <TableHead className="text-muted-foreground w-12.5"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {findings.data?.map((finding: Finding) => (
                                <TableRow key={finding.id}>
                                    {can.close_finding ? (
                                        <TableCell className="align-center min-w-10">
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
                                    ) : mode !== 'standalone' ? (
                                        <TableCell onClick={() => router.get(route(`${getEndpointFromFinding(finding)}.show`, finding.id))}>
                                            <Info className="h-4 w-4 text-blue-500" />
                                        </TableCell>
                                    ) : null}
                                    <TableCell className="align-center min-w-55">
                                        <div className="flex flex-col gap-1">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>{truncateText(finding.functionalLocation?.description ?? '', 25)}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{finding.functionalLocation?.code}</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-muted-foreground text-xs">{finding?.clause?.code}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{finding?.clause?.description}</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>

                                    <FindingStatusCell className="hidden md:table-cell" finding={finding} />

                                    <FindingPriorityAndDueDateCell className="hidden md:table-cell" finding={finding} />

                                    <FindingDescriptionCell finding={finding} />

                                    <FindingBeforeCell finding={finding} setSelectedImage={setSelectedImage} />

                                    <FindingAfterCell finding={finding} setSelectedImage={setSelectedImage} />

                                    <TableCell className="align-center hidden w-50 md:table-cell">
                                        <p className="text-xs text-wrap">{truncateText(finding.rectification_action ?? '', 100)}</p>
                                    </TableCell>

                                    <TableCell className="align-center hidden text-xs md:table-cell">
                                        {findingTypeCode == 'ABN' ? (
                                            <div className="flex max-w-sm flex-col items-start">
                                                <span className="max-w-xs font-medium">{finding.equipment ? finding.equipment?.code : 'N/A'}</span>
                                                <span className="text-muted-foreground max-w-md">
                                                    {truncateText(finding.equipment?.sort_field ?? 'N/A', 20)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <Tooltip>
                                                    <TooltipTrigger className="w-40 truncate text-left">{finding.department?.name}</TooltipTrigger>
                                                    <TooltipContent>{finding.department?.name}</TooltipContent>
                                                </Tooltip>
                                                <div className="text-muted-foreground text-xs">{finding.department?.code}</div>
                                            </div>
                                        )}
                                    </TableCell>

                                    {mode === 'standalone' && findingTypeCode != 'AUD' && <FindingCauseCodeCell finding={finding} />}

                                    {mode === 'standalone' && (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontalIcon />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {can.show_finding && (
                                                        <DropdownMenuItem onClick={() => handleShowFinding(finding)}>
                                                            <Info />
                                                            Details
                                                        </DropdownMenuItem>
                                                    )}

                                                    {can.edit_finding && (
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

                                                    {can.delete_finding && (
                                                        <>
                                                            <DropdownMenuSeparator />
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
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
                findingTypeCode={findingTypeCode}
                open={exportDialog}
                setOpen={setExportDialog}
                findingPriorities={findingPriorities}
                findingStatuses={findingStatuses}
                departments={departments}
                mode={mode}
            />

            {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </>
    );
}
