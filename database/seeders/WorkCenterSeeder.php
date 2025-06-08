<?php

namespace Database\Seeders;

use App\Models\WorkCenter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $work_centers = [
            [
                'code' => 'PME21001',
                'name' => 'ELEC PREVENTIVE NON SHIFT PM3/7',
            ],
            [
                'code' => 'PME21002',
                'name' => 'INSTR PREVENTIVE NON SHIFT PM3/7',
            ],
            [
                'code' => 'PME21003',
                'name' => 'ELEC CORRECTIVE SHIFT PM3/7',
            ],
            [
                'code' => 'PME21004',
                'name' => 'ELCT PM5 AREA (NOT ACTIVE)',
            ],
            [
                'code' => 'PME21005',
                'name' => 'INSTR CORRECTIVE SHIFT PM3/7',
            ],
            [
                'code' => 'PME31001',
                'name' => 'ELEC PREVENTIVE NON SHIFT PM5/8',
            ],
            [
                'code' => 'PME31002',
                'name' => 'INSTR PREVENTIVE NON SHIFT PM5/8',
            ],
            [
                'code' => 'PME31003',
                'name' => 'ELEC CORRECTIVE SHIFT PM5/8',
            ],
            [
                'code' => 'PME31005',
                'name' => 'INSTR CORRECTIVE SHIFT PM5/8',
            ],
            [
                'code' => 'PME61001',
                'name' => 'ELECTRIC NON SHIFT ENERGY CENTER',
            ],
            [
                'code' => 'PME61002',
                'name' => 'ELECTRIC SHIFT 1.2.3 ENERGY CENTER',
            ],
            [
                'code' => 'PME62001',
                'name' => 'INSTRUMENT NON SHIFT ENERGY CENTER',
            ],
            [
                'code' => 'PME62002',
                'name' => 'INSTRUMENT SHIFT 1.2.3 ENERGY CENTER',
            ],
            [
                'code' => 'PME63001',
                'name' => 'ELECTRIC INSPECTOR',
            ],
            [
                'code' => 'PME63002',
                'name' => 'INSTRUMENT INSPECTOR',
            ],
            [
                'code' => 'PMG11001',
                'name' => 'CIVIL GA',
            ],
            [
                'code' => 'PML11001',
                'name' => 'CIVIL ENGINEERING – PROJECT',
            ],
            [
                'code' => 'PML11002',
                'name' => 'CIVIL ENGINEERING – MAINTENANCE',
            ],
            [
                'code' => 'PMM11001',
                'name' => 'MECH.CORRECTIVE SP1/PM1',
            ],
            [
                'code' => 'PMM11002',
                'name' => 'MECH.CORRECTIVE SP2/PM2',
            ],
            [
                'code' => 'PMM11003',
                'name' => 'MECH.PREVENTIVE SP1/PM1',
            ],
            [
                'code' => 'PMM11004',
                'name' => 'MECH.PREVENTIVE SP2/PM2',
            ],
            [
                'code' => 'PMM11005',
                'name' => 'MECH.PREVENTIVE OIL / LUB SP1-2/PM1-2',
            ],
            [
                'code' => 'PMM11006',
                'name' => 'MECH.PREVENTIVE COM / HYD SP1-2/PM1-2',
            ],
            [
                'code' => 'PMM11007',
                'name' => 'MECH.SHIFT SP1-2/PM1-2',
            ],
            [
                'code' => 'PMM21001',
                'name' => 'MECH PREVENTIVE SP-PM3/7 AREA',
            ],
            [
                'code' => 'PMM21002',
                'name' => 'MECH CORRECTIVE NON SHIFT SP-PM3/7 AREA',
            ],
            [
                'code' => 'PMM21003',
                'name' => 'MECH LUBRICATION SP-PM3/7 AREA',
            ],
            [
                'code' => 'PMM21004',
                'name' => 'MECH SHIFT SP-PM3/7 AREA',
            ],
            [
                'code' => 'PMM31001',
                'name' => 'MECH CORRECTIVE SP#5 & PM#5 AREA',
            ],
            [
                'code' => 'PMM31002',
                'name' => 'MECH SHIFT SP#5 & PM#5 AREA',
            ],
            [
                'code' => 'PMM31003',
                'name' => 'MECH PREVENTIVE SP#5 & PM5 AREA',
            ],
            [
                'code' => 'PMM31004',
                'name' => 'MECH CORRECTIVE SP#8 & PM#8 AREA',
            ],
            [
                'code' => 'PMM31005',
                'name' => 'MECH PREVENTIVE SP#8 & PM8 AREA',
            ],
            [
                'code' => 'PMM31006',
                'name' => 'MECH SHIFT SP#8 & PM#8 AREA',
            ],
            [
                'code' => 'PMM51001',
                'name' => 'MECH.CORRECTIVE - PREVENTIVE WWT AREA',
            ],
            [
                'code' => 'PMM51002',
                'name' => 'MECH.CORRECTIVE - PREVENTIVE PELLET AREA',
            ],
            [
                'code' => 'PMM51003',
                'name' => 'MECH.UILITY COMPRESSOR',
            ],
            [
                'code' => 'PMM51004',
                'name' => 'MECH.UILITY CRANES',
            ],
        ];

        collect($work_centers)->each(fn($w) => WorkCenter::create($w));
    }
}
