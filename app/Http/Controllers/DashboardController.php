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
        ]);
    }
}
