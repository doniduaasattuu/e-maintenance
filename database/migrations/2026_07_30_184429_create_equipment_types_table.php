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
        Schema::create('equipment_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_class_id')
                ->constrained('equipment_classes')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('code', 30)->unique();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->boolean('is_active')
                ->default(true);
            $table->timestamps();
            $table->index([
                'equipment_class_id',
                'is_active',
            ]);
        });

        Schema::table('equipments', function (Blueprint $table) {
            $table->foreignId('equipment_type_id')
                ->nullable()
                ->after('equipment_status_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipments', function (Blueprint $table) {
            $table->dropColumn('equipment_status_id');
        });

        Schema::dropIfExists('equipment_types');
    }
};
