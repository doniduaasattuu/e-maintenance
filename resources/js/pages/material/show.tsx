import HeadingSmall from '@/components/heading-small';
import { QRCodeGenerator } from '@/components/qr-generator';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import MaterialLayout from '@/layouts/material/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Material } from '@/types';
import { Head } from '@inertiajs/react';
import { QrCodeIcon } from 'lucide-react';
import React from 'react';

interface MaterialShowProps {
    material: {
        data: Material;
    };
}

export default function MaterialShow({ material }: MaterialShowProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.MATERIAL?.plural ?? 'Materials',
            href: route('materials.index'),
        },
        {
            title: material.data.code,
            href: route('materials.show', material.data.id),
        },
    ];

    const { can } = usePermissions();
    const [isQROpen, setIsQROpen] = React.useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Details" />

            <QRCodeGenerator modelName="material" model={material.data} isQROpen={isQROpen} setIsQROpen={setIsQROpen} />

            <MaterialLayout material={material.data} className="w-full max-w-xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Details" description="Material data and information." />
                        {can.edit_material && (
                            <TextLink className="text-sm" href={route('materials.edit', material.data.id)}>
                                Edit
                            </TextLink>
                        )}
                    </div>
                    <Field>
                        <FieldLabel htmlFor="code">Code</FieldLabel>
                        <div className="flex justify-between gap-2">
                            <Input readOnly id="code" value={material.data.code} />
                            <Button size={'sm'} title="Show QR Code" variant="outline" onClick={() => setIsQROpen(true)}>
                                <QrCodeIcon />
                            </Button>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input readOnly id="name" value={material.data.name} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="price">Price</FieldLabel>
                        <Input readOnly id="price" value={material.data.price ?? ''} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="unit_id">Unit</FieldLabel>
                        <Input readOnly id="unit_id" value={material.data.unit ? material.data.unit?.name : ''} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="type_id">Type</FieldLabel>
                        <Input
                            readOnly
                            id="type_id"
                            value={material.data.type ? `${material.data.type?.code} - ${material.data.type?.description}` : ''}
                        />
                    </Field>
                </div>
            </MaterialLayout>
        </AppLayout>
    );
}
