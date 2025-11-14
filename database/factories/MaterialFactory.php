<?php

namespace Database\Factories;

use App\Models\MaterialType;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Material>
 */
class MaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->numerify('1001####'),
            'name' => fake()->unique()->sentence(),
            'price' => fake()->numberBetween(0, 1000) * 1000,
            'unit_id' => Unit::all()->random()->id,
            'material_type_id' => MaterialType::all()->random()->id,
        ];
    }
}
