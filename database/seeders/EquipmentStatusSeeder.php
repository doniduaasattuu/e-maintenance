<?php

namespace Database\Seeders;

use App\Models\EquipmentStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment_statuses = [
            [
                'code' => 'INST',
                'name' => 'Installed',
                'description' => 'Equipment is currently installed and operational at its assigned location.'
            ],
            [
                'code' => 'AVLB',
                'name' => 'Available',
                'description' => 'Equipment is available for deployment or assignment, not currently in use.'
            ],
            [
                'code' => 'RPRD',
                'name' => 'Repaired',
                'description' => 'Equipment has been repaired and is ready for use or reinstallation.'
            ],
            [
                'code' => 'SCRP',
                'name' => 'Scrapped',
                'description' => 'Equipment is no longer in use and has been scrapped.'
            ],
        ];

        collect($equipment_statuses)->each(fn($e) => EquipmentStatus::create($e));
    }
}
