import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { Meta, Repository } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Download, Edit, Trash2, Upload } from 'lucide-react';
import React from 'react';
import { ActionConfirm } from '../action-confirm';
import Filter from '../filter';
import FilterRepositoryExtension from '../filter-repository-extension';
import TextLink from '../text-link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface TableRepositoryProps {
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    extensions?: string[];
}

export default function TableRepository({ repositories, extensions }: TableRepositoryProps) {
    const can = usePermissions();
    const meta = repositories.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;
    const [open, setOpen] = React.useState<boolean>(false);

    function handleDeleteRepository(id: number) {
        router.delete(route('repositories.destroy', id));
    }

    return (
        <TableLayout title="Repositories" description="Centralized document storage module">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                    <Filter open={open} setOpen={setOpen}>
                        <FilterRepositoryExtension extensions={extensions} setOpen={setOpen} />
                    </Filter>
                </div>
                {can.create_repository && (
                    <Link href={route('repositories.create')}>
                        <Button variant="outline">
                            <Upload />
                            Upload
                        </Button>
                    </Link>
                )}
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">#</TableHead>
                        <TableHead className="text-muted-foreground">Title</TableHead>
                        <TableHead className="text-muted-foreground">Ext</TableHead>
                        <TableHead className="text-muted-foreground">Mime</TableHead>
                        <TableHead className="text-muted-foreground">Uploaded by</TableHead>
                        <TableHead className="text-muted-foreground">Uploaded at</TableHead>
                        <TableHead className="text-muted-foreground w-10 text-right"></TableHead>
                        {can.update_repository && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                        {can.delete_repository && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {repositories.data.map((repository: Repository, index: number) => {
                        return (
                            <TableRow key={repository.id}>
                                <TableCell className="w-[50px]">{meta.from + index}</TableCell>
                                <TableCell className="font-medium">
                                    <a
                                        target="_blank"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        href={repository.url}
                                    >
                                        {repository.title}
                                    </a>
                                </TableCell>
                                <TableCell className="text-muted-foreground w-[90px]">
                                    <Badge variant="outline">{repository.extension}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{repository.mime_type}</TableCell>
                                <TableCell className="text-muted-foreground w-[90px]">{repository.uploadedBy?.name}</TableCell>
                                <TableCell className="text-muted-foreground w-[90px]">{repository.created_at}</TableCell>
                                <TableCell className="w-10 text-right">
                                    <a href={`/repositories/${repository.id}`} title="Download">
                                        <Download size={18} className="text-blue-500" />
                                    </a>
                                </TableCell>

                                {can.update_repository && (
                                    <TableCell className="w-10 text-right">
                                        {can.update_repository && (
                                            <TextLink title="Edit" href={route('repositories.edit', repository.id)}>
                                                <Edit size={18} className="text-green-500" />
                                            </TextLink>
                                        )}
                                    </TableCell>
                                )}

                                {can.delete_repository && (
                                    <TableCell title="Delete" className="w-10 cursor-pointer text-right">
                                        {can.delete_repository && (
                                            <ActionConfirm
                                                action={() => handleDeleteRepository(repository.id)}
                                                title={`Delete Repository ${repository.title}?`}
                                                description="This action will remove this repository from database. This action cannot be undone."
                                            >
                                                <Trash2 size={18} className="text-red-500" />
                                            </ActionConfirm>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
