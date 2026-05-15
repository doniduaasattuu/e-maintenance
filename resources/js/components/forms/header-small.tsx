import { Separator } from '../ui/separator';

export default function HeaderSmall({ title }: { title: string }) {
    return (
        <>
            <Separator className="mb-3" />
            <h3 className="text-muted-foreground mb-3 text-sm font-semibold">{title}</h3>
        </>
    );
}
