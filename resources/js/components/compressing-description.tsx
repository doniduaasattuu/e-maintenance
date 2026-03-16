import { Loader2 } from 'lucide-react';

export default function CompressingDescription() {
    return (
        <div className="flex animate-pulse items-center gap-2 text-xs font-medium">
            <Loader2 className="h-3 w-3 animate-spin" />
            Optimizing your images...
        </div>
    );
}
