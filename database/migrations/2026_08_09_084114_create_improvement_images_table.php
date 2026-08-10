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
        Schema::create('improvement_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('improvement_id')->constrained('improvements')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('category', 25);
            $table->string('original_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('improvement_images');
    }
};
