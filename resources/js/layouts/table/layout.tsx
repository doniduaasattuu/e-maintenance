import Heading from '@/components/heading';

interface TableLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode | undefined;
}

export default function TableLayout({ title, description, children }: TableLayoutProps) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <Heading title={title} description={description} />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <div className="flex-1 space-y-2 md:max-w-2xl">{children}</div>
            </div>
        </div>
    );
}
