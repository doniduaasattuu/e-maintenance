import EquipmentRepositoryDialog from '@/components/equipment-repository-dialog';
import HeadingSmall from '@/components/heading-small';
import TableRepository from '@/components/tables/table-repository';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, Meta, Repository } from '@/types';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';

interface EquipmentRepositoriesProps {
    equipment: {
        data: Equipment;
    };
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    renderable: string[];
    extensions?: string[];
    filters: {
        query: string;
        per_page: string;
    };
}

export default function EquipmentRepositories({ equipment, repositories, renderable, extensions, filters }: EquipmentRepositoriesProps) {
    const strings = UI_STRINGS;
    const repoTitle = strings.REPOSITORY?.label ?? 'Repository';
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.EQUIPMENT?.plural ?? 'Equipments',
            href: route('equipments.index'),
        },
        {
            title: equipment.data.code,
            href: route('equipments.show', equipment.data.id),
        },
        {
            title: 'Repositories',
            href: route('equipments.show', equipment.data.id),
        },
    ];

    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={repoTitle} />

            <EquipmentLayout equipment={equipment.data} className="w-full max-w-xl space-y-4 lg:max-w-6xl">
                <div className="flex justify-between gap-2">
                    <HeadingSmall title={repoTitle} description="Technical records and operational manuals." />
                    <Button
                        title="Add related documents"
                        size={'sm'}
                        variant={'outline'}
                        onClick={() => setOpen(!open)}
                        className="text-muted-foreground"
                    >
                        <Plus className="h-4 w-4" />
                        Attach
                    </Button>
                </div>
                <TableRepository
                    hiddenDelete={true}
                    filters={filters}
                    repositories={repositories}
                    renderable={renderable}
                    extensions={extensions}
                    withHeader={false}
                />
            </EquipmentLayout>

            <EquipmentRepositoryDialog equipment={equipment} repositories={repositories} open={open} setOpen={() => setOpen(false)} />
        </AppLayout>
    );
}
