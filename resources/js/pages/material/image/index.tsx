import EmptyIcon from '@/components/empty-icon';
import ImageForm from '@/components/forms/image-form';
import HeadingSmall from '@/components/heading-small';
import { ImageCarousel } from '@/components/image-carousel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import MaterialLayout from '@/layouts/material/layout';
import { BreadcrumbItem, Material } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

interface MaterialImageProps {
    material: {
        data: Material;
    };
}

export default function MaterialImage({ material }: MaterialImageProps) {
    const { can } = usePermissions();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Materials',
            href: route('materials.index'),
        },
        {
            title: material.data.code,
            href: route('materials.show', material.data.id),
        },
        {
            title: 'Images',
            href: route('materials.show', material.data.id),
        },
    ];

    // FILE UPLOAD

    type ImageForm = {
        image?: File | null;
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data, setData, post, errors, processing, progress, reset, recentlySuccessful } = useForm<ImageForm>({
        image: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(
            route('images.material.store', {
                id: material.data.id,
                type: 'material',
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    reset('image');
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            },
        );
    };

    // IMAGE MANAGEMENT

    const [canDelete, setCanDelete] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Image" />

            <MaterialLayout material={material.data} className="md:max-w-6xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Image" description="Images of material uploaded by users." />
                        {can.delete_image && (material?.data?.images?.length ?? 0) > 0 && (
                            <Button
                                variant={'outline'}
                                onClick={() => {
                                    setCanDelete(!canDelete);
                                }}
                            >
                                <Edit />
                                {canDelete ? 'Cancel' : 'Manage'}
                            </Button>
                        )}
                    </div>

                    {material.data.images && material.data.images.length > 0 ? (
                        <ImageCarousel canDelete={canDelete} model={material.data} />
                    ) : (
                        <EmptyIcon />
                    )}

                    <Separator />

                    {can.create_image && (
                        <ImageForm
                            submit={submit}
                            fileInputRef={fileInputRef}
                            processing={processing}
                            setData={setData}
                            progress={progress}
                            errors={errors}
                            data={data}
                            recentlySuccessful={recentlySuccessful}
                            className="max-w-xs"
                        />
                    )}
                </div>
            </MaterialLayout>
        </AppLayout>
    );
}
