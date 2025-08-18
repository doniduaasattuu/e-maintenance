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
        Schema::create('inspection_motors', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_operational')->nullable(true);
            $table->boolean('is_clean')->nullable(true);
            $table->unsignedInteger('number_of_greasing')->nullable(true);
            $table->decimal('temperature_de', 5, 2)->nullable(true);
            $table->decimal('temperature_body', 5, 2)->nullable(true);
            $table->decimal('temperature_nde', 5, 2)->nullable(true);
            $table->decimal('vibration_dev', 4, 2)->nullable(true);
            $table->decimal('vibration_deh', 4, 2)->nullable(true);
            $table->decimal('vibration_dea', 4, 2)->nullable(true);
            $table->decimal('vibration_def', 4, 2)->nullable(true);
            $table->boolean('is_noisy_de')->nullable(true);
            $table->decimal('vibration_ndev', 4, 2)->nullable(true);
            $table->decimal('vibration_ndeh', 4, 2)->nullable(true);
            $table->decimal('vibration_ndef', 4, 2)->nullable(true);
            $table->boolean('is_noisy_nde')->nullable(true);
            $table->foreignId('inspected_by')->nullable(true)->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_motors');
    }
};
