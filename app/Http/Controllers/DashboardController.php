<?php

namespace App\Http\Controllers;

use App\Models\Finding;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getAvailableMonths()
    {
        $availableMonths = collect();

        for ($i = 11; $i >= 0; $i--) {
            $d = Carbon::now()->copy()->subMonthsNoOverflow($i);

            $availableMonths->push([
                'label' => $d->format('F Y'),
                'value' => $d->format('Y-m'),
            ]);
        }

        return $availableMonths;
    }

    public function index()
    {
        $selectedMonth = request('month', now()->format('Y-m')) ?? Carbon::now()->format('Y-m');

        $startDate = Carbon::createFromFormat('Y-m', $selectedMonth)
            ->startOfMonth();

        $endDate = Carbon::createFromFormat('Y-m', $selectedMonth)
            ->endOfMonth();

        $stats = Finding::getStats();
        $priority = Finding::getPriorityWeekly($startDate, $endDate);

        return Inertia::render('dashboard', [
            'selectedMonth' => $selectedMonth,
            'stats' => [
                'total' => [
                    'value' => $stats['totalFindings'],
                    'desc' => 'Total keseluruhan temuan audit',
                    'trend' => $stats['diff'] >= 0 ? "+" . $stats['diff'] : $stats['diff'],
                ],
                'open' => [
                    'value' => $stats['openFindings'],
                    'desc' => 'Temuan yang memerlukan tindakan segera',
                    'status' => 'Attention needed',
                ],
                'closed' => [
                    'value' => $stats['closedFindings'],
                    'desc' => 'Temuan yang sudah terselesaikan',
                    'status' => 'Compliance met',
                ],
                'slaExceeded' => [
                    'value' => $stats['slaExceeded'],
                    'desc' => 'Temuan yang melewati batas SLA',
                ],
            ],

            'monthlyFinding' => [
                'chart' => Finding::getMonthlyFinding()['chart'],
                'series' => Finding::getMonthlyFinding()['series'],
            ],
            'chartClosedFindingDepartment' => Finding::getChartData(\App\Models\Department::class),
            'chartClosedFindingWorkCenter' => Finding::getChartData(\App\Models\WorkCenter::class),
            'topInspectors' => Finding::getTopInspectors(),
            'topResolvers' => Finding::getTopResolvers($startDate, $endDate),
            'availableMonths' => $this->getAvailableMonths(),
            'chartWeeklyFindings' => Finding::getWeeklyFinding($startDate, $endDate)['chart'],
            'priorityWeekly' => [
                'chart' => $priority['chart'],
                'series' => $priority['series'],
            ],
            'chartInspectorFindings' => Finding::getInspectorWeekly($startDate, $endDate)['chart'],
            'chartStatusWeekly' => Finding::getStatusWeekly($startDate, $endDate)['chart'],
            'chartTopFindingAreas' => Finding::getTopFindingAreas($startDate, $endDate),
            // 'equipmentStatusChart' => $equipmentStatusChart,
        ]);
    }
}

 // $equipmentStatusChart = Equipment::query()
        //     ->join(
        //         'equipment_statuses',
        //         'equipments.equipment_status_id',
        //         '=',
        //         'equipment_statuses.id'
        //     )
        //     ->select(
        //         'equipment_statuses.code',
        //         DB::raw('COUNT(equipments.id) as value')
        //     )
        //     ->groupBy('equipment_statuses.code')
        //     ->orderBy('equipment_statuses.code')
        //     ->get()
        //     ->map(function ($item) {
        //         return [
        //             'label' => $item->code,
        //             'value' => (int) $item->value,
        //             'fill' => match ($item->code) {
        //                 'INST' => 'var(--chart-1)',
        //                 'AVLB' => 'var(--chart-2)',
        //                 'RPRD' => 'var(--chart-3)',
        //                 default => 'var(--chart-4)',
        //             },
        //         ];
        //     });