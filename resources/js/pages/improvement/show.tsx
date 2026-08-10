import CardImprovementDetail from '@/components/card-improvement-details';
import HeadingSmall from '@/components/heading-small';
import Lightbox from '@/components/light-box';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Improvement, ImprovementImage } from '@/types';
import { Head } from '@inertiajs/react';
import { Box } from 'lucide-react';
import { useState } from 'react';

interface ImprovementShowProps {
    improvement: {
        data: Improvement;
    };
}

const PhotoGrid = ({ title, images, onSelect }: { title: string; images: ImprovementImage[]; onSelect: (image: ImprovementImage) => void }) => (
    <div className="space-y-3">
        <h3 className="text-sm font-semibold">{title}</h3>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="group bg-muted relative aspect-video cursor-pointer overflow-hidden rounded-lg border"
                    onClick={() => onSelect(image)}
                >
                    <img
                        src={image.url}
                        alt={image.original_name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                </div>
            ))}
        </div>
    </div>
);

export default function ImprovementShow({ improvement }: ImprovementShowProps) {
    const strings = UI_STRINGS;
    const data = improvement.data;

    const [selectedImage, setSelectedImage] = useState<ImprovementImage | null>(null);

    const beforeImages = data.images?.filter((image) => image.category === 'before') ?? [];

    const afterImages = data.images?.filter((image) => image.category === 'after') ?? [];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.IMPROVEMENT?.plural ?? 'Improvements',
            href: route('improvements.index'),
        },
        {
            title: data.code,
            href: route('improvements.show', data.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${data.code} - Improvement`} />

            <div className="flex flex-1 flex-col space-y-6 rounded-xl p-4">
                <HeadingSmall title="Details" description="Improvement data and information." />

                <div className="grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Details */}
                    <div className="space-y-6 lg:col-span-7 xl:col-span-6">
                        <CardImprovementDetail improvement={improvement} />
                    </div>

                    {/* Evidence */}
                    <div className="min-h-0 space-y-6 lg:col-span-5 xl:col-span-6">
                        {beforeImages.length > 0 && <PhotoGrid title="Before Photos" images={beforeImages} onSelect={setSelectedImage} />}

                        {afterImages.length > 0 && <PhotoGrid title="After Photos" images={afterImages} onSelect={setSelectedImage} />}

                        {beforeImages.length === 0 && afterImages.length === 0 && (
                            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20">
                                <Box className="mb-2 size-10 opacity-20" />
                                <p className="text-xs">No evidence photos uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </AppLayout>
    );
}
