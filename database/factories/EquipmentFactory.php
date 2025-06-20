<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => Str::upper(fake()->lexify('???')) . fake()->numerify('######'),
            'sort_field' => Str::upper(fake()->sentence(2)),
            'description' => Str::ucfirst(fake()->sentence(4)),
        ];
    }
}
