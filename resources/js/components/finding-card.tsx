import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Finding } from '@/types';
import { AlertCircle, Box, Calendar, MapPin, User } from 'lucide-react';
import { Badge } from './ui/badge';

interface FindingCardProps {
    finding: Finding;
    onClick?: (findingId: number) => void;
}

export function FindingCard({ finding, onClick }: FindingCardProps) {
    const firstBeforeImage = finding.images?.find((img) => img.category === 'before');
    const coverImageUrl = firstBeforeImage?.url || '/images/placeholder-finding.jpg';

    return (
        <Card className="relative mx-auto w-full p-0">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                    onClick={() => onClick?.(finding.id)}
                    src={coverImageUrl}
                    alt={finding.description}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <CardHeader className="p-4">
                <CardTitle className="text-md mb-3 flex justify-between gap-2">
                    <div className="font-medium tracking-wide">{finding.equipment?.code ?? finding.functionalLocation?.description}</div>
                    <Badge variant={'outline'} className="">
                        {finding.status?.name}
                    </Badge>
                </CardTitle>
                <CardDescription>{finding.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <AlertCircle color={finding.priority?.color_code} className="h-4 w-4" />
                        <span className="truncate text-xs">{finding.priority?.label}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="max-w-50 truncate text-xs">{finding.functionalLocation?.description}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                        <Box className="h-4 w-4" />
                        <span className="truncate text-xs">{finding.equipment?.code}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="text-muted-foreground flex items-center justify-between p-4 pt-0 text-xs">
                <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>By: {finding.inspector?.name}</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{finding.created_at}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
