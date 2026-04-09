import HeadingSmall from '@/components/heading-small';
import TableRepository from '@/components/tables/table-repository';
import AppLayout from '@/layouts/app-layout';
import MaterialLayout from '@/layouts/material/layout';
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
}

export default function MaterialRepositories({ material, repositories }: MaterialRepositoriesProps) {
    const strings = UI_STRINGS;
    const repoTitle = strings.REPOSITORY?.label ?? 'Repository';
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={repoTitle} />

            <MaterialLayout material={material.data} className="w-full max-w-xl lg:max-w-4xl">
                <HeadingSmall title={repoTitle} description="Technical records and operational manuals." />
                <TableRepository repositories={repositories} renderable={[]} extensions={[]} withHeader={false} />
            </MaterialLayout>
        </AppLayout>
    );
}
