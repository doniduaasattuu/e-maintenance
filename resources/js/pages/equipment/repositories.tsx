import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import RepositoryAssetLayout from '@/layouts/repository/asset/layout';
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
    extensions?: string[];
    renderable: string[];
}

export default function EquipmentRepositories({ equipment, repositories, renderable, extensions }: EquipmentRepositoriesProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
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

    function handleDownloadRepository(id: number) {
        window.open(route('repositories.show', id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Repositories" />

            <EquipmentLayout equipment={equipment.data} className="max-w-xl lg:max-w-3xl">
                <RepositoryAssetLayout
                    handleDownloadRepository={handleDownloadRepository}
                    renderable={renderable}
                    repositories={repositories}
                    extensions={extensions}
                    model="equipment"
                />
            </EquipmentLayout>
        </AppLayout>
    );
}
