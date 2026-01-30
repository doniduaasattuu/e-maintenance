<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Repository;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RepositoryEquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $repository = Repository::first();

        if ($repository && Equipment::exists()) {
            $equipmentIds = Equipment::take(15)->pluck('id');

            $repository->equipments()->attach($equipmentIds);
        }
    }
}
