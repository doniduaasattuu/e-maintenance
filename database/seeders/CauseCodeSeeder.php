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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C101',
                'description' => 'PERSONNEL ERROR',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C103',
                'description' => 'SABOTAGE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C200',
                'description' => 'IMPROPER MATERIAL',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C201',
                'description' => 'IMPROPER DESIGN',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C202',
                'description' => 'IMPROPER CAPACITY',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C203',
                'description' => 'IMPROPER LIFE TIME',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C204',
                'description' => 'CHARACTER DRIFTING',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C300',
                'description' => 'INSTALLATION ERROR',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C301',
                'description' => 'FABRICATION ERROR',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C400',
                'description' => 'SEVERE SURROUNDING CONDITION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C500',
                'description' => 'EXTERNAL PLN FAILURE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C501',
                'description' => 'EXTERNAL GAS SUPPLY FAILURE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C502',
                'description' => 'EXTERNAL SOLAR SUPPLY FAILURE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C503',
                'description' => 'EXTERNAL COAL SUPPLY FAILURE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C600',
                'description' => 'MAINTENANCE ERROR',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C601',
                'description' => 'IMPROPER PREVIOUS REPAIR',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C602',
                'description' => 'LACK OF LUBRICATION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C700',
                'description' => 'WRONG OPERATION',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C701',
                'description' => 'LACK OF OPERATION CONTROL',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'C702',
                'description' => 'EXPECTED WORN & TORN',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];


        collect($causeCodes)->each(fn($c) => CauseCode::create($c));
    }
}
