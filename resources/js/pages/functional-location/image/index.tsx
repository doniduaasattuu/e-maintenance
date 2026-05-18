import EmptyIcon from '@/components/empty-icon';
import ImageForm from '@/components/forms/image-form';
import HeadingSmall from '@/components/heading-small';
import { ImageCarousel } from '@/components/image-carousel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import FunctionalLocationLayout from '@/layouts/functional-location/layout';
import { BreadcrumbItem, FunctionalLocation } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

interface FunctionalLocationImageProps {
    functionalLocation: {
        data: FunctionalLocation;
    };
}

export default function FunctionalLocationImage({ functionalLocation }: FunctionalLocationImageProps) {
    const { can } = usePermissions();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Functional Locations',
            href: route('functional-locations.index'),
        },
        {
            title: functionalLocation.data.code,
            href: route('functional-locations.show', functionalLocation.data.id),
        },
        {
            title: 'Images',
            href: route('functional-locations.show', functionalLocation.data.id),
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
            route('images.functional-location.store', {
                id: functionalLocation.data.id,
                type: 'functional-location',
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

            <FunctionalLocationLayout functionalLocation={functionalLocation.data} className="w-full max-w-6xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Image" description="Images of the actual physical objects functional location." />
                        {can.delete_image && (functionalLocation?.data?.images?.length ?? 0) > 0 && (
                            <Button
                                size={'sm'}
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

                    {functionalLocation.data.images && functionalLocation.data.images.length > 0 ? (
                        <ImageCarousel canDelete={canDelete} model={functionalLocation.data} />
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
            </FunctionalLocationLayout>
        </AppLayout>
    );
}
