import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DashboardCardProps {
    value: number;
    description: string;
    title: string;
    children: ReactNode;
}

export default function DashboardCard({ value, description, title, children }: DashboardCardProps) {
    return (
        <Card className="bg-sidebar flex h-full flex-col space-y-3 lg:space-y-5 xl:space-y-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
                <div className="shrink-0">{children}</div>
            </CardHeader>
            <CardContent className="space-y-3 lg:space-y-5 xl:space-y-6">
                <div className="text-3xl font-bold sm:text-3xl md:text-4xl xl:text-5xl">{value}</div>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">{description}</p>
            </CardContent>
        </Card>
    );
}
