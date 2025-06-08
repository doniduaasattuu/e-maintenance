<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positions = [
            [
                'code' => 'OPR',
                'name' => 'Operator',
            ],
            [
                'code' => 'FR',
                'name' => 'Foreman',
            ],
            [
                'code' => 'GL',
                'name' => 'Group Leader',
            ],
            [
                'code' => 'SPV',
                'name' => 'Supervisor',
            ],
            [
                'code' => 'DH',
                'name' => 'Dept. Head',
            ],
            [
                'code' => 'MGR',
                'name' => 'Manager',
            ],
            [
                'code' => 'DIR',
                'name' => 'Director',
            ],
        ];

        collect($positions)->each(fn($p) => Position::create($p));
    }
}
