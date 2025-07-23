<?php

namespace Database\Seeders;

use App\Models\EquipmentClass;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment_classes = [
            [
                'code' => 'ZCLASS_E008',
                'name' => 'ELECTRICAL PANEL',
                'formable_type' => 'PANEL',
                'description' => 'Distribution panels for managing electrical circuits and power systems.'
            ],
            [
                'code' => 'ZCLASS_E009',
                'name' => 'MOTOR /DRIVE',
                'formable_type' => 'MOTOR',
                'description' => 'Rotating machinery and motor drives used for mechanical operations.'
            ],
            [
                'code' => 'ZCLASS_E012',
                'name' => 'TRANSFORMER',
                'formable_type' => 'TRANSFORMER',
                'description' => 'Electrical equipment used to step up or step down voltage in power systems.'
            ],
            [
                'code' => 'ZCLASS_U001',
                'name' => 'AIR CONDITIONER / CHILLER',
                'formable_type' => 'AC',
                'description' => 'Cooling systems for climate control and industrial process temperature regulation.'
            ],
        ];

        collect($equipment_classes)->each(fn($e) => EquipmentClass::create($e));
    }
}
