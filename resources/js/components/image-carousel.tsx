import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Equipment, FunctionalLocation, Image, Material } from '@/types';
import { router } from '@inertiajs/react';
import { ImageOff, Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import { ActionConfirm } from './action-confirm';
import Lightbox from './light-box';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ImageCarouselProps {
    model: FunctionalLocation | Equipment | Material;
    canDelete: boolean;
}

export function ImageCarousel({ model, canDelete }: ImageCarouselProps) {
    const images = model.images;

    const handleDeleteImage = (imageId: number) => {
        router.delete(route('images.destroy', imageId));
    };

    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    function ImageWithFallback({ src }: { src: string }) {
        const [error, setError] = useState(false);

        if (error) {
            return (
                <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-4">
                    <ImageOff className="mb-2 size-8 opacity-20" />
                    <span className="text-xs font-medium tracking-wider uppercase opacity-50">Image Not Found</span>
                </div>
            );
        }

        return (
            <img
                src={src}
                onError={() => setError(true)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
        );
    }

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {images &&
                    images.map((image, index) => (
                        <CarouselItem key={`${image.id}-${index}`} className="relative sm:basis-1/2 md:basis-1/3">
                            {canDelete && (
                                <div className="absolute top-3 right-3 z-10">
                                    <ActionConfirm
                                        action={() => handleDeleteImage(image.id)}
                                        title={`Delete this image?`}
                                        description="This action will remove the image permanently. This action can't be undone."
                                    >
                                        <Button variant="destructive" size={'icon'}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <X />
                                                </TooltipTrigger>
                                                <TooltipContent>Delete image</TooltipContent>
                                            </Tooltip>
                                        </Button>
                                    </ActionConfirm>
                                </div>
                            )}
                            <Card className="p-0" onClick={() => setSelectedImage(image)}>
                                <CardContent className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-white/10">
                                    <span className="absolute top-2 left-2 z-10 text-sm">{`${images.length - index} of ${images.length}`}</span>
                                    <ImageWithFallback src={image.url} />

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Maximize2 className="size-4 text-white" />
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
            </CarouselContent>

            {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </Carousel>
    );
}
