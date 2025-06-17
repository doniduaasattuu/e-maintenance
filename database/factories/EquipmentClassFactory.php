<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EquipmentClass>
 */
class EquipmentClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'ZCLASS_' . Str::upper(fake()->randomLetter() . fake()->numerify('###')),
            'name' => fake()->sentence(2),
            'description' => fake()->sentence(5),
        ];
    }
}
