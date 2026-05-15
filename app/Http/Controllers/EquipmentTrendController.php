<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class EquipmentTrendController extends Controller
{
    public function show(Request $request, Equipment $equipment)
    {
        // 1. Handling Date Range
        $dateRange = $request->input('date_range', [
            'start_date' => Carbon::now()->subDays(30)->format('Y-m-d'),
            'end_date' => Carbon::now()->format('Y-m-d'),
        ]);

        $start_date = Carbon::parse($dateRange['start_date'])->startOfDay();
        $end_date = Carbon::parse($dateRange['end_date'])->endOfDay();

        // 2. Query Data dengan Eager Loading Morph
        $inspections = $equipment->inspections()
            ->with(['formable']) // MorphTo inspection_panels atau inspection_motors
            ->whereBetween('created_at', [$start_date, $end_date])
            ->orderBy('created_at', 'asc')
            ->get();

        // 3. Transform Data ke format Chart-Ready
        // Kita petakan kolom database ke Label yang manusiawi untuk Recharts
        $trendData = $inspections->map(function ($form) {
            $details = $form->formable;

            // Format dasar yang selalu ada
            $data = [
                'date' => $form->created_at->format('d M Y H:i'),
                'is_operational' => $details->is_operational,
            ];

            // Jika formable adalah InspectionPanel, tambahkan field spesifiknya
            if ($details instanceof \App\Models\InspectionPanel) {
                $data = array_merge($data, [
                    'Temp Cabinet' => (float) $details->temperature_cabinet,
                    'Avg Current' => round(($details->current_r + $details->current_s + $details->current_t) / 3, 2),
                    'Max Incoming' => max($details->temperature_incoming_r, $details->temperature_incoming_s, $details->temperature_incoming_t),
                ]);
            }

            // Jika formable adalah InspectionMotor (siap untuk masa depan)
            if ($details instanceof \App\Models\InspectionMotor) {
                $data = array_merge($data, [
                    'Temp Body' => (float) $details->temperature_body,
                    'Vibration DE' => (float) $details->vibration_dev,
                ]);
            }

            return $data;
        });

        return Inertia::render('equipment/trend', [
            'equipment' => new EquipmentResource($equipment->load('status', 'eclass')),
            'trendData' => $trendData,
            'filters' => [
                'date_range' => $dateRange
            ],
            // Konfigurasi Chart agar Frontend tahu garis apa saja yang harus digambar
            'chartConfig' => $this->getChartConfig($inspections->first()?->formable_type)
        ]);
    }

    private function getChartConfig($type)
    {
        if ($type === \App\Models\InspectionPanel::class) {
            return [
                ['key' => 'Temp Cabinet', 'color' => '#ef4444', 'unit' => '°C'],
                ['key' => 'Max Incoming', 'color' => '#f59e0b', 'unit' => '°C'],
                ['key' => 'Avg Current', 'color' => '#3b82f6', 'unit' => 'A'],
            ];
        }
        // Config untuk motor bisa ditambahkan di sini
        return [];
    }
}
