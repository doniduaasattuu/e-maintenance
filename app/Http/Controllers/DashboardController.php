<?php

namespace App\Http\Controllers;

use App\Models\Finding;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total Findings
        $totalFindings = Finding::count();

        // 2. Open Findings (Belum ditutup)
        $openFindings = Finding::whereNull('closed_at')->count();

        // 3. Closed Findings (Sudah ditutup)
        $closedFindings = Finding::whereNotNull('closed_at')->count();

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
            'chartClosedFinding' => Finding::getChartData(),
            'topInspectors' => Finding::getTopInspectors(),
        ]);
    }
}
