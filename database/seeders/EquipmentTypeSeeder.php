<?php

namespace Database\Seeders;

use App\Models\EquipmentClass;
use App\Models\EquipmentType;
use Illuminate\Database\Seeder;

class EquipmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classPanel = EquipmentClass::where('code', 'ZCLASS_E008')->first();

        $equipment_types = [
            [
                'equipment_class_id' => $classPanel->id,
                'code' => 'ZTYPE_P001',
                'name' => 'Main Distribution Panel',
            ],
            [
                'equipment_class_id' => $classPanel->id,
                'code' => 'ZTYPE_P002',
                'name' => 'Motor Control Center',
            ],
            [
                'equipment_class_id' => $classPanel->id,
                'code' => 'ZTYPE_P003',
                'name' => 'Drive Panel',
            ],
            [
                'equipment_class_id' => $classPanel->id,
                'code' => 'ZTYPE_P004',
                'name' => 'PLC Panel',
            ],
        ];

        collect($equipment_types)->each(fn($e) => EquipmentType::create($e));
    }
}
