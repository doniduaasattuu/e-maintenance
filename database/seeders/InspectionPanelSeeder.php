<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentInspectionForm;
use App\Models\InspectionPanel;
use App\Models\Position;
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
        EquipmentInspectionForm::where(
            'formable_type',
            InspectionPanel::class
        )->delete();

        InspectionPanel::truncate();

        // Ambil seluruh user
        $users = User::whereHas('position', function ($query) {
            $query->whereIn('code', ['OPR', 'FR', 'GL']);
        })->get();

        if ($users->isEmpty()) {
            $this->command->warn('No user found. Please seed users first.');
            return;
        }

        // Ambil hanya equipment class panel (ZCLASS_E008) maksimal 10 data
        $equipments = Equipment::query()
            ->whereHas('eclass', function ($query) {
                $query->where('code', 'ZCLASS_E008');
            })
            ->orderBy('id')
            // ->limit(10)
            ->get();

        if ($equipments->isEmpty()) {
            $this->command->warn('No panel equipment found.');
            return;
        }

        // Generate inspeksi 30 hari terakhir
        foreach ($equipments as $equipment) {

            for ($i = 30; $i >= 0; $i--) {

                $inspectionDate = Carbon::now()->subDays($i);

                // Pilih inspector secara random
                $user = $users->random();
                $baseTemp = rand(34, 38);
                $baseCurrent = rand(105, 115);

                $panel = InspectionPanel::create([
                    'is_operational' => Arr::random([0, 1]),
                    'is_clean' => Arr::random([0, 1]),

                    'temperature_incoming_r' => $baseTemp + fake()->randomFloat(2, -1, 1),
                    'temperature_incoming_s' => $baseTemp + fake()->randomFloat(2, -1, 1),
                    'temperature_incoming_t' => $baseTemp + fake()->randomFloat(2, -1, 1),

                    'temperature_outgoing_r' => $baseTemp + fake()->randomFloat(2, -1, 1),
                    'temperature_outgoing_s' => $baseTemp + fake()->randomFloat(2, -1, 1),
                    'temperature_outgoing_t' => $baseTemp + fake()->randomFloat(2, -1, 1),

                    'temperature_cabinet' => rand(3000, 5000) / 100,

                    'current_r' => $baseCurrent + fake()->randomFloat(2, -2, 2),
                    'current_s' => $baseCurrent + fake()->randomFloat(2, -2, 2),
                    'current_t' => $baseCurrent + fake()->randomFloat(2, -2, 2),

                    'inspected_by' => $user->id,

                    'created_at' => $inspectionDate,
                    'updated_at' => $inspectionDate,
                ]);

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
