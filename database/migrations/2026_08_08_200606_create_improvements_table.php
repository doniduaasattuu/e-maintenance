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
        Schema::create('improvements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('functional_location_id')->constrained('functional_locations')->restrictOnDelete();
            $table->foreignId('equipment_id')->nullable()->constrained('equipments')->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->foreignId('improvement_category_id')->constrained('improvement_categories')->restrictOnDelete();
            $table->foreignId('improvement_status_id')->constrained('improvement_statuses')->restrictOnDelete();
            $table->string('code', 30)->unique();
            $table->string('title', 50)->unique();
            $table->text('problem');
            $table->text('description');
            $table->text('root_cause');
            $table->text('expected_benefit')->nullable();
            $table->text('actual_benefit')->nullable();
            $table->timestamp('implementation_date')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('improvements');
    }
};
