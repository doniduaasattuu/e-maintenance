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
import { DateRangePopover } from '../date-range-popover';
import EmptyIcon from '../empty-icon';
import Filter from '../filter';
import FilterCauseCode from '../filter-cause-code';
import FilterDepartment from '../filter-department';
import FilterFindingClause from '../filter-finding-clause';
import FilterFindingPriority from '../filter-finding-priority';
import FilterFindingStatus from '../filter-finding-status';
import { GeneratePagination } from '../generate-pagination';
import Lightbox from '../light-box';
import SearchBar from '../search-bar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { CommandSeparator } from '../ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface FindingTableProps {
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
    moduleKey: string;
    endpoint?: string;
    clauseFilter?: string;
    withHeader?: boolean;
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
    findings,
    findingClauses,
    findingPriorities,
    findingStatuses,
    departments,
    causeCodes,
    endpoint,
    moduleKey,
    clauseFilter,
    withHeader = true,
}: FindingTableProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { can } = usePermissions();
    const meta = findings.meta;
    const caption = tableCaption(meta);
    const [selectedImage, setSelectedImage] = useState<FindingImage | null>(null);

    function getEndpoint(finding: Finding): 'abnormalities' | 'audits' | null {
        switch (finding.type?.code) {
            case 'ABN':
                return 'abnormalities';
            case 'AUD':
                return 'audits';
            default:
                return null;
        }
    }

    function handleShowFinding(finding: Finding) {
        const target = endpoint ?? getEndpoint(finding);

        if (target) {
            router.get(route(`${target}.show`, finding.id));
        }
    }

    function handleEditFinding(finding: Finding) {
        const target = endpoint ?? getEndpoint(finding);

        if (target) {
            router.get(route(`${target}.edit`, finding.id));
        }
    }

    function handleCloseFinding(finding: Finding) {
        const target = endpoint ?? getEndpoint(finding);

        router.post(
            route(`${target}.close`, finding.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function handleDeletefinding(finding: Finding) {
        const target = endpoint ?? getEndpoint(finding);

        if (target) {
            router.delete(route(`${target}.destroy`, finding.id));
        }
    }

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar tabIndex={1} />
                        <Filter open={open} setOpen={setOpen} keys={['clause', 'status', 'priority', 'department']}>
                            <FilterFindingClause filter={clauseFilter} findingClauses={findingClauses?.data ?? []} />
                            <CommandSeparator />
                            {moduleKey == 'ABNORMALITY' && (
                                <>
                                    <FilterCauseCode causeCodes={causeCodes?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                            <FilterFindingStatus findingStatuses={findingStatuses?.data ?? []} />
                            <CommandSeparator />
                            <FilterFindingPriority findingPriorities={findingPriorities?.data ?? []} />
                            <CommandSeparator />
                            <FilterDepartment departments={departments?.data ?? []} />
                        </Filter>
                        <DateRangePopover />
                    </div>
                    {can.create_finding && <ButtonAdd route={route(`${endpoint}.create`)} tabIndex={2} />}
                </div>
            )}
            {findings?.data?.length > 0 ? (
                <div className="grid min-w-0 overflow-x-auto rounded-md">
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {can.close_finding ? <TableHead className="w-12.5">#</TableHead> : null}
                                <TableHead className="hidden w-40 md:table-cell">Clause</TableHead>
                                <TableHead className="hidden w-25 md:table-cell">Status</TableHead>
                                <TableHead className="hidden w-25 md:table-cell">Priority & Due</TableHead>
                                <TableHead className="min-w-50">Description</TableHead>
                                <TableHead className="w-25">Before</TableHead>
                                <TableHead className="w-25">After</TableHead>
                                <TableHead className="hidden min-w-50 md:table-cell">Rectification Action</TableHead>
                                <TableHead className="hidden w-17.5 md:table-cell">
                                    {moduleKey == 'ABNORMALITY' ? 'Equipment' : 'Department'}
                                </TableHead>
                                {moduleKey == 'ABNORMALITY' && <TableHead className="w-17.5">Cause Code</TableHead>}
                                {/* <TableHead className="w-10">Created</TableHead>
                                <TableHead className="w-10">Closed</TableHead> */}
                                <TableHead className="w-12.5"></TableHead>
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
                                    ) : null}
                                    {/* {can.close_finding && finding.gallery?.after && finding.gallery.after.length > 0 ? (
                                        <TableCell className="align-center min-w-10">
                                            <Checkbox
                                                checked={finding.status?.name.toLowerCase() === 'closed'}
                                                disabled={finding.status?.name.toLowerCase() === 'closed'}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        handleCloseFinding(finding);
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    ) : (
                                        <TableCell>
                                            <Checkbox disabled></Checkbox>
                                        </TableCell>
                                    )} */}
                                    <TableCell className="align-center hidden min-w-55 md:table-cell">
                                        <div className="text-primary font-bold">{finding.clause?.code}</div>
                                        <div className="text-muted-foreground mt-1 text-xs text-wrap" title={finding.clause?.description}>
                                            {truncateText(finding.clause?.description ?? '', 100)}
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
                                        {moduleKey == 'ABNORMALITY' ? (
                                            <div className="flex max-w-sm flex-col items-start">
                                                <span className="max-w-xs font-medium">{finding.equipment?.code}</span>
                                                <span className="text-muted-foreground max-w-md">
                                                    {truncateText(finding.equipment?.sort_field ?? '', 20)}
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

                                    {/* <TableCell className="align-center">
                                        <div className="text-muted-foreground flex flex-col text-xs">
                                            <Tooltip>
                                                <TooltipTrigger className="w-20 truncate text-left">
                                                    {truncateText(finding?.inspector?.name ?? '', 15)}
                                                </TooltipTrigger>
                                                <TooltipContent>{finding?.inspector?.name}</TooltipContent>
                                            </Tooltip>
                                            <span>{finding?.created_at}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-center">
                                        <div className="text-muted-foreground flex flex-col text-xs">
                                            <Tooltip>
                                                <TooltipTrigger className="w-20 truncate text-left">
                                                    {truncateText(finding?.verifier?.name ?? '', 15)}
                                                </TooltipTrigger>
                                                <TooltipContent>{finding?.verifier?.name}</TooltipContent>
                                            </Tooltip>
                                            <span>{finding?.closed_at}</span>
                                        </div>
                                    </TableCell> */}

                                    {moduleKey == 'ABNORMALITY' && <FindingCauseCodeCell finding={finding} />}

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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <EmptyIcon />
            )}
            <GeneratePagination meta={meta} />

            {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </>
    );
}
