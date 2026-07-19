<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Finding;
use App\Models\FindingStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // STATS
        {
            // 1. Total Findings
            $totalFindings = Finding::count();
            $open = FindingStatus::where('name', 'Open')->first();
            $closed = FindingStatus::where('name', 'Closed')->first();

            // 2. Open Findings (Belum ditutup)
            $openFindings = Finding::where('finding_status_id', $open->id)->count();

            // 3. Closed Findings (Sudah ditutup)
            $closedFindings = Finding::where('finding_status_id', $closed->id)->count();

            // 4. Logika Perbandingan (Contoh: Dibandingkan dengan bulan lalu)
            $lastMonth = Finding::where('created_at', '<', Carbon::now()->subMonth())->count();
            $diff = $totalFindings - $lastMonth;

            $slaExceeded = Finding::whereNull('closed_at')
                ->with('priority')
                ->get()
                ->filter(function ($finding) {
                    $deadline = \Illuminate\Support\Carbon::parse($finding->created_at)
                        ->addHours($finding->priority->sla_resolution_hours);
                    return $deadline->isPast();
                })
                ->count();
        }

        // MONTHLY FINDINGS
        {
            $monthlyFindings = Finding::query()
                ->leftJoin(
                    'finding_statuses',
                    'findings.finding_status_id',
                    '=',
                    'finding_statuses.id'
                )
                ->selectRaw("
        YEAR(findings.created_at) as year,
        MONTH(findings.created_at) as month,

        SUM(CASE
            WHEN finding_statuses.name = 'Closed'
            THEN 1 ELSE 0
        END) as closed,

        SUM(CASE
            WHEN finding_statuses.name <> 'Closed'
            THEN 1 ELSE 0
        END) as open
    ")
                ->where(
                    'findings.created_at',
                    '>=',
                    now()->subMonths(11)->startOfMonth()
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            $chartMonthlyFindings = collect();

            $date = Carbon::create(
                now()->year,
                now()->month,
                1
            );

            for ($i = 11; $i >= 0; $i--) {

                $d = $date
                    ->copy()
                    ->subMonthsNoOverflow($i);

                $row = $monthlyFindings->first(function ($item) use ($d) {
                    return $item->year == $d->year
                        && $item->month == $d->month;
                });

                $open = (int) ($row?->open ?? 0);
                $closed = (int) ($row?->closed ?? 0);

                $chartMonthlyFindings->push([
                    'month' => $d->format('M'),
                    'closed' => (int) ($row->closed ?? 0),
                    'open' => (int) ($row->open ?? 0),
                    'closing_rate' => ($open + $closed) > 0
                        ? round(($closed / ($open + $closed)) * 100)
                        : 0,
                ]);
            }

            $seriesMonthlyFindings = [
                [
                    'key' => 'closed',
                    'label' => 'Closed',
                    'color' => 'var(--chart-2)',
                ],
                [
                    'key' => 'open',
                    'label' => 'Open',
                    'color' => 'var(--chart-5)',
                ],
            ];
        }

        $equipmentStatusChart = Equipment::query()
            ->join(
                'equipment_statuses',
                'equipments.equipment_status_id',
                '=',
                'equipment_statuses.id'
            )
            ->select(
                'equipment_statuses.code',
                DB::raw('COUNT(equipments.id) as value')
            )
            ->groupBy('equipment_statuses.code')
            ->orderBy('equipment_statuses.code')
            ->get()
            ->map(function ($item) {
                return [
                    'label' => $item->code,
                    'value' => (int) $item->value,
                    'fill' => match ($item->code) {
                        'INST' => 'var(--chart-1)',
                        'AVLB' => 'var(--chart-2)',
                        'RPRD' => 'var(--chart-3)',
                        default => 'var(--chart-4)',
                    },
                ];
            });


        $availableMonths = collect();

        for ($i = 11; $i >= 0; $i--) {
            $d = $date->copy()->subMonthsNoOverflow($i);

            $availableMonths->push([
                'label' => $d->format('F Y'),
                'value' => $d->format('Y-m'),
            ]);
        }

        $selectedMonth = request('month', now()->format('Y-m')) ?? Carbon::now()->format('Y-m');

        $startDate = Carbon::createFromFormat('Y-m', $selectedMonth)
            ->startOfMonth();

        $endDate = Carbon::createFromFormat('Y-m', $selectedMonth)
            ->endOfMonth();

        $weeklyFindings = Finding::query()
            ->selectRaw('FLOOR((DAY(created_at)-1)/7)+1 as week_number,
        COUNT(*) as total')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('week_number')
            ->orderBy('week_number')
            ->get();

        $chartWeeklyFindings = collect();
        $weeklyTotal = 0;

        for ($week = 1; $week <= 5; $week++) {

            $row = $weeklyFindings->firstWhere(
                'week_number',
                $week
            );

            $chartWeeklyFindings->push([
                'week' => "W-{$week}",
                'value' => $row?->total ?? 0,
            ]);

            $weeklyTotal += $row?->total ?? 0;
        }

        $chartWeeklyFindings->push([
            'week' => 'Total',
            'value' => $weeklyTotal,
        ]);

        $inspectorFindings = Finding::query()
            ->join('users', 'findings.inspected_by', '=', 'users.id')
            ->selectRaw("
        users.name as inspector,
        CASE
            WHEN DAY(findings.created_at) BETWEEN 1 AND 7 THEN 1
            WHEN DAY(findings.created_at) BETWEEN 8 AND 14 THEN 2
            WHEN DAY(findings.created_at) BETWEEN 15 AND 21 THEN 3
            WHEN DAY(findings.created_at) BETWEEN 22 AND 28 THEN 4
            ELSE 5
        END as week_number,
        COUNT(*) as total
    ")
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'users.id',
                'users.name',
                'week_number'
            )
            ->get();

        $chartInspectorFindings = $inspectorFindings
            ->groupBy('week_number')
            ->flatMap(function ($items, $week) {

                return $items
                    ->sortByDesc('total')
                    ->take(3)
                    ->values()
                    ->map(function ($item) use ($week) {

                        return [
                            'label' => $item->inspector,
                            'week' => "W-{$week}",
                            'week_number' => (int) $week,
                            'value' => (int) $item->total,

                            'fill' => match ((int) $week) {
                                1 => 'var(--chart-1)',
                                2 => 'var(--chart-2)',
                                3 => 'var(--chart-3)',
                                4 => 'var(--chart-4)',
                                default => 'var(--chart-5)',
                            },
                        ];
                    });
            })
            ->values();

        $priorities = \App\Models\FindingPriority::query()
            ->orderBy('id')
            ->get();

        $priorityFindings = Finding::query()
            ->join(
                'finding_priorities',
                'findings.finding_priority_id',
                '=',
                'finding_priorities.id'
            )
            ->selectRaw("
        CASE
            WHEN DAY(findings.created_at) BETWEEN 1 AND 7 THEN 1
            WHEN DAY(findings.created_at) BETWEEN 8 AND 14 THEN 2
            WHEN DAY(findings.created_at) BETWEEN 15 AND 21 THEN 3
            WHEN DAY(findings.created_at) BETWEEN 22 AND 28 THEN 4
            ELSE 5
        END as week_number,

        finding_priorities.label,

        COUNT(*) as total
    ")
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'week_number',
                'finding_priorities.label'
            )
            ->orderBy('week_number')
            ->get();

        $prioritySeries = collect();

        foreach ($priorities as $priority) {

            $key = \Illuminate\Support\Str::slug($priority->label, '_');

            $prioritySeries->push([
                'key'   => $key,
                'label' => $priority->label,
                'color' => $priority->color_code,
            ]);
        }

        $totals = [];

        foreach ($prioritySeries as $series) {
            $totals[$series['key']] = 0;
        }

        $chartPriorityWeekly = collect();

        for ($week = 1; $week <= 5; $week++) {

            $row = [
                'week' => "W-{$week}",
            ];

            foreach ($prioritySeries as $series) {

                $total = optional(
                    $priorityFindings
                        ->where('week_number', $week)
                        ->firstWhere('label', $series['label'])
                )->total ?? 0;

                $row[$series['key']] = (int) $total;

                $totals[$series['key']] += $total;
            }

            $chartPriorityWeekly->push($row);
        }

        $totalRow = [
            'week' => 'Total',
        ];

        foreach ($prioritySeries as $series) {
            $totalRow[$series['key']] = $totals[$series['key']];
        }

        $chartPriorityWeekly->push($totalRow);
        //     $priorityFindings = Finding::query()
        //         ->join(
        //             'finding_priorities',
        //             'findings.finding_priority_id',
        //             '=',
        //             'finding_priorities.id'
        //         )
        //         ->selectRaw("
        //     CASE
        //         WHEN DAY(findings.created_at) BETWEEN 1 AND 7 THEN 1
        //         WHEN DAY(findings.created_at) BETWEEN 8 AND 14 THEN 2
        //         WHEN DAY(findings.created_at) BETWEEN 15 AND 21 THEN 3
        //         WHEN DAY(findings.created_at) BETWEEN 22 AND 28 THEN 4
        //         ELSE 5
        //     END as week_number,

        //     finding_priorities.label,

        //     COUNT(*) as total
        // ")
        //         ->whereBetween('findings.created_at', [$startDate, $endDate])
        //         ->groupBy(
        //             'week_number',
        //             'finding_priorities.label'
        //         )
        //         ->orderBy('week_number')
        //         ->get();

        //     $chartPriorityWeekly = collect();

        //     $totalPriority1 = 0;
        //     $totalPriority2 = 0;
        //     $totalPriority3 = 0;

        //     for ($week = 1; $week <= 5; $week++) {

        //         $priority1 = optional(
        //             $priorityFindings
        //                 ->where('week_number', $week)
        //                 ->firstWhere('label', 'PRIORITY 1')
        //         )->total ?? 0;

        //         $priority2 = optional(
        //             $priorityFindings
        //                 ->where('week_number', $week)
        //                 ->firstWhere('label', 'PRIORITY 2')
        //         )->total ?? 0;

        //         $priority3 = optional(
        //             $priorityFindings
        //                 ->where('week_number', $week)
        //                 ->firstWhere('label', 'PRIORITY 3')
        //         )->total ?? 0;

        //         $chartPriorityWeekly->push([
        //             'week' => "W-{$week}",

        //             'priority1' => (int)$priority1,
        //             'priority2' => (int)$priority2,
        //             'priority3' => (int)$priority3,
        //         ]);

        //         $totalPriority1 += $priority1;
        //         $totalPriority2 += $priority2;
        //         $totalPriority3 += $priority3;
        //     }

        //     $chartPriorityWeekly->push([
        //         'week' => 'Total',

        //         'priority1' => $totalPriority1,
        //         'priority2' => $totalPriority2,
        //         'priority3' => $totalPriority3,
        //     ]);

        $statusFindings = Finding::query()
            ->join(
                'finding_statuses',
                'findings.finding_status_id',
                '=',
                'finding_statuses.id'
            )
            ->selectRaw("
        CASE
            WHEN DAY(findings.created_at) BETWEEN 1 AND 7 THEN 1
            WHEN DAY(findings.created_at) BETWEEN 8 AND 14 THEN 2
            WHEN DAY(findings.created_at) BETWEEN 15 AND 21 THEN 3
            WHEN DAY(findings.created_at) BETWEEN 22 AND 28 THEN 4
            ELSE 5
        END as week_number,

        finding_statuses.id,
        finding_statuses.name,

        COUNT(*) as total
    ")
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'week_number',
                'finding_statuses.id',
                'finding_statuses.name'
            )
            ->orderBy('week_number')
            ->orderBy('finding_statuses.id')
            ->get();

        $chartStatusWeekly = collect();

        $totals = [
            'open' => 0,
            'inProgress' => 0,
            'onHold' => 0,
            'review' => 0,
            'closed' => 0,
        ];

        for ($week = 1; $week <= 5; $week++) {

            $row = [
                'week' => "W-{$week}",

                'open' => 0,
                'inProgress' => 0,
                'onHold' => 0,
                'review' => 0,
                'closed' => 0,
            ];

            foreach (
                $statusFindings
                    ->where('week_number', $week)
                as $status
            ) {

                switch ($status->id) {

                    case 1:
                        $row['open'] = (int)$status->total;
                        $totals['open'] += $status->total;
                        break;

                    case 2:
                        $row['inProgress'] = (int)$status->total;
                        $totals['inProgress'] += $status->total;
                        break;

                    case 3:
                        $row['onHold'] = (int)$status->total;
                        $totals['onHold'] += $status->total;
                        break;

                    case 4:
                        $row['review'] = (int)$status->total;
                        $totals['review'] += $status->total;
                        break;

                    case 5:
                        $row['closed'] = (int)$status->total;
                        $totals['closed'] += $status->total;
                        break;
                }
            }

            $chartStatusWeekly->push($row);
        }

        $chartStatusWeekly->push([
            'week' => 'Total',

            'open' => $totals['open'],
            'inProgress' => $totals['inProgress'],
            'onHold' => $totals['onHold'],
            'review' => $totals['review'],
            'closed' => $totals['closed'],
        ]);


        $chartTopFindingAreas = Finding::query()
            ->join(
                'functional_locations',
                'findings.functional_location_id',
                '=',
                'functional_locations.id'
            )
            ->select(
                'functional_locations.code',
                'functional_locations.description',
                DB::raw('COUNT(findings.id) as total_findings')
            )
            ->whereBetween('findings.created_at', [$startDate, $endDate])
            ->groupBy(
                'functional_locations.id',
                'functional_locations.code',
                'functional_locations.description'
            )
            ->orderByDesc('total_findings')
            ->limit(10)
            ->get()
            ->values()
            ->map(function ($item, $index) {

                return [
                    'label' => $item->code,
                    'description' => $item->description,
                    'value' => (int) $item->total_findings,

                    'fill' => 'var(--chart-' . (($index % 5) + 1) . ')',
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'total' => [
                    'value' => $totalFindings,
                    'desc' => 'Total keseluruhan temuan audit',
                    'trend' => $diff >= 0 ? "+$diff" : "$diff",
                ],
                'open' => [
                    'value' => $openFindings,
                    'desc' => 'Temuan yang memerlukan tindakan segera',
                    'status' => 'Attention needed',
                ],
                'closed' => [
                    'value' => $closedFindings,
                    'desc' => 'Temuan yang sudah terselesaikan',
                    'status' => 'Compliance met',
                ],
                'slaExceeded' => [
                    'value' => $slaExceeded,
                    'desc' => 'Temuan yang melewati batas SLA',
                ],
            ],

            'monthlyFinding' => [
                'chart' => $chartMonthlyFindings,
                'series' => $seriesMonthlyFindings,
            ],


            'chartClosedFindingDepartment' => Finding::getChartData(\App\Models\Department::class),
            'chartClosedFindingWorkCenter' => Finding::getChartData(\App\Models\WorkCenter::class),
            'topInspectors' => Finding::getTopInspectors(),
            'topResolvers' => Finding::getTopResolvers(),
            'equipmentStatusChart' => $equipmentStatusChart,
            'availableMonths' => $availableMonths,
            'selectedMonth' => $selectedMonth,
            'chartWeeklyFindings' => $chartWeeklyFindings,
            'prioritySeries' => $prioritySeries,
            'chartInspectorFindings' => $chartInspectorFindings,
            'chartPriorityWeekly' => $chartPriorityWeekly,
            'chartStatusWeekly' => $chartStatusWeekly,
            'chartTopFindingAreas' => $chartTopFindingAreas,
        ]);
    }
}
