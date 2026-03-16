<?php

namespace Database\Seeders;

use App\Models\FindingStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FindingStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $finding_statuses = [
            [
                'name' => 'Open',
                'description' => 'A new issue has been identified and submitted from the field.'
            ],
            [
                'name' => 'In Progress',
                'description' => 'Active work is being performed (repair, adjustment, or replacement).'
            ],
            [
                'name' => 'On Hold',
                'description' => 'Work is temporarily paused due to external constraints (parts, permits, or access).'
            ],
            [
                'name' => 'Review',
                'description' => 'Work is physically complete; "After" photos and reports are uploaded.'
            ],
            [
                'name' => 'Closed',
                'description' => 'The finding is validated, resolved, and formally archived.'
            ],
        ];

        collect($finding_statuses)->each(fn($e) => FindingStatus::create($e));
    }
}
