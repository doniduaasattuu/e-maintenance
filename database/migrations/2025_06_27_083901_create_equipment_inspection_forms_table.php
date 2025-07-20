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
        Schema::create('equipment_inspection_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->nullable(false)->constrained('equipments')->cascadeOnUpdate()->cascadeOnDelete();
            $table->unsignedBigInteger('formable_id');
            $table->string('formable_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_inspection_forms');
    }
};
