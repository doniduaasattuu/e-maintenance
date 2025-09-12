import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';

type ImageDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    src?: string;
};

export function ImageDialog({ open, setOpen, src }: ImageDialogProps) {
    const [orientation, setOrientation] = useState<'landscape' | 'portrait' | null>(null);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.naturalWidth > img.naturalHeight) {
            setOrientation('landscape');
        } else {
            setOrientation('portrait');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="hidden" />
            {/* <DialogContent className={`max-h-screen border-1 p-0 ${orientation === 'landscape' ? 'min-w-[50%]' : null}`}> */}
            <DialogContent className={cn('max-h-screen border-1 p-0', { 'min-w-[50%]': orientation === 'landscape' })}>
                <img onLoad={handleLoad} className="h-full w-full rounded-md object-cover" src={src} />
            </DialogContent>
        </Dialog>
    );
}
