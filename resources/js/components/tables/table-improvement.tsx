import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import truncateText, { formatName, tableCaption } from '@/lib/utils';
import { Improvement, ImprovementCategory, ImprovementImage, ImprovementStatus, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { BadgeCheck, Check, CheckCheck, Edit, Info, MoreHorizontalIcon, Trash2, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { ActionConfirm } from '../action-confirm';
import { DateRangePopover } from '../date-range-popover';
import EmptyIcon from '../empty-icon';
import Filter from '../filter';
import FilterImprovementCategory from '../filter-improvement-category';
import FilterImprovementStatus from '../filter-improvement-status';
import Lightbox from '../light-box';
import { PerPageSelector } from '../per-page-selector';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { CommandSeparator } from '../ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TableimprovementProps {
    improvements: {
        data: Improvement[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
    improvementCategories: {
        data: ImprovementCategory[];
    };
    improvementStatuses: {
        data: ImprovementStatus[];
    };
}

export default function Tableimprovement({
    improvements,
    withHeader = true,
    filters,
    improvementCategories,
    improvementStatuses,
}: TableimprovementProps) {
    const { can } = usePermissions();
    const meta = improvements.meta;
    const caption = tableCaption(meta);
    const [open, setOpen] = useState<boolean>(false);

    // function handleDeleteimprovement(id: number | string) {
    //     router.delete(route('improvements.destroy', id));
    // }

    const [selectedImage, setSelectedImage] = useState<ImprovementImage | null>(null);

    function TableText({ str, truncateLength = 80 }: { str: string | null; truncateLength?: number }) {
        return (
            <TableCell className="align-center min-w-50">
                <Tooltip>
                    <TooltipTrigger className="truncate text-left">
                        <p className="text-xs text-wrap">{truncateText(str ?? '', truncateLength)}</p>
                    </TooltipTrigger>
                    <TooltipContent> {str}</TooltipContent>
                </Tooltip>
            </TableCell>
        );
    }

    function ImageCell({
        improvement,
        setSelectedImage,
        category,
    }: {
        improvement: Improvement;
        setSelectedImage: Dispatch<SetStateAction<ImprovementImage | null>>;
        category: 'before' | 'after';
    }) {
        return (
            <TableCell className="align-center">
                <div className="bg-muted relative aspect-video w-24 cursor-zoom-in overflow-hidden rounded-lg border shadow-sm transition-transform hover:scale-105">
                    {improvement.gallery?.[category]?.[0]?.url ? (
                        <img
                            src={improvement.gallery?.[category]?.[0].url}
                            className="h-full w-full object-cover"
                            alt="Before"
                            onClick={() => setSelectedImage(improvement.gallery?.[category]?.[0] ?? null)}
                        />
                    ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">No Image</div>
                    )}
                </div>
            </TableCell>
        );
    }

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters?.query} tabIndex={1} />
                        <PerPageSelector value={filters?.per_page?.toString() ?? '10'} tabIndex={2} />
                        <Filter open={open} setOpen={setOpen} keys={['category', 'status']}>
                            {improvementCategories && improvementCategories?.data && (
                                <>
                                    <FilterImprovementCategory improvementCategories={improvementCategories?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                            {improvementStatuses && improvementStatuses?.data && (
                                <>
                                    <FilterImprovementStatus improvementStatuses={improvementStatuses?.data ?? []} />
                                    <CommandSeparator />
                                </>
                            )}
                        </Filter>
                        <DateRangePopover />
                    </div>
                    <ButtonGroup>{can.create_improvement && <ButtonAdd tabIndex={3} route={route('improvements.create')} />}</ButtonGroup>
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {improvements?.data && improvements?.data?.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Title</TableHead>
                                <TableHead className="text-muted-foreground">Problem</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="text-muted-foreground">Before</TableHead>
                                <TableHead className="text-muted-foreground">After</TableHead>
                                <TableHead className="text-muted-foreground">Root Cause</TableHead>
                                <TableHead className="text-muted-foreground">Expected Benefit</TableHead>
                                <TableHead className="text-muted-foreground">Area</TableHead>
                                <TableHead className="text-muted-foreground">Creator</TableHead>
                                {/* <TableHead className={`table-timestamp text-muted-foreground ${can.delete_improvement ?? 'text-right'}`}>
                                    Date
                                </TableHead> */}
                                <TableHead className="text-muted-foreground w-10 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {improvements.data.map((improvement: Improvement) => {
                                return (
                                    <TableRow key={improvement.id} className="text-xs">
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Tooltip>
                                                    <TooltipTrigger className="truncate text-left">
                                                        {truncateText(improvement.title, 25)}
                                                    </TooltipTrigger>
                                                    <TooltipContent> {improvement.title}</TooltipContent>
                                                </Tooltip>
                                                <span className="text-muted-foreground">
                                                    <Badge
                                                        variant={improvement?.status?.name.toLowerCase() === 'rejected' ? 'destructive' : 'outline'}
                                                        className="text-[10px] tracking-wider uppercase"
                                                        style={{
                                                            color:
                                                                improvement?.status?.name.toLowerCase() === 'rejected'
                                                                    ? undefined
                                                                    : improvement?.status?.color,

                                                            borderColor:
                                                                improvement?.status?.name.toLowerCase() === 'rejected'
                                                                    ? undefined
                                                                    : improvement?.status?.color,
                                                        }}
                                                    >
                                                        {improvement.status?.name}
                                                    </Badge>
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableText str={improvement.problem} />
                                        <TableText str={improvement.description} />

                                        <ImageCell category="before" improvement={improvement} setSelectedImage={setSelectedImage} />
                                        <ImageCell category="after" improvement={improvement} setSelectedImage={setSelectedImage} />

                                        <TableText str={improvement.root_cause} />
                                        <TableText str={improvement.expected_benefit} />

                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span>{truncateText(improvement.functionalLocation?.code ?? '', 15)}</span>
                                                <span className="text-muted-foreground">{improvement.equipment?.code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-muted-foreground flex flex-col gap-1">
                                                <span>{formatName(improvement.creator?.name ?? '')}</span>
                                                <span>{improvement.created_at}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontalIcon />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {improvement.can?.show && (
                                                        <DropdownMenuItem onClick={() => router.get(route('improvements.show', improvement.id))}>
                                                            <Info />
                                                            Details
                                                        </DropdownMenuItem>
                                                    )}

                                                    {improvement.can?.update && (
                                                        <DropdownMenuItem onClick={() => router.get(route('improvements.edit', improvement.id))}>
                                                            <Edit />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}

                                                    {(improvement.can?.submit ||
                                                        improvement.can?.implement ||
                                                        improvement.can?.approve ||
                                                        improvement.can?.verify ||
                                                        improvement.can?.reject) && <DropdownMenuSeparator />}

                                                    {improvement.can?.submit && (
                                                        <ActionConfirm
                                                            action={() =>
                                                                router.post(
                                                                    route('improvements.submit', improvement.id),
                                                                    {},
                                                                    {
                                                                        preserveScroll: true,
                                                                        preserveState: true,
                                                                    },
                                                                )
                                                            }
                                                            title="Mark as Submitted"
                                                            description="Are you sure you want to mark this improvement as Submitted? This indicates that the improvement work has been submitted."
                                                            actionLabel="Submit"
                                                        >
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Check className="h-4 w-4" />
                                                                Mark as Submitted
                                                            </DropdownMenuItem>
                                                        </ActionConfirm>
                                                    )}

                                                    {improvement.can?.implement && (
                                                        <ActionConfirm
                                                            action={() =>
                                                                router.post(
                                                                    route('improvements.implement', improvement.id),
                                                                    {},
                                                                    {
                                                                        preserveScroll: true,
                                                                        preserveState: true,
                                                                    },
                                                                )
                                                            }
                                                            title="Mark as Implemented"
                                                            description="Are you sure you want to mark this improvement as implemented? This indicates that the improvement work has been reviewed and implemented."
                                                            actionLabel="Yes"
                                                        >
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Check className="h-4 w-4" />
                                                                Mark as Implemented
                                                            </DropdownMenuItem>
                                                        </ActionConfirm>
                                                    )}

                                                    {improvement.can?.approve && (
                                                        <ActionConfirm
                                                            action={() =>
                                                                router.post(
                                                                    route('improvements.approve', improvement.id),
                                                                    {},
                                                                    {
                                                                        preserveScroll: true,
                                                                        preserveState: true,
                                                                    },
                                                                )
                                                            }
                                                            title="Approve Improvement"
                                                            description="Are you sure you want to approve this improvement? This confirms that the implemented improvement has been reviewed and approved."
                                                            actionLabel="Approve"
                                                        >
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <CheckCheck className="h-4 w-4" />
                                                                Mark as Approved
                                                            </DropdownMenuItem>
                                                        </ActionConfirm>
                                                    )}

                                                    {improvement.can?.verify && (
                                                        <ActionConfirm
                                                            action={() =>
                                                                router.post(
                                                                    route('improvements.verify', improvement.id),
                                                                    {},
                                                                    {
                                                                        preserveScroll: true,
                                                                        preserveState: true,
                                                                    },
                                                                )
                                                            }
                                                            title="Verify Improvement"
                                                            description="Are you sure you want to verify this improvement? This confirms that the improvement has been verified and the expected result has been achieved."
                                                            actionLabel="Verify"
                                                        >
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <BadgeCheck className="h-4 w-4" />
                                                                Mark as Verified
                                                            </DropdownMenuItem>
                                                        </ActionConfirm>
                                                    )}

                                                    {improvement.can?.reject && (
                                                        <ActionConfirm
                                                            action={() =>
                                                                router.post(
                                                                    route('improvements.reject', improvement.id),
                                                                    {},
                                                                    {
                                                                        preserveScroll: true,
                                                                        preserveState: true,
                                                                    },
                                                                )
                                                            }
                                                            title="Mark as rejected"
                                                            description="Are you sure you want to mark this improvement as rejected? This indicates that the improvement is rejected."
                                                            actionLabel="Reject"
                                                        >
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <X className="h-4 w-4" />
                                                                Mark as rejected
                                                            </DropdownMenuItem>
                                                        </ActionConfirm>
                                                    )}

                                                    {improvement.can?.delete && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <ActionConfirm
                                                                action={() =>
                                                                    router.delete(route('improvements.destroy', improvement.id), {
                                                                        preserveScroll: true,
                                                                        preserveState: true,
                                                                    })
                                                                }
                                                                title="Delete Improvement"
                                                                description="Are you sure? This will permanently delete the improvement and its images from the storage."
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
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <EmptyIcon />
                )}
            </div>
            <GeneratePagination meta={meta} />

            {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </>
    );
}
