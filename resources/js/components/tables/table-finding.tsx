import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { Department, Finding, FindingClause, FindingImage, FindingPriority, FindingStatus, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, Info, MoreHorizontalIcon, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { ActionConfirm } from '../action-confirm';
import ButtonAdd from '../button-add';
import { DateRangePopover } from '../date-range-popover';
import EmptyIcon from '../empty-icon';
import Filter from '../filter';
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
import { UploadImageDialog } from '../upload-image-dialog';

interface FindingTableProps {
    findings: {
        data: Finding[];
        meta: Meta;
    };
    findingClauses: {
        data: FindingClause[];
    };
    findingPriorities: {
        data: FindingPriority[];
    };
    findingStatuses: {
        data: FindingStatus[];
    };
    departments: {
        data: Department[];
    };
}

export default function TableFinding({ findings, findingClauses, findingPriorities, findingStatuses, departments }: FindingTableProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { can } = usePermissions();
    const meta = findings.meta;
    const caption = tableCaption(meta);
    const [selectedImage, setSelectedImage] = useState<FindingImage | null>(null);

    function handleShowFinding(id: number) {
        router.get(route('findings.show', id));
    }

    function handleEditFinding(id: number) {
        router.get(route('findings.edit', id));
    }

    function handleCloseFinding(id: number) {
        router.post(
            route('findings.close', id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function handleDeletefinding(id: number) {
        router.delete(route('findings.destroy', id));
    }

    return (
        <TableLayout
            title="Audit 5RK3"
            description="Represents a unique physical object tracked for maintenance, costing, and history."
            className="md:max-w-full"
        >
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                    <Filter open={open} setOpen={setOpen} keys={['clause', 'status', 'priority', 'department']}>
                        <FilterFindingClause findingClauses={findingClauses.data} setOpen={setOpen} />
                        <CommandSeparator />
                        <FilterFindingStatus findingStatuses={findingStatuses.data} setOpen={setOpen} />
                        <CommandSeparator />
                        <FilterFindingPriority findingPriorities={findingPriorities.data} setOpen={setOpen} />
                        <CommandSeparator />
                        <FilterDepartment departments={departments.data} setOpen={setOpen} />
                    </Filter>
                    <DateRangePopover />
                </div>
                {can.create_finding && <ButtonAdd route={route('findings.create')} tabIndex={2} />}
            </div>
            {findings?.data?.length > 0 ? (
                <div className="grid min-w-0 overflow-x-auto rounded-md">
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {can.close_finding && <TableHead className="w-12.5"></TableHead>}
                                <TableHead className="w-40">Clause</TableHead>
                                <TableHead className="w-25">Status</TableHead>
                                <TableHead className="w-25">Priority & Due</TableHead>
                                <TableHead className="min-w-100">Description</TableHead>
                                <TableHead className="w-25">Before</TableHead>
                                <TableHead className="w-25">After</TableHead>
                                <TableHead className="w-17.5">Department</TableHead>
                                <TableHead className="w-12.5">Created</TableHead>
                                <TableHead className="w-12.5">Closed</TableHead>
                                {can.delete_finding && <TableHead className="w-12.5"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {findings.data?.map((finding: Finding) => (
                                <TableRow key={finding.id}>
                                    {can.close_finding && (
                                        <TableCell className="align-center min-w-10">
                                            <Checkbox
                                                // Status tercentang jika nama status adalah 'closed'
                                                checked={finding.status?.name.toLowerCase() === 'closed'}
                                                // Nonaktifkan checkbox jika sudah closed agar user tidak bisa buka kembali
                                                disabled={finding.status?.name.toLowerCase() === 'closed'}
                                                // Panggil fungsi saat diklik
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        handleCloseFinding(finding.id);
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell className="align-center min-w-55">
                                        <div className="text-primary font-bold">{finding.clause?.code}</div>
                                        <div className="text-muted-foreground mt-1 text-xs text-wrap" title={finding.clause?.description}>
                                            {finding.clause?.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-center">
                                        <Badge
                                            variant={finding?.status?.name.toLowerCase() === 'open' ? 'destructive' : 'default'}
                                            className={`text-[10px] tracking-wider uppercase ${finding?.status?.name.toLowerCase() === 'closed' && 'bg-green-500 text-black'}`}
                                        >
                                            {finding.status?.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="align-center">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-md font-medium">{finding.priority?.label}</span>
                                            <span
                                                className={`w-fit rounded-full px-2 py-0.5 text-[11px] ${finding.is_overdue ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}
                                            >
                                                {finding.due_date_readable}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-center w-100">
                                        <p className="text-sm text-wrap">{finding.description}</p>
                                    </TableCell>

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
                                                <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

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
                                                <div className="text-muted-foreground flex h-full items-center justify-center text-[10px] italic">
                                                    Pending
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-center">
                                        <div className="flex flex-col gap-1">
                                            <Tooltip>
                                                <TooltipTrigger className="w-40 truncate text-left">{finding.department?.name}</TooltipTrigger>
                                                <TooltipContent>{finding.department?.name}</TooltipContent>
                                            </Tooltip>
                                            <div className="text-muted-foreground">{finding.department?.code}</div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-center">
                                        <div className="text-muted-foreground flex flex-col text-xs">
                                            <span>{finding?.inspector?.name}</span>
                                            <span>{finding?.created_at}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="align-center">
                                        <div className="text-muted-foreground flex flex-col text-xs">
                                            <span>{finding?.verifier?.name}</span>
                                            <span>{finding?.closed_at}</span>
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
                                                {can.show_finding && (
                                                    <DropdownMenuItem onClick={() => handleShowFinding(finding.id)}>
                                                        <Info />
                                                        Details
                                                    </DropdownMenuItem>
                                                )}

                                                {can.edit_finding && can.update_finding && (
                                                    <DropdownMenuItem onClick={() => handleEditFinding(finding.id)}>
                                                        <Edit />
                                                        Edit
                                                    </DropdownMenuItem>
                                                )}

                                                {can.update_finding && (
                                                    <UploadImageDialog finding={finding}>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Upload />
                                                            Upload photos
                                                        </DropdownMenuItem>
                                                    </UploadImageDialog>
                                                )}

                                                {can.delete_finding && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <ActionConfirm
                                                            action={() => handleDeletefinding(finding.id)}
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
        </TableLayout>
    );
}
