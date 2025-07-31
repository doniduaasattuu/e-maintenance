<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inspection_transformers', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_operational')->nullable(true);
            $table->boolean('is_clean')->nullable(true);
            $table->decimal('primary_current_r', 6, 2)->nullable(true);
            $table->decimal('primary_current_s', 6, 2)->nullable(true);
            $table->decimal('primary_current_t', 6, 2)->nullable(true);
            $table->decimal('primary_voltage_r', 7, 2)->nullable(true);
            $table->decimal('primary_voltage_s', 7, 2)->nullable(true);
            $table->decimal('primary_voltage_t', 7, 2)->nullable(true);
            $table->decimal('secondary_current_r', 6, 2)->nullable(true);
            $table->decimal('secondary_current_s', 6, 2)->nullable(true);
            $table->decimal('secondary_current_t', 6, 2)->nullable(true);
            $table->decimal('secondary_voltage_r', 7, 2)->nullable(true);
            $table->decimal('secondary_voltage_s', 7, 2)->nullable(true);
            $table->decimal('secondary_voltage_t', 7, 2)->nullable(true);
            $table->decimal('temperature_oil', 5, 2)->nullable(true);
            $table->decimal('temperature_winding', 5, 2)->nullable(true);
            $table->foreignId('desicant_level_id')->nullable(true)->constrained('quality_ratings')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_transformers');
    }
};
