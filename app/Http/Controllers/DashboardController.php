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

        $monthlyFindings = Finding::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $chartMonthlyFindings = collect();

        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);

            $row = $monthlyFindings->first(function ($item) use ($date) {
                return $item->year == $date->year
                    && $item->month == $date->month;
            });

            $chartMonthlyFindings->push([
                'month' => $date->format('M'),
                'total' => $row?->total ?? 0,
            ]);
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
            $date = now()->subMonths($i);

            $availableMonths->push([
                'label' => $date->format('F Y'),
                'value' => $date->format('Y-m'),
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
            ->orderBy('week_number')
            ->orderByDesc('total')
            ->get();

        $chartInspectorFindings = $inspectorFindings
            ->map(function ($item) {

                return [
                    'label' => $item->inspector,
                    'week' => "W-{$item->week_number}",
                    'week_number' => $item->week_number,
                    'value' => (int) $item->total,

                    'fill' => match ($item->week_number) {
                        1 => 'var(--chart-1)',
                        2 => 'var(--chart-2)',
                        3 => 'var(--chart-3)',
                        4 => 'var(--chart-4)',
                        5 => 'var(--chart-5)',
                    },
                ];
            })
            ->values();

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

        $chartPriorityWeekly = collect();

        $totalPriority1 = 0;
        $totalPriority2 = 0;
        $totalPriority3 = 0;

        for ($week = 1; $week <= 5; $week++) {

            $priority1 = optional(
                $priorityFindings
                    ->where('week_number', $week)
                    ->firstWhere('label', 'PRIORITY 1')
            )->total ?? 0;

            $priority2 = optional(
                $priorityFindings
                    ->where('week_number', $week)
                    ->firstWhere('label', 'PRIORITY 2')
            )->total ?? 0;

            $priority3 = optional(
                $priorityFindings
                    ->where('week_number', $week)
                    ->firstWhere('label', 'PRIORITY 3')
            )->total ?? 0;

            $chartPriorityWeekly->push([
                'week' => "W-{$week}",

                'priority1' => (int)$priority1,
                'priority2' => (int)$priority2,
                'priority3' => (int)$priority3,
            ]);

            $totalPriority1 += $priority1;
            $totalPriority2 += $priority2;
            $totalPriority3 += $priority3;
        }

        $chartPriorityWeekly->push([
            'week' => 'Total',

            'priority1' => $totalPriority1,
            'priority2' => $totalPriority2,
            'priority3' => $totalPriority3,
        ]);

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
            'chartClosedFindingDepartment' => Finding::getChartData(\App\Models\Department::class),
            'chartClosedFindingWorkCenter' => Finding::getChartData(\App\Models\WorkCenter::class),
            'topInspectors' => Finding::getTopInspectors(),
            'topResolvers' => Finding::getTopResolvers(),
            'chartMonthlyFindings' => $chartMonthlyFindings,
            'equipmentStatusChart' => $equipmentStatusChart,
            'availableMonths' => $availableMonths,
            'selectedMonth' => $selectedMonth,
            'chartWeeklyFindings' => $chartWeeklyFindings,
            'chartInspectorFindings' => $chartInspectorFindings,
            'chartPriorityWeekly' => $chartPriorityWeekly,
            'chartStatusWeekly' => $chartStatusWeekly,
        ]);
    }
}
