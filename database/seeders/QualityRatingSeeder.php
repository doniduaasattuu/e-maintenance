<?php

namespace Database\Seeders;

use App\Models\QualityRating;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QualityRatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quality_ratings = [
            [

                'id' => 1,
                'name' => 'Good',
                'description' => 'Fully meets or exceeds all requirements and expectations. Performs reliably and consistently with no significant issues. No corrective action needed.',
            ],
            [

                'id' => 2,
                'name' => 'Satisfactory',
                'description' => 'Meets most requirements with minor issues that do not significantly impact performance. Acceptable for continued use, but may require monitoring or minor improvements.',
            ],
            [

                'id' => 3,
                'name' => 'Acceptable',
                'description' => 'Meets minimum standards, but with noticeable limitations or inefficiencies. Performance is marginal and may require corrective action or close supervision.',
            ],
            [

                'id' => 4,
                'name' => 'Unacceptable',
                'description' => 'Does not meet required standards. Performance is poor or unreliable, and corrective action is urgently needed. Not suitable for continued use in its current state.',
            ],
        ];

        collect($quality_ratings)->each(fn($q) => QualityRating::create($q));
    }
}
