import HeadingSmall from '@/components/heading-small';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { BreadcrumbItem, Equipment } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

interface EquipmentImageEditProps {
    equipment: {
        data: Equipment;
    };
}

export default function EquipmentImageEdit({ equipment }: EquipmentImageEditProps) {
    const can = usePermissions();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: equipment.data.code,
            href: `/equipments/${equipment.data.id}`,
        },
        {
            title: 'Image',
            href: `/equipments/${equipment.data.id}/image`,
        },
    ];

    // FILE UPLOAD

    type ManageImageForm = {
        image?: File | null;
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data, setData, post, errors, processing, progress, reset, recentlySuccessful } = useForm<ManageImageForm>({
        image: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('equipment-image.store', equipment.data.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('image');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Image" />

            <EquipmentLayout equipment={equipment.data} width="md:max-w-6xl">
                <div className="space-y-6">
                    <HeadingSmall title="Image" description="Manage images." />
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
