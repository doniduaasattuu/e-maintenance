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
        Schema::create('material_repository', function (Blueprint $table) {
            $table->foreignId('material_id')->nullable(false)->constrained('materials')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('repository_id')->nullable(false)->constrained('repositories')->cascadeOnUpdate()->cascadeOnDelete();
            $table->primary(['material_id', 'repository_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_repository');
    }
};
