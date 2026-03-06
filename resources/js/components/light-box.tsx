import { cfl } from '@/lib/utils';
import { FindingImage, Image } from '@/types';
import { X } from 'lucide-react';

interface LightboxProps {
    onClose: () => void;
    image: FindingImage | Image;
}

export default function Lightbox({ onClose, image }: LightboxProps) {
    function isFindingImage(image: FindingImage | Image): image is FindingImage {
        return (image as FindingImage).finding_id !== undefined;
    }

    return (
        <div
            className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-200"
            onClick={onClose}
        >
            <button className="absolute top-6 right-6 text-white transition-colors hover:text-red-400">
                <X size={32} />
            </button>
            <img
                src={image.url}
                alt={!isFindingImage(image) ? 'true' : image.original_name}
                className="animate-in zoom-in-95 max-h-full max-w-full rounded-lg object-contain shadow-2xl duration-300"
            />
            {isFindingImage(image) && (
                <div className="absolute bottom-8 rounded-full bg-black/40 px-4 py-2 text-sm text-white/70">{cfl(image.category)}</div>
            )}
        </div>
    );
}
