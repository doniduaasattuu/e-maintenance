<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Image;
use App\Models\Material;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paths = [
            '429e81da-15cf-4f8b-8414-bcef5fb7eece.jpg',
            'c76c6bba-5dc3-4744-84f0-888ca8f85921.jpg',
            'edd9a36d-c99f-4d70-923b-dad8a30e08d7.jpg',
            'f36ee56b-cd63-406f-b7e4-3900c1da024a.jpg',
            'f808a03e-6ff6-4433-bfa0-6bbfab2b50a4.jpg',
        ];

        foreach ($paths as $path) {
            Image::firstOrCreate([
                'path' => 'assets/images/equipment/' . $path,
                'imageable_type' => 'equipment',
                'imageable_id' => Equipment::first()->id,
            ]);

            Image::firstOrCreate([
                'path' => 'assets/images/material/' . $path,
                'imageable_type' => 'material',
                'imageable_id' => Material::first()->id,
            ]);
        }
    }
}
