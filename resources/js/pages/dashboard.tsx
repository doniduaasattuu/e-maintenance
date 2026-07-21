import { ChartBarDefault } from '@/components/chart/chart-bar-default';
import { ChartBarStackedDefault } from '@/components/chart/chart-bar-stacked-default';
import { ChartPieDefault } from '@/components/chart/pie-chart-default';
import DashboardCard from '@/components/dashboard-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Clock, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

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
    topInspectorsWeekly: {
        name: string;
        totalSolved: number;
    }[];
    topResolvers: {
        name: string;
        totalSolved: number;
    }[];
    monthlyFinding: {
        chart: {
            month: string;
            closed: number;
            open: number;
            closing_rate: number;
        }[];
        series: {
            key: string;
            label: string;
            color: string;
        }[];
    };
    equipmentStatusChart: {
        status: string;
        value: number;
        fill: string;
    }[];
    availableMonths: {
        label: string;
        value: string;
    }[];
    selectedMonth: string;
    selectedWeek: string;
    chartWeeklyFindings: {
        week: string;
        total: number;
    }[];
    chartInspectorFindings: {
        inspector: string;
        week: number;
        total: number;
        fill: string;
    }[];
    priorityWeekly: {
        chart: {
            week: string;
            priority1: number;
            priority2: number;
            priority3: number;
        }[];
        series: {
            key: string;
            label: string;
            color: string;
        }[];
    };
    chartPriorityWeekly: {
        week: string;
        priority1: number;
        priority2: number;
        priority3: number;
    }[];
    prioritySeries: {
        key: string;
        label: string;
        color: string;
    }[];
    chartStatusWeekly: {
        week: string;
        open: number;
        inProgress: number;
        onHold: number;
        review: number;
        closed: number;
    }[];
    chartTopFindingAreas: {
        label: string;
        description: string;
        value: number;
        fill: string;
    }[];
    availableWeeks: {
        label: string;
        value: string;
    }[];
}

// const equipmentStatusConfig = {
//     INST: {
//         label: 'INST',
//         color: 'var(--chart-1)',
//     },
//     AVLB: {
//         label: 'AVLB',
//         color: 'var(--chart-2)',
//     },
//     RPRD: {
//         label: 'RPRD',
//         color: 'var(--chart-3)',
//     },
// } satisfies ChartConfig;

export default function Dashboard({
    stats,
    chartClosedFindingDepartment,
    chartClosedFindingWorkCenter,
    topInspectorsWeekly,
    topResolvers,
    monthlyFinding,
    // equipmentStatusChart,
    availableMonths,
    availableWeeks,
    selectedMonth,
    selectedWeek,
    priorityWeekly,
    chartWeeklyFindings,
    chartInspectorFindings,
    chartStatusWeekly,
    chartTopFindingAreas,
}: DashboardProps) {
    const [month, setMonth] = useState(selectedMonth);
    const [week, setWeek] = useState(selectedWeek);

    function refreshDashboard(filters: { month?: string; week?: string }) {
        const newMonth = filters.month ?? month;
        const newWeek = filters.week ?? week;

        setMonth(newMonth);
        setWeek(newWeek);

        router.get(
            route('dashboard'),
            {
                month: newMonth,
                week: newWeek,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }

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
                    <ChartBarStackedDefault
                        title="Monthly Finding"
                        description="Total temuan per bulan dalam satu tahun"
                        chartData={monthlyFinding.chart}
                        series={monthlyFinding.series}
                        xAxisKey="month"
                        labelDataKey="closing_rate"
                    />
                    <ChartPieDefault
                        withSelect={true}
                        selectedMonth={selectedMonth}
                        availableMonths={availableMonths}
                        title="Top 5 Finding Areas"
                        description="Distribusi finding berdasarkan area"
                        chartData={chartTopFindingAreas}
                        labelKey="label"
                        valueKey="value"
                        onSelectChange={(value) =>
                            refreshDashboard({
                                month: value,
                            })
                        }
                    />
                </div>

                <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartBarDefault
                        title="Weekly Finding"
                        description="Total temuan per minggu dalam satu bulan"
                        chartData={chartWeeklyFindings}
                        labelKey="week"
                        valueKey="value"
                        withSelect={true}
                        availableMonths={availableMonths}
                        selectedMonth={selectedMonth}
                        onSelectChange={(value) =>
                            refreshDashboard({
                                month: value,
                            })
                        }
                    />
                    <ChartBarStackedDefault
                        title="Weekly Priority"
                        description="Finding priority dalam satu minggu"
                        chartData={priorityWeekly['chart']}
                        series={priorityWeekly['series']}
                        withSelect={true}
                        availableMonths={availableMonths}
                        selectedMonth={selectedMonth}
                        onSelectChange={(value) =>
                            refreshDashboard({
                                month: value,
                            })
                        }
                    />
                </div>
                <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartBarStackedDefault
                        title="Weekly Finding Status"
                        description="Distribusi status finding per minggu"
                        chartData={chartStatusWeekly}
                        series={[
                            {
                                key: 'open',
                                label: 'Open',
                                color: 'var(--chart-1)',
                            },
                            {
                                key: 'inProgress',
                                label: 'In Progress',
                                color: 'var(--chart-5)',
                            },
                            {
                                key: 'onHold',
                                label: 'On Hold',
                                color: 'var(--chart-4)',
                            },
                            {
                                key: 'review',
                                label: 'Review',
                                color: 'var(--chart-2)',
                            },
                            {
                                key: 'closed',
                                label: 'Closed',
                                color: 'var(--chart-3)',
                            },
                        ]}
                        withSelect={true}
                        availableMonths={availableMonths}
                        selectedMonth={selectedMonth}
                        onSelectChange={(value) =>
                            refreshDashboard({
                                month: value,
                            })
                        }
                    />
                    <ChartBarDefault
                        labelKey="label"
                        valueKey="value"
                        chartData={chartInspectorFindings}
                        title="Inspector Weekly"
                        description="Total temuan inspector per minggu"
                        xAxisAngle={-45}
                        withSelect={true}
                        availableMonths={availableMonths}
                        selectedMonth={selectedMonth}
                        onSelectChange={(value) =>
                            refreshDashboard({
                                month: value,
                            })
                        }
                    />
                </div>

                <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartBarDefault
                        title="Top 10 Inspector Weekly"
                        description="User yang paling aktif membuat temuan setiap minggunya"
                        chartData={topInspectorsWeekly}
                        labelKey="name"
                        valueKey="totalFindings"
                        withSelect={true}
                        availableMonths={availableWeeks}
                        selectedMonth={selectedWeek}
                        onSelectChange={(value) =>
                            refreshDashboard({
                                week: value,
                            })
                        }
                    />
                    <ChartBarDefault
                        title="Top 10 Resolvers"
                        description="User dengan finding Closed terbanyak pada bulan terpilih"
                        chartData={topResolvers}
                        labelKey="name"
                        valueKey="totalSolved"
                        withSelect={true}
                        availableMonths={availableMonths}
                        selectedMonth={selectedMonth}
                        onSelectChange={(value) =>
                            refreshDashboard({
                                month: value,
                            })
                        }
                    />
                </div>
                <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartBarDefault
                        title="Closed Findings Achievement"
                        description="Distribusi temuan selesai per departemen sepanjang waktu"
                        chartData={chartClosedFindingDepartment}
                        labelKey="code"
                        valueKey="totalClosedFindings"
                    />{' '}
                    <ChartBarDefault
                        title="Closed Findings Achievement"
                        description="Distribusi temuan selesai per work center"
                        chartData={chartClosedFindingWorkCenter}
                        labelKey="code"
                        valueKey="totalClosedFindings"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
