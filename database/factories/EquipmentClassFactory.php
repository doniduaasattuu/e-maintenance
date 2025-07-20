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
            'code' => 'ZCLASS_' . Str::upper(fake()->randomLetter() . fake()->unique()->numerify('###')),
            'name' => fake()->sentence(2),
            'formable' => fake()->sentence(1),
            'description' => Str::ucfirst(fake()->sentence(5)),
        ];
    }
}
