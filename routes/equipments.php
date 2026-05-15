<?php

use App\Http\Controllers\EquipmentClassController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentInspectionFormController;
use App\Http\Controllers\EquipmentMaterialController;
use App\Http\Controllers\EquipmentStatusController;
use App\Http\Controllers\EquipmentFindingController;
use App\Http\Controllers\EquipmentTrendController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\InstallDismantleHistoryController;
use App\Http\Controllers\RepositoryEquipmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // TREND
    Route::get('equipments/{equipment}/trend', [EquipmentTrendController::class, 'show'])->name('equipments.trend');
    // TREND EXPORT
    // Route::get('equipments/{equipment}/trend/export', [EquipmentTrendController::class, 'export'])->name('equipments.trend.export');

    // EXPORT
    Route::get('equipments/export', [EquipmentController::class, 'export'])->name('equipments.export');
    Route::get('equipments/findings/export', [EquipmentController::class, 'equipmentFindingExport'])->name('equipments.findings.export');

    Route::resource('equipments', EquipmentController::class);
    // HISTORY
    Route::get('equipment-histories/export', [InstallDismantleHistoryController::class, 'export'])->name('equipment-histories.export');
    Route::resource('equipment-histories', InstallDismantleHistoryController::class);
    Route::prefix('equipments')->group(function () {
        // IMAGES
        Route::get('{id}/images/{type}', [ImageController::class, 'index'])->name('images.equipment.index');
        Route::post('{id}/images/{type}', [ImageController::class, 'store'])->name('images.equipment.store');
        // RELATION
        Route::get('{equipment}/repositories', [RepositoryEquipmentController::class, 'show'])->name('equipments.repositories');
        Route::get('{equipment}/findings', [EquipmentFindingController::class, 'show'])->name('equipments.findings');
        Route::get('{equipment}/materials', [EquipmentMaterialController::class, 'show'])->name('equipments.materials');
        // MATERIALS
        Route::get('{equipment}/materials/export', [EquipmentMaterialController::class, 'export'])->name('equipments.materials.export');
        Route::post('{equipment}/materials', [EquipmentMaterialController::class, 'store'])->name('equipments.materials.store');
        Route::delete('{equipment}/materials/{material}', [EquipmentMaterialController::class, 'destroy'])
            ->name('equipments.materials.destroy');
        Route::patch('{equipment}/materials/{material}', [EquipmentMaterialController::class, 'update'])
            ->name('equipments.materials.update');
        // HISTORY
        Route::get('{equipment}/history', [InstallDismantleHistoryController::class, 'show'])->name('equipments.history');
    });

    // EQUIPMENT CLASS
    Route::get('equipment-classes/export', [EquipmentClassController::class, 'export'])->name('equipment-classes.export');
    Route::resource('equipment-classes', EquipmentClassController::class);
    // EQUIPMENT STATUS
    Route::get('equipment-statuses/export', [EquipmentStatusController::class, 'export'])->name('equipment-statuses.export');
    Route::resource('equipment-statuses', EquipmentStatusController::class);
});
