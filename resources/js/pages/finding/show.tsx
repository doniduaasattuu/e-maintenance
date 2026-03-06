import { ActionConfirm } from '@/components/action-confirm';
import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import AppLayout from '@/layouts/app-layout';
import { cfl } from '@/lib/utils';
import { BreadcrumbItem, Finding, FindingImage } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Box,
    BuildingIcon,
    Calendar,
    CalendarCheck,
    CalendarClock,
    CalendarFold,
    CheckSquare,
    Edit,
    Info,
    Maximize2,
    RedoDot,
    Tag,
    Trash2,
    TriangleAlert,
    User,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface FindingShowProps {
    finding: {
        data: Finding;
    };
}

interface LiProps {
    title: string;
    children: React.ReactNode;
}

const Lightbox = ({ image, onClose }: { image: FindingImage; onClose: () => void }) => (
    <div
        className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-200"
        onClick={onClose}
    >
        <button className="absolute top-6 right-6 text-white transition-colors hover:text-red-400">
            <X size={32} />
        </button>
        <img
            src={image.url}
            alt={image.original_name}
            className="animate-in zoom-in-95 max-h-full max-w-full rounded-lg object-contain shadow-2xl duration-300"
        />
        <div className="absolute bottom-8 rounded-full bg-black/40 px-4 py-2 text-sm text-white/70">{cfl(image.category)}</div>
    </div>
);

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

const Li = ({ title, children }: LiProps) => {
    return (
        <li className="flex flex-col gap-1">
            <span className="text-muted-foreground">{title}</span>
            <div className="flex gap-2">{children}</div>
        </li>
    );
};

const Ul = ({ children }: { children: React.ReactNode }) => {
    return <ul className="grid gap-2 space-y-3 py-2 text-sm">{children}</ul>;
};

export default function FindingShow({ finding }: FindingShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Findings',
            href: route('findings.index'),
        },
        {
            title: finding.data.functionalLocation?.description ?? finding.data.id.toString(),
            href: route('findings.index', finding.data.id),
        },
    ];

    const [selectedImage, setSelectedImage] = useState<FindingImage | null>(null);
    const beforeImages = finding.data?.images?.filter((img) => img.category === 'before') || [];
    const afterImages = finding.data?.images?.filter((img) => img.category === 'after') || [];

    const handleDeleteFinding = (id: number) => {
        router.delete(route('findings.destroy', id));
    };

    const handleEditFinding = (id: number) => {
        router.get(route('findings.edit', id));
    };

    const isClosed: boolean = finding.data.status?.name.toLocaleLowerCase() == 'closed';
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
                        <Card className="mx-auto w-full">
                            <CardHeader>
                                <CardTitle className="text-md">{finding.data.functionalLocation?.description ?? 'Location'}</CardTitle>
                                <CardDescription>{finding.data.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2">
                                    <Ul>
                                        <Li title="Priority">
                                            <AlertCircle
                                                color={finding.data.priority?.color_code}
                                                className="text-muted-foreground mt-0.5 size-4 shrink-0"
                                            />
                                            <span>{finding.data.priority?.label ?? '-'}</span>
                                        </Li>
                                        <Li title="Inspector">
                                            <User className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.inspector?.name ?? '-'}</span>
                                        </Li>
                                        <Li title="Issued Date">
                                            <Calendar className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.created_at ?? '-'}</span>
                                        </Li>
                                        <Li title="Is Overdue">
                                            <RedoDot className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.is_overdue ? 'True' : 'False'}</span>
                                        </Li>
                                        <Li title="Notification">
                                            <Tag className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.notification ?? '-'}</span>
                                        </Li>
                                        <Li title="Department">
                                            <BuildingIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.department?.name ?? '-'}</span>
                                        </Li>
                                    </Ul>
                                    <Ul>
                                        <Li title="Status">
                                            {isClosed ? (
                                                <CheckSquare className="mt-0.5 size-4 shrink-0 text-green-400" />
                                            ) : (
                                                <TriangleAlert className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            )}

                                            <span className={isClosed ? 'text-green-400' : undefined}>{finding.data.status?.name ?? '-'}</span>
                                        </Li>
                                        <Li title="Verifier">
                                            <User className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.verifier?.name ?? '-'}</span>
                                        </Li>
                                        <Li title="Due Date">
                                            <CalendarClock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.due_date ?? '-'}</span>
                                        </Li>
                                        <Li title="Deadline">
                                            <CalendarFold className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.due_date_readable ?? '-'} </span>
                                        </Li>
                                        <Li title="Equipment">
                                            <Box className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.equipment?.code ?? '-'}</span>
                                        </Li>
                                        <Li title="Closed Date">
                                            <CalendarCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.closed_at ?? '-'}</span>
                                        </Li>
                                    </Ul>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                                <Button onClick={() => handleEditFinding(finding.data.id)} variant="outline" size="sm" className="w-full">
                                    <Edit className="size-4" /> Edit
                                </Button>
                                <ActionConfirm
                                    action={() => handleDeleteFinding(finding.data.id)}
                                    title={`Delete finding of ${finding.data.functionalLocation?.description}?`}
                                    description="This action will remove this finding from database. This action cannot be undone."
                                >
                                    <Button variant="destructive" size="sm" className="w-full">
                                        <Trash2 className="size-4" /> Delete
                                    </Button>
                                </ActionConfirm>
                            </CardFooter>
                        </Card>
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
