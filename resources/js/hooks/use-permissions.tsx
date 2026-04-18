import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function usePermissions() {
    const { auth } = usePage<SharedData>().props;

    const can = auth.permissions;

    const hasRole = (roleName: string) => {
        return auth.roles.includes(roleName);
    };

    const hasAnyRole = (roleNames: string[]) => {
        return roleNames.some((role) => auth.roles.includes(role));
    };

    return {
        user: auth.user,
        can,
        hasRole,
        hasAnyRole,
        roles: auth.roles,
    };
}

// export default function usePermissions() {
//     const { permissions } = usePage().props as unknown as { permissions: Record<string, boolean> };
//     const can = permissions;
//     return can;
// }
