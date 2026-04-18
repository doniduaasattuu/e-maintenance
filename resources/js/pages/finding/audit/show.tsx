import CardFindingDetail from '@/components/card-finding-detail';
import HeadingSmall from '@/components/heading-small';
import Lightbox from '@/components/light-box';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import truncateText from '@/lib/utils';
import { BreadcrumbItem, Finding, FindingImage } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Info, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface FindingShowProps {
    finding: {
        data: Finding;
    };
    type: 'AUD' | 'ABN';
}

const PhotoGrid = ({ title, images, onSelect }: { title: string; images: FindingImage[]; onSelect: (img: FindingImage) => void }) => (
    <div className="space-y-3">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {images.map((img) => (
                <div
                    key={img.id}
                    className="group bg-muted relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-white/10"
                    onClick={() => onSelect(img)}
                >
                    <img src={img.url} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Maximize2 className="size-4 text-white" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function FindingShow({ finding, type }: FindingShowProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.AUDIT?.plural ?? 'Audits',
            href: route('audits.index'),
        },
        {
            title: truncateText(finding.data.functionalLocation?.description ?? 'N/A', 20) ?? finding.data.id.toString(),
            href: route('audits.index', finding.data.id),
        },
    ];

    const [selectedImage, setSelectedImage] = useState<FindingImage | null>(null);
    const beforeImages = finding.data?.images?.filter((img) => img.category === 'before') || [];
    const afterImages = finding.data?.images?.filter((img) => img.category === 'after') || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Details" />

            <div className="flex flex-1 flex-col space-y-6 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <HeadingSmall title="Details" description="Finding data and information." />
                </div>

                <div className="grid max-w-7xl grid-cols-1 gap-8 space-y-6 rounded-xl lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-7 xl:col-span-6">
                        <Field>
                            <Alert>
                                <Info />
                                <AlertTitle>{finding.data.clause?.code ?? 'Clause code'}</AlertTitle>
                                <AlertDescription>{finding.data.clause?.description ?? 'Clause description'}</AlertDescription>
                            </Alert>
                        </Field>

                        <CardFindingDetail finding={finding} type={type} />
                    </div>

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
