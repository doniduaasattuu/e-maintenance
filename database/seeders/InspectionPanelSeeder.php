<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentInspectionForm;
use App\Models\InspectionPanel;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class InspectionPanelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Pastikan ada user dan equipment untuk relasi
        $user = User::first() ?? User::factory()->create();
        $equipments = Equipment::all();

        if ($equipments->isEmpty()) {
            $this->command->warn('No equipment found. Please seed equipments first.');
            return;
        }

        // 2. Generate data untuk 30 hari terakhir
        foreach ($equipments as $equipment) {
            // Hanya seed untuk equipment yang relevan (misal: panel listrik)
            // Anda bisa menambahkan pengecekan equipment_class jika perlu

            for ($i = 30; $i >= 0; $i--) {
                $inspectionDate = Carbon::now()->subDays($i);

                // Buat record InspectionPanel
                $panel = InspectionPanel::create([
                    'is_operational' => Arr::random([0, 1]),
                    'is_clean' => Arr::random([0, 1]),
                    'temperature_incoming_r' => rand(3000, 4500) / 100,
                    'temperature_incoming_s' => rand(3000, 4500) / 100,
                    'temperature_incoming_t' => rand(3000, 4500) / 100,
                    'temperature_cabinet' => rand(3000, 5000) / 100,
                    'temperature_outgoing_r' => rand(3000, 4500) / 100,
                    'temperature_outgoing_s' => rand(3000, 4500) / 100,
                    'temperature_outgoing_t' => rand(3000, 4500) / 100,
                    'current_r' => rand(100, 120),
                    'current_s' => rand(100, 120),
                    'current_t' => rand(100, 120),
                    'inspected_by' => $user->id,
                    'created_at' => $inspectionDate,
                    'updated_at' => $inspectionDate,
                ]);

                // Buat relasi di tabel equipment_inspection_forms
                EquipmentInspectionForm::create([
                    'equipment_id' => $equipment->id,
                    'formable_id' => $panel->id,
                    'formable_type' => InspectionPanel::class,
                    'created_at' => $inspectionDate,
                    'updated_at' => $inspectionDate,
                ]);
            }
        }
    }
}
