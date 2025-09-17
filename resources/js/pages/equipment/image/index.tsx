import ButtonSubmit from '@/components/button-submit';
import HeadingSmall from '@/components/heading-small';
import { ImageCarousel } from '@/components/image-carousel';
import InputDescription from '@/components/input-description';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
    const can = usePermissions();
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
            title: 'Image',
            href: route('equipments.image', equipment.data.id),
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

        post(route('equipment-image.store', equipment.data.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('image');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    // IMAGE MANAGEMENT

    const [canDelete, setCanDelete] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Image" />

            <EquipmentLayout equipment={equipment.data} width="md:max-w-6xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Image" description="Images of equipment uploaded by users." />
                        {can.delete_equipmentimage && (
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

                    {equipment.data.images && equipment.data.images.length > 0 && <ImageCarousel canDelete={canDelete} equipment={equipment.data} />}

                    <Separator />

                    {can.create_equipmentimage && (
                        <div>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid w-full gap-2 sm:max-w-xs">
                                    <Label htmlFor="image">Upload</Label>
                                    <Input
                                        className="mt-1"
                                        type="file"
                                        id="image"
                                        ref={fileInputRef}
                                        disabled={processing}
                                        onChange={(e) => {
                                            setData('image', e.target.files?.[0]);
                                        }}
                                        accept=".jpg,.jpeg,.png,.webp"
                                    />
                                    {progress && <Progress className="mt-1 h-1.5" value={progress.percentage} />}
                                    <InputError message={errors.image} />
                                    {data.image && data.image.size > 1 && (
                                        <InputDescription message={`File size: ${(data.image.size / 1024 / 1024).toFixed(2)} MB`} />
                                    )}
                                </div>
                                <ButtonSubmit
                                    disabled={processing || fileInputRef.current == null || data.image == null}
                                    showSuccessMessage={true}
                                    successMessage="Saved"
                                    recentlySuccessful={recentlySuccessful}
                                />
                            </form>
                        </div>
                    )}
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
