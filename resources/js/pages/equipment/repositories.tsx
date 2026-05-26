import HeadingSmall from '@/components/heading-small';
import TableRepository from '@/components/tables/table-repository';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, Meta, Repository } from '@/types';
import { Head } from '@inertiajs/react';

interface EquipmentRepositoriesProps {
    equipment: {
        data: Equipment;
    };
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function EquipmentRepositories({ equipment, repositories, filters }: EquipmentRepositoriesProps) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={repoTitle} />

            <EquipmentLayout equipment={equipment.data} className="w-full max-w-xl space-y-4 lg:max-w-4xl">
                <HeadingSmall title={repoTitle} description="Technical records and operational manuals." />
                <TableRepository filters={filters} repositories={repositories} renderable={[]} extensions={[]} withHeader={false} />
            </EquipmentLayout>
        </AppLayout>
    );
}
