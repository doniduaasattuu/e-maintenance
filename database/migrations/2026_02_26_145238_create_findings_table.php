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
        Schema::create('findings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('finding_type_id')->constrained('finding_types')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('finding_status_id')->constrained('finding_statuses')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('finding_priority_id')->constrained('finding_priorities')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('finding_clause_id')->constrained('finding_clauses')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('cause_code_id')->nullable()->constrained('cause_codes')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('work_center_id')->nullable()->constrained('work_centers')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('equipment_id')->nullable()->constrained('equipments')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('functional_location_id')->constrained('functional_locations')->cascadeOnUpdate()->restrictOnDelete();
            $table->text("description");
            $table->text("rectification_action")->nullable();
            $table->string("notification", 25)->nullable();
            $table->foreignId('inspected_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('rectified_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('verified_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
            $table->timestamp("closed_at")->nullable();

            $table->index(['finding_status_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('findings');
    }
};
