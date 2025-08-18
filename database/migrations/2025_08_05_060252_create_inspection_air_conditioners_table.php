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
        Schema::create('inspection_air_conditioners', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_operational')->nullable(true);
            $table->boolean('is_drain_leaking')->nullable(true);
            $table->decimal('current_load', 5, 2)->nullable(true);
            $table->decimal('blowing_temperature', 5, 2)->nullable(true);
            $table->decimal('ambient_temperature', 5, 2)->nullable(true);
            $table->boolean('is_filter_clean')->nullable(true);
            $table->boolean('is_evaporator_clean')->nullable(true);
            $table->boolean('is_condensor_clean')->nullable(true);
            $table->foreignId('inspected_by')->nullable(true)->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_air_conditioners');
    }
};
