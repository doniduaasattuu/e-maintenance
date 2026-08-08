<?php

namespace Database\Seeders;

use App\Models\ImprovementCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImprovementCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electrical',
                'description' => 'Improvement related to electrical systems, components, and installations.',
            ],
            [
                'name' => 'Mechanical',
                'description' => 'Improvement related to mechanical systems, components, and equipment.',
            ],
            [
                'name' => 'Instrumentation',
                'description' => 'Improvement related to instrumentation, control, and measurement systems.',
            ],
            [
                'name' => 'Reliability',
                'description' => 'Improvement intended to increase equipment reliability and reduce recurring failures.',
            ],
            [
                'name' => 'Safety',
                'description' => 'Improvement intended to improve personnel and equipment safety.',
            ],
            [
                'name' => 'Energy Saving',
                'description' => 'Improvement intended to reduce energy consumption and improve energy efficiency.',
            ],
            [
                'name' => 'Productivity',
                'description' => 'Improvement intended to increase productivity and operational efficiency.',
            ],
            [
                'name' => 'Cost Reduction',
                'description' => 'Improvement intended to reduce maintenance, operational, or material costs.',
            ],
        ];

        foreach ($categories as $category) {
            ImprovementCategory::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
