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
        Schema::table('finding_priorities', function (Blueprint $table) {
            $table->unsignedTinyInteger('minimum_point')
                ->after('color_code');
            $table->unsignedTinyInteger('maximum_point')
                ->after('minimum_point');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('finding_priorities', function (Blueprint $table) {
            $table->dropColumn('minimum_point');
            $table->dropColumn('maximum_point');
        });
    }
};
