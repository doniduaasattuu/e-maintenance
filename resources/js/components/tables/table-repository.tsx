import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { copyTextToClipboard, tableCaption } from '@/lib/utils';
import { Meta, Repository } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Copy, Download, Edit, MoreHorizontalIcon, Trash2 } from 'lucide-react';
import React from 'react';
import { ActionConfirm } from '../action-confirm';
import ButtonAdd from '../button-add';
import EmptyIcon from '../empty-icon';
import Filter from '../filter';
import FilterRepositoryExtension from '../filter-repository-extension';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface TableRepositoryProps {
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    extensions?: string[];
    renderable: string[];
    withHeader?: boolean;
}

export default function TableRepository({ repositories, extensions, renderable, withHeader = true }: TableRepositoryProps) {
    const { can } = usePermissions();
    const meta = repositories.meta;
    const caption = tableCaption(meta);
    const [open, setOpen] = React.useState<boolean>(false);

    function handleDeleteRepository(id: number) {
        router.delete(route('repositories.destroy', id));
    }

    function handleDownloadRepository(id: number) {
        window.open(route('repositories.show', id));
    }

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar tabIndex={1} />
                        <Filter open={open} setOpen={setOpen} keys={['ext']}>
                            <FilterRepositoryExtension extensions={extensions} />
                        </Filter>
                    </div>
                    {can.create_repository && <ButtonAdd route={route('repositories.create')} tabIndex={2} />}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {repositories.data && repositories.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">#</TableHead>
                                <TableHead className="text-muted-foreground">Title</TableHead>
                                <TableHead className="text-muted-foreground">Ext</TableHead>
                                <TableHead className="text-muted-foreground">Mime</TableHead>
                                <TableHead className="text-muted-foreground">Uploaded by</TableHead>
                                <TableHead className="text-muted-foreground">Uploaded at</TableHead>
                                <TableHead className="text-muted-foreground text-right"></TableHead>
                                {/* <TableHead className="text-muted-foreground text-right"></TableHead>
                                <TableHead className="text-muted-foreground text-right"></TableHead>
                                {can.edit_repository && <TableHead className="text-muted-foreground text-right"></TableHead>}
                                {can.delete_repository && <TableHead className="text-muted-foreground text-right"></TableHead>} */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {repositories.data.map((repository: Repository, index: number) => {
                                return (
                                    <TableRow key={repository.id}>
                                        <TableCell className="w-12.5">{meta.from + index}</TableCell>
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
                                        <TableCell className="text-muted-foreground max-w-50 truncate">{repository.mime_type}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{repository.uploadedBy?.name}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{repository.created_at}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="size-6">
                                                        <MoreHorizontalIcon />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <a href={`/repositories/${repository.id}`} title="Download">
                                                        <DropdownMenuItem>
                                                            <Download size={18} className="text-blue-500" /> Download
                                                        </DropdownMenuItem>
                                                    </a>
                                                    <DropdownMenuItem onClick={() => copyTextToClipboard(repository.url)}>
                                                        <Copy size={18} /> Copy
                                                    </DropdownMenuItem>
                                                    {can.edit_repository && (
                                                        <Link title="Edit" href={route('repositories.edit', repository.id)}>
                                                            <DropdownMenuItem>
                                                                <Edit size={18} className="text-green-500" /> Edit
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    )}
                                                    {can.delete_repository && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <ActionConfirm
                                                                action={() => handleDeleteRepository(repository.id)}
                                                                title={`Delete Repository ${repository.title}?`}
                                                                description="This action will remove this repository from database. This action cannot be undone."
                                                            >
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <Trash2 size={18} className="text-red-500" /> Delete
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
        </>
    );
}
