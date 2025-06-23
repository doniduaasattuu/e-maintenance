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
        Schema::create('install_dismantle_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained('equipments')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('from_status_id')->constrained('equipment_statuses')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('to_status_id')->constrained('equipment_statuses')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('functional_location_id')->nullable()->constrained('functional_locations')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('changed_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamp('changed_at')->useCurrent();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('install_dismantle_histories');
    }
};
