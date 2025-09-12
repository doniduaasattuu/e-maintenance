import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Equipment } from '@/types';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { ActionConfirm } from './action-confirm';
import { ImageDialog } from './image-dialog';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ImageCarouselProps {
    equipment: Equipment;
    canDelete: boolean;
}

export function ImageCarousel({ equipment, canDelete }: ImageCarouselProps) {
    const images = equipment.images;
    const [open, setOpen] = useState<boolean>(false);
    const [src, setSrc] = useState<string>();
    const handleDeleteImage = (equipmentId: number, imageId: number) => {
        router.delete(route('equipment-image.destroy', { equipment: equipmentId, image: imageId }));
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
                                        action={() => handleDeleteImage(equipment.id, image.id)}
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
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover"
                                        src={image.url}
                                        alt={`${equipment.code} - ${image.id}`}
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <ImageDialog open={open} setOpen={setOpen} src={src} />
        </Carousel>
    );
}
