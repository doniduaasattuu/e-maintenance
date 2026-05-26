<?php

namespace Database\Seeders;

use App\Models\FindingType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FindingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $finding_types = [
            [
                'code' => 'AUD',
                'name' => 'Audit 5RK3',
                'description' => 'The findings of the formal audit results are based on the 5RK3 criteria (Ringkas, Rapi, Resik, Rawat, Rajin, K3).',
            ],
            [
                'code' => 'ABN',
                'name' => 'Abnormality',
                'description' => 'Findings of deviations from standard conditions found during patrols or daily operations.',
            ],
        ];

        collect($finding_types)->each(fn($e) => FindingType::create($e));
    }
}
