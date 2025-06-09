<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Division;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $eng = Division::where('code', 'ENG')->first();

        $electricals = [
            [
                'code' => 'EI1',
                'division_id' => $eng->id,
                'name' => 'Electric Instrument PM12',
            ],
            [
                'code' => 'EI2',
                'division_id' => $eng->id,
                'name' => 'Electric Instrument PM37',
            ],
            [
                'code' => 'EI3',
                'division_id' => $eng->id,
                'name' => 'Electric Instrument PM58',
            ],
            [
                'code' => 'EI4',
                'division_id' => $eng->id,
                'name' => 'Electric Utility & WWT',
            ],
            [
                'code' => 'EI5',
                'division_id' => $eng->id,
                'name' => 'Electric Transformer',
            ],
            // [
            //     'code' => 'EI6',
            //     'division_id' => $eng->id,
            //     'name' => 'Electric Instrument ENC',
            // ],
            // [
            //     'code' => 'ME1',
            //     'division_id' => $eng->id,
            //     'name' => 'Mechanic PM12',
            // ],
            // [
            //     'code' => 'ME2',
            //     'division_id' => $eng->id,
            //     'name' => 'Mechanic PM37',
            // ],
            // [
            //     'code' => 'ME3',
            //     'division_id' => $eng->id,
            //     'name' => 'Mechanic PM58',
            // ],
            // [
            //     'code' => 'ME4',
            //     'division_id' => $eng->id,
            //     'name' => 'Mechanic Machining',
            // ],
            // [
            //     'code' => 'ME5',
            //     'division_id' => $eng->id,
            //     'name' => 'Mechanic Piping',
            // ],
            // [
            //     'code' => 'ME6',
            //     'division_id' => $eng->id,
            //     'name' => 'Mechanic ENC',
            // ],
        ];

        collect($electricals)->each(fn($e) => Department::create($e));
    }
}
