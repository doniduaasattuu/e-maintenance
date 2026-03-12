import { ActionConfirm } from '@/components/action-confirm';
import { GeneratePagination } from '@/components/generate-pagination';
import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { tableCaption } from '@/lib/utils';
import { Meta, Repository } from '@/types';
import { Download, Leaf } from 'lucide-react';
import React from 'react';

interface RepositoryAssetProps {
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    extensions?: string[];
    renderable: string[];
    handleDownloadRepository: (id: number) => void;
    model: string;
}

export default function RepositoryAssetLayout({ model, repositories, renderable, handleDownloadRepository }: RepositoryAssetProps) {
    const meta = repositories.meta;
    const caption = tableCaption(meta);

    return (
        <React.Fragment>
            {repositories && repositories.data.length > 0 ? (
                <div className="w-full space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Repositories" description={`Related ${model} document and repositories.`} />
                    </div>
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground w-7.5">#</TableHead>
                                <TableHead className="text-muted-foreground">Title</TableHead>
                                <TableHead className="text-muted-foreground">Ext</TableHead>
                                <TableHead className="text-muted-foreground">Uploaded at</TableHead>
                                <TableHead className="text-muted-foreground w-10 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {repositories.data.map((repository: Repository, index: number) => {
                                return (
                                    <TableRow key={repository.id}>
                                        <TableCell>{meta.from + index}</TableCell>
                                        <TableCell className="max-w-md truncate font-medium">
                                            {renderable.includes(repository.extension ?? '') ? (
                                                <a
                                                    target="_blank"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                    href={repository.url}
                                                >
                                                    {repository.title}
                                                </a>
                                            ) : (
                                                <ActionConfirm
                                                    action={() => handleDownloadRepository(repository.id)}
                                                    title="Preview Not Available"
                                                    description="This file type cannot be previewed directly in your browser. Would you like to download it instead?"
                                                    actionLabel="Download"
                                                >
                                                    <span className="text-foreground cursor-pointer underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!">
                                                        {repository.title}
                                                    </span>
                                                </ActionConfirm>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">
                                            <Badge variant="outline">{repository.extension}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{repository.created_at}</TableCell>
                                        <TableCell className="w-10 text-right">
                                            <a href={`/repositories/${repository.id}`} title="Download">
                                                <Download size={18} className="text-blue-500" />
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <GeneratePagination meta={meta} />
                </div>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Leaf />
                        </EmptyMedia>
                        <EmptyTitle>No data</EmptyTitle>
                        <EmptyDescription>No data found</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent></EmptyContent>
                </Empty>
            )}
        </React.Fragment>
    );
}
