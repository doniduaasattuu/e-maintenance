import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import LogoDisplay from './logo-display';

export default function AppLogo() {
    const page = usePage<SharedData>();
    const { name } = page.props;

    return (
        <>
            <LogoDisplay className="size-16" type="SINGLE" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{name}</span>
            </div>
        </>
    );
}
