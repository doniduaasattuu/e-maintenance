import { ChartBarDefault } from '@/components/chart-bar-default';
import DashboardCard from '@/components/dashboard-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Clock, LayoutGrid } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

interface DashboardProps {
    stats: {
        total: {
            value: number;
            desc: string;
            trend: string;
        };
        open: {
            value: number;
            desc: string;
            status: string;
        };
        closed: {
            value: number;
            desc: string;
            status: string;
        };
        slaExceeded: {
            value: number;
            desc: string;
        };
    };
    chartClosedFindingDepartment: {
        code: string;
        totalClosedFindings: number;
    }[];
    chartClosedFindingWorkCenter: {
        code: string;
        totalClosedFindings: number;
    }[];
    topInspectors: {
        name: string;
        totalSolved: number;
    }[];
    topResolvers: {
        name: string;
        totalSolved: number;
    }[];
}

export default function Dashboard({
    stats,
    chartClosedFindingDepartment,
    chartClosedFindingWorkCenter,
    topInspectors,
    topResolvers,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <DashboardCard title="Total Findings" description={stats.total.desc} value={stats.total.value}>
                            <LayoutGrid className="h-5 w-5 text-blue-400" />
                        </DashboardCard>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <DashboardCard title="Open Findings" description={stats.open.desc} value={stats.open.value}>
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </DashboardCard>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <DashboardCard title="Closed Findings" description={stats.closed.desc} value={stats.closed.value}>
                            <CheckCircle className="h-5 w-5 text-green-400" />
                        </DashboardCard>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <DashboardCard title="SLA Exceeded" description={stats.slaExceeded.desc} value={stats.slaExceeded.value}>
                            <Clock className="h-5 w-5 text-red-400" />
                        </DashboardCard>
                    </div>
                </div>
                <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartBarDefault
                        title="Closed Findings Achievement"
                        description="Distribusi temuan selesai per departemen"
                        chartData={chartClosedFindingDepartment}
                        labelKey="code"
                        valueKey="totalClosedFindings"
                    />
                    <ChartBarDefault
                        title="Top 10 Inspector"
                        description="User yang paling aktif membuat temuan"
                        chartData={topInspectors}
                        labelKey="name"
                        valueKey="totalSolved"
                    />
                </div>
                <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartBarDefault
                        title="Closed Findings Achievement"
                        description="Distribusi temuan selesai per work center"
                        chartData={chartClosedFindingWorkCenter}
                        labelKey="code"
                        valueKey="totalClosedFindings"
                    />
                    <ChartBarDefault
                        title="Top 10 Resolvers"
                        description="User yang paling aktif menutup temuan"
                        chartData={topResolvers}
                        labelKey="name"
                        valueKey="totalSolved"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
