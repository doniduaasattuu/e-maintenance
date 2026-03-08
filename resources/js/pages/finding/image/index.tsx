import EmptyIcon from '@/components/empty-icon';
import ImageForm from '@/components/forms/image-form';
import HeadingSmall from '@/components/heading-small';
import { ImageCarousel } from '@/components/image-carousel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { BreadcrumbItem, Equipment } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

interface EquipmentImageProps {
    equipment: {
        data: Equipment;
    };
}

export default function EquipmentImage({ equipment }: EquipmentImageProps) {
    const { can } = usePermissions();
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
            title: 'Images',
            href: route('equipments.show', equipment.data.id),
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
            route('images.equipment.store', {
                id: equipment.data.id,
                type: 'equipment',
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

            <EquipmentLayout equipment={equipment.data} className="md:max-w-6xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Image" description="Images of equipment uploaded by users." />
                        {can.delete_image && (equipment?.data?.images?.length ?? 0) > 0 && (
                            <Button
                                variant={'outline'}
                                onClick={() => {
                                    setCanDelete(!canDelete);
                                }}
                            >
                                <Edit />
                                {canDelete ? 'Done' : 'Manage'}
                            </Button>
                        )}
                    </div>

                    {equipment.data.images && equipment.data.images.length > 0 ? (
                        <ImageCarousel canDelete={canDelete} model={equipment.data} />
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
            </EquipmentLayout>
        </AppLayout>
    );
}
