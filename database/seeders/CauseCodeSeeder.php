<?php

namespace Database\Seeders;

use App\Models\CauseCode;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CauseCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $causeCodes = [
            [
                'code' => 'C100',
                'description' => 'NATURAL ACCIDENT',
            ],
            [
                'code' => 'C101',
                'description' => 'PERSONNEL ERROR',
            ],
            [
                'code' => 'C103',
                'description' => 'SABOTAGE',
            ],
            [
                'code' => 'C200',
                'description' => 'IMPROPER MATERIAL',
            ],
            [
                'code' => 'C201',
                'description' => 'IMPROPER DESIGN',
            ],
            [
                'code' => 'C202',
                'description' => 'IMPROPER CAPACITY',
            ],
            [
                'code' => 'C203',
                'description' => 'IMPROPER LIFE TIME',
            ],
            [
                'code' => 'C204',
                'description' => 'CHARACTER DRIFTING',
            ],
            [
                'code' => 'C300',
                'description' => 'INSTALLATION ERROR',
            ],
            [
                'code' => 'C301',
                'description' => 'FABRICATION ERROR',
            ],
            [
                'code' => 'C400',
                'description' => 'SEVERE SURROUNDING CONDITION',
            ],
            [
                'code' => 'C500',
                'description' => 'EXTERNAL PLN FAILURE',
            ],
            [
                'code' => 'C501',
                'description' => 'EXTERNAL GAS SUPPLY FAILURE',
            ],
            [
                'code' => 'C502',
                'description' => 'EXTERNAL SOLAR SUPPLY FAILURE',
            ],
            [
                'code' => 'C503',
                'description' => 'EXTERNAL COAL SUPPLY FAILURE',
            ],
            [
                'code' => 'C600',
                'description' => 'MAINTENANCE ERROR',
            ],
            [
                'code' => 'C601',
                'description' => 'IMPROPER PREVIOUS REPAIR',
            ],
            [
                'code' => 'C602',
                'description' => 'LACK OF LUBRICATION',
            ],
            [
                'code' => 'C700',
                'description' => 'WRONG OPERATION',
            ],
            [
                'code' => 'C701',
                'description' => 'LACK OF OPERATION CONTROL',
            ],
            [
                'code' => 'C702',
                'description' => 'EXPECTED WORN & TORN',
            ],
        ];


        collect($causeCodes)->each(fn($c) => CauseCode::create($c));
    }
}
