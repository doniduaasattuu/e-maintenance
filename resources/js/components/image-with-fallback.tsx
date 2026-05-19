import { ImageOff } from 'lucide-react';
import { useState } from 'react';

export default function ImageWithFallback({ src }: { src: string }) {
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
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
    );
}
