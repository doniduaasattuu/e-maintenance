export default function LogoDisplay({ type, className }: { type?: 'SINGLE' | 'DOUBLE'; className?: string }) {
    const displayType = type || import.meta.env.VITE_APP_LOGO_TYPE || 'SINGLE';

    if (displayType === 'DOUBLE') {
        return (
            <div className="flex items-center justify-center gap-4">
                <img className={className} src={import.meta.env.VITE_APP_LOGO_PATH_1} alt="Logo 1" />
                <img className={className} src={import.meta.env.VITE_APP_LOGO_PATH_2} alt="Logo 2" />
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <img className={className} src={import.meta.env.VITE_APP_LOGO_PATH_1} alt="Logo 1" />
        </div>
    );
}
