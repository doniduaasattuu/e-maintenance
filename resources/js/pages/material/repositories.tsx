import AppLayout from '@/layouts/app-layout';
import MaterialLayout from '@/layouts/material/layout';
import RepositoryAssetLayout from '@/layouts/relational/table/repository';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Material, Meta, Repository } from '@/types';
import { Head } from '@inertiajs/react';

interface MaterialRepositoriesProps {
    material: {
        data: Material;
    };
    repositories: {
        data: Repository[];
        meta: Meta;
    };
    extensions?: string[];
    renderable: string[];
}

export default function MaterialRepositories({ material, repositories, renderable, extensions }: MaterialRepositoriesProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.MATERIAL?.plural ?? 'Materials',
            href: route('materials.index'),
        },
        {
            title: material.data.code,
            href: route('materials.show', material.data.id),
        },
        {
            title: 'Repositories',
            href: route('materials.show', material.data.id),
        },
    ];

    function handleDownloadRepository(id: number) {
        window.open(route('repositories.show', id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Repositories" />

            <MaterialLayout material={material.data} className="max-w-xl lg:max-w-3xl">
                <RepositoryAssetLayout
                    handleDownloadRepository={handleDownloadRepository}
                    renderable={renderable}
                    repositories={repositories}
                    extensions={extensions}
                    model="material"
                />
            </MaterialLayout>
        </AppLayout>
    );
}
