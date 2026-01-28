import HeadingSmall from '@/components/heading-small';
import { QRCodeGenerator } from '@/components/qr-generator';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import MaterialLayout from '@/layouts/material/layout';
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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Materials',
            href: route('materials.index'),
        },
        {
            title: material.data.code,
            href: route('materials.show', material.data.id),
        },
    ];

    const can = usePermissions();
    const [isQROpen, setIsQROpen] = React.useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Details" />

            <QRCodeGenerator modelName="material" model={material.data} isQROpen={isQROpen} setIsQROpen={setIsQROpen} />

            <MaterialLayout material={material.data} className="max-w-2xl">
                <div className="w-full max-w-xl space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall title="Details" description="Material data and information." />
                        {can.edit_material && (
                            <TextLink className="text-sm" href={route('materials.edit', material.data.id)}>
                                Edit
                            </TextLink>
                        )}
                    </div>
                    <div className="max-w-2xl space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <div className="mt-1 flex justify-between gap-2">
                                <Input readOnly id="code" value={material.data.code} />
                                <Button title="Show QR Code" variant="outline" onClick={() => setIsQROpen(true)}>
                                    <QrCodeIcon />
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input readOnly className="mt-1" id="name" value={material.data.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input readOnly className="mt-1" id="price" value={material.data.price ?? ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="unit_id">Unit</Label>
                            <Input readOnly className="mt-1" id="unit_id" value={material.data.unit ? material.data.unit?.name : ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type_id">Type</Label>
                            <Input
                                readOnly
                                className="mt-1"
                                id="type_id"
                                value={material.data.materialType ? material.data.materialType?.code : ''}
                            />
                        </div>
                    </div>
                </div>
            </MaterialLayout>
        </AppLayout>
    );
}
