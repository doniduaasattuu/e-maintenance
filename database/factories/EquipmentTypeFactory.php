<?php

namespace Database\Factories;

use App\Models\EquipmentClass;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EquipmentType>
 */
class EquipmentTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'equipment_class_id' => EquipmentClass::factory()->create()->id,
            'code' => Str::upper(fake()->unique()->lexify('ZTYPE_P???')),
            'name' => Str::upper(fake()->sentence(1)),
            'description' => Str::ucfirst(fake()->sentence(5)),
        ];
    }
}
