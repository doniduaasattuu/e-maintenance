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
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->string('code', 9)->unique();
            $table->string('sort_field', 50)->nullable();
            $table->string('description')->nullable();
            $table->foreignId('functional_location_id')->nullable()->constrained('functional_locations')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('equipment_class_id')->nullable()->constrained('equipment_classes')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('equipment_status_id')->nullable()->constrained('equipment_statuses')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
