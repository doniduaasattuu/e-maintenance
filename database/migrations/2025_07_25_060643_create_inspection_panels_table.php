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
        Schema::create('inspection_panels', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_operational')->nullable(true);
            $table->boolean('is_clean')->nullable(true);
            $table->decimal('temperature_incoming_r', 5, 2)->nullable(true);
            $table->decimal('temperature_incoming_s', 5, 2)->nullable(true);
            $table->decimal('temperature_incoming_t', 5, 2)->nullable(true);
            $table->decimal('temperature_cabinet', 5, 2)->nullable(true);
            $table->decimal('temperature_outgoing_r', 5, 2)->nullable(true);
            $table->decimal('temperature_outgoing_s', 5, 2)->nullable(true);
            $table->decimal('temperature_outgoing_t', 5, 2)->nullable(true);
            $table->decimal('current_r', 6, 2)->nullable(true);
            $table->decimal('current_s', 6, 2)->nullable(true);
            $table->decimal('current_t', 6, 2)->nullable(true);
            $table->foreignId('inspected_by')->nullable(true)->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_panels');
    }
};
