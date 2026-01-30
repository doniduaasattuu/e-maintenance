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
        Schema::create('equipment_repository', function (Blueprint $table) {
            $table->foreignId('equipment_id')->nullable(false)->constrained('equipments')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('repository_id')->nullable(false)->constrained('repositories')->cascadeOnUpdate()->cascadeOnDelete();
            $table->primary(['equipment_id', 'repository_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_repository');
    }
};
