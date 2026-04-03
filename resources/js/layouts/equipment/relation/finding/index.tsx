import EmptyIcon from '@/components/empty-icon';
import { GeneratePagination } from '@/components/generate-pagination';
import HeadingSmall from '@/components/heading-small';
import Lightbox from '@/components/light-box';
import {
    FindingAfterCell,
    FindingBeforeCell,
    FindingCauseCodeCell,
    FindingDescriptionCell,
    FindingPriorityAndDueDateCell,
    FindingStatusCell,
} from '@/components/tables/table-finding';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import usePermissions from '@/hooks/use-permissions';
import truncateText, { cn, tableCaption } from '@/lib/utils';
import { Finding, FindingImage, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Info } from 'lucide-react';
import React, { useState } from 'react';

interface FindingAssetProps {
    findings: {
        data: Finding[];
        meta: Meta;
    };
    className?: string;
}

export default function FindingTable({ findings, className }: FindingAssetProps) {
    const { can } = usePermissions();
    const meta = findings.meta;
    const caption = tableCaption(meta);
    const [selectedImage, setSelectedImage] = useState<FindingImage | null>(null);

    return (
        <React.Fragment>
            {findings && findings.data.length > 0 ? (
                <div className={cn('grid min-w-0 space-y-4 overflow-x-auto rounded-md', className)}>
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Findings" description={`Equipment finding history.`} />
                    </div>
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground w-7.5">#</TableHead>
                                <TableHead className="w-25">Status</TableHead>
                                <TableHead className="w-25">Priority & Due</TableHead>
                                <TableHead className="min-w-50">Description</TableHead>
                                <TableHead className="w-25">Before</TableHead>
                                <TableHead className="w-25">After</TableHead>
                                <TableHead className="w-17.5">Cause Code</TableHead>
                                <TableHead className="w-10">Created</TableHead>
                                <TableHead className="w-10">Closed</TableHead>
                                {can.show_finding && <TableHead className="w-10"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {findings.data.map((finding: Finding, index: number) => {
                                return (
                                    <TableRow key={finding.id}>
                                        <TableCell>{meta.from + index}</TableCell>
                                        <FindingStatusCell finding={finding} />
                                        <FindingPriorityAndDueDateCell finding={finding} />
                                        <FindingDescriptionCell finding={finding} />
                                        <FindingBeforeCell finding={finding} setSelectedImage={setSelectedImage} />
                                        <FindingAfterCell finding={finding} setSelectedImage={setSelectedImage} />
                                        <FindingCauseCodeCell finding={finding} />

                                        <TableCell className="align-center">
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
                                        </TableCell>

                                        {can.show_finding && (
                                            <TableCell>
                                                <Info
                                                    onClick={() => router.get(route('abnormalities.show', finding.id))}
                                                    size={18}
                                                    className="text-blue-500"
                                                />
                                            </TableCell>
                                        )}

                                        {/* {can.delete_finding && (
                                            <TableCell className="w-10 text-right">
                                                {can.delete_role && (
                                                    <ActionConfirm
                                                        // action={() => handleDeleteRole(role.id)}
                                                        title={`Delete Finding of ${finding.equipment?.code}?`}
                                                        description="This action will remove this finding from all users. This cannot be undone."
                                                    >
                                                        <Trash2 size={18} className="text-red-500" />
                                                    </ActionConfirm>
                                                )}
                                            </TableCell>
                                        )} */}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <GeneratePagination meta={meta} />
                </div>
            ) : (
                <EmptyIcon />
            )}

            {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </React.Fragment>
    );
}
