import EmptyIcon from '@/components/empty-icon';
import FindingImageForm from '@/components/finding-image-form';
import FindingImageManagement from '@/components/finding-image-management';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import FindingEditLayout from '@/layouts/finding/edit/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Finding } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    finding: {
        data: Finding;
    };
    type: 'ABN' | 'AUD';
}

export default function FindingImageEdit({ finding, type }: Props) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: type == 'ABN' ? (strings.ABNORMALITY?.plural ?? 'Abnormalities') : (strings.AUDIT?.plural ?? 'Audits'),
            href: type == 'ABN' ? route('abnormalities.index') : route('audits.index'),
        },
        {
            title: 'Current',
            href: type == 'ABN' ? route('abnormalities.show', finding.data.id) : route('audits.show', finding.data.id),
        },
        {
            title: 'Edit',
            href: type == 'ABN' ? route('abnormalities.index') : route('audits.index'),
        },
    ];

    const before = finding?.data?.gallery?.before;
    const after = finding?.data?.gallery?.after;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <FindingEditLayout
                finding={finding.data}
                mode="edit"
                moduleKey={type == 'ABN' ? 'ABNORMALITY' : 'AUDIT'}
                type={type}
                className="space-y-6"
            >
                <Tabs defaultValue="before" className="w-full max-w-6xl">
                    <TabsList>
                        <TabsTrigger value="before">Before</TabsTrigger>
                        <TabsTrigger value="after">After</TabsTrigger>
                    </TabsList>
                    <TabsContent value="before" className="w-full space-y-4">
                        {before && before?.length > 0 ? <FindingImageManagement finding={finding.data} images={before} /> : <EmptyIcon />}

                        {before && before?.length <= 4 && (
                            <>
                                <Separator />
                                <FindingImageForm category="before" finding={finding.data} className="max-w-xs" />
                            </>
                        )}
                    </TabsContent>
                    <TabsContent value="after" className="w-full space-y-4">
                        {after && after?.length > 0 ? <FindingImageManagement finding={finding.data} images={after} /> : <EmptyIcon />}
                        {after && after?.length <= 4 && (
                            <>
                                <Separator />
                                <FindingImageForm category="after" finding={finding.data} className="max-w-xs" />
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </FindingEditLayout>
        </AppLayout>
    );
}
