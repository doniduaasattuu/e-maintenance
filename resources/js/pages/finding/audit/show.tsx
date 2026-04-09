import { ActionConfirm } from '@/components/action-confirm';
import HeadingSmall from '@/components/heading-small';
import Lightbox from '@/components/light-box';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import truncateText from '@/lib/utils';
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
    HardHat,
    Info,
    Maximize2,
    ScanSearch,
    Timer,
    Trash2,
    TriangleAlert,
    User,
    UserPen,
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
        <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">{title}</span>
            <div className="flex gap-2">{children}</div>
        </div>
    );
};

const Ul = ({ children }: { children: React.ReactNode }) => {
    return <div className="grid grid-rows-5 gap-2 space-y-3 text-sm">{children}</div>;
};

export default function FindingShow({ finding }: FindingShowProps) {
    const strings = UI_STRINGS;
    const { can } = usePermissions();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.AUDIT?.plural ?? 'Audits',
            href: route('audits.index'),
        },
        {
            title: truncateText(finding.data.functionalLocation?.code ?? '', 20) ?? finding.data.id.toString(),
            href: route('audits.index', finding.data.id),
        },
    ];

    const [selectedImage, setSelectedImage] = useState<FindingImage | null>(null);
    const beforeImages = finding.data?.images?.filter((img) => img.category === 'before') || [];
    const afterImages = finding.data?.images?.filter((img) => img.category === 'after') || [];

    const handleDeleteFinding = (id: number) => {
        router.delete(route('audits.destroy', id));
    };

    const handleEditFinding = (id: number) => {
        router.get(route('audits.edit', id));
    };

    // const handleCloseFinding = (id: number) => {
    //     router.post(route('audits.close', id));
    // };

    const isClosed: boolean = finding.data.status?.name.toLocaleLowerCase() == 'closed';
    const isInProgress: boolean = finding.data.status?.name.toLocaleLowerCase() == 'in progress';
    const isInReview: boolean = finding.data.status?.name.toLocaleLowerCase() == 'review';

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
                                <CardDescription>
                                    <div className="mt-2 grid grid-cols-1 gap-2 space-y-2 sm:grid-cols-2 sm:space-y-0">
                                        <div>
                                            <span className="text-xs font-light text-gray-500">Description:</span>
                                            <br />
                                            {finding.data.description ?? '-'}
                                        </div>
                                        <div>
                                            <span className="text-xs font-light text-gray-500">Rectification Action:</span>
                                            <br />
                                            {finding.data.rectification_action ?? '-'}
                                        </div>
                                    </div>
                                </CardDescription>
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
                                            <UserPen className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.inspector?.name ?? '-'}</span>
                                        </Li>
                                        <Li title="Issued Date">
                                            <Calendar className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.created_at ?? '-'}</span>
                                        </Li>
                                        <Li title="Action by">
                                            <HardHat className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.rectifier?.name ?? '-'}</span>
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
                                            ) : isInProgress ? (
                                                <Timer className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            ) : isInReview ? (
                                                <ScanSearch className="text-muted-foreground mt-0.5 size-4 shrink-0" />
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
                                        <Li title="Closed Date">
                                            <CalendarCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                            <span>{finding.data.closed_at ?? '-'}</span>
                                        </Li>
                                    </Ul>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                                {can.edit_audit && (
                                    <Button onClick={() => handleEditFinding(finding.data.id)} variant="outline" size="sm" className="w-full">
                                        <Edit className="size-4" /> Edit
                                    </Button>
                                )}
                                {/* {can.close_audit && (
                                    <Button onClick={() => handleCloseFinding(finding.data.id)} variant="outline" size="sm" className="w-full">
                                        <CheckSquare className="size-4" /> Mark as Closed
                                    </Button>
                                )} */}
                                {can.delete_audit && (
                                    <ActionConfirm
                                        action={() => handleDeleteFinding(finding.data.id)}
                                        title={`Delete finding of ${finding.data.functionalLocation?.description}?`}
                                        description="This action will remove this finding from database. This action cannot be undone."
                                    >
                                        <Button size="sm" className="w-full bg-red-600 text-red-100 hover:bg-red-500 hover:text-white">
                                            <Trash2 className="size-4" /> Delete
                                        </Button>
                                    </ActionConfirm>
                                )}
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
