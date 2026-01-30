import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Equipment, Material } from '@/types';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { ActionConfirm } from './action-confirm';
import { ImageDialog } from './image-dialog';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ImageCarouselProps {
    model: Equipment | Material;
    canDelete: boolean;
}

export function ImageCarousel({ model, canDelete }: ImageCarouselProps) {
    const images = model.images;
    const length = images?.length ?? 0;
    const [open, setOpen] = useState<boolean>(false);
    const [src, setSrc] = useState<string>();
    const handleDeleteImage = (imageId: number) => {
        router.delete(route('images.destroy', imageId));
    };

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
                            <Card
                                className="p-0"
                                onClick={() => {
                                    setOpen(true);
                                    setSrc(image.url);
                                }}
                            >
                                <CardContent
                                    className={cn('relative aspect-square w-full overflow-hidden rounded-md p-0', { 'opacity-70': canDelete })}
                                >
                                    <span className="absolute top-0 left-3 z-10 py-2 text-center text-sm text-white">{`${length - index} of ${length}`}</span>
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover"
                                        src={image.url}
                                        alt={`${model.code} - ${image.id}`}
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
            </CarouselContent>

            <ImageDialog open={open} setOpen={setOpen} src={src} />
        </Carousel>
    );
}
