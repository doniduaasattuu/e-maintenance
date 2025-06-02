import { usePage } from '@inertiajs/react';

export default function usePermissions() {
    const { permissions } = usePage().props as unknown as { permissions: Record<string, boolean> };
    const can = permissions;
    return can;
}
