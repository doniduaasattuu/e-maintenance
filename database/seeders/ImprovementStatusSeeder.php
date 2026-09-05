<?php

namespace Database\Seeders;

use App\Models\ImprovementStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImprovementStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Submitted',
                'color' => '#fe5f55',
                'sequence' => 1,

            ],
            [
                'name' => 'Implemented',
                'color' => '#8B5CF6',
                'sequence' => 2,
            ],
            [
                'name' => 'Approved',
                'color' => '#3B82F6',
                'sequence' => 3,
            ],
            [
                'name' => 'Verified',
                'color' => '#22C55E',
                'sequence' => 4,
            ],
            [
                'name' => 'Rejected',
                'color' => '#710000',
                'sequence' => 99,
            ],
        ];


        foreach ($statuses as $status) {
            ImprovementStatus::updateOrCreate(
                ['name' => $status['name']],
                $status
            );
        }
    }
}
