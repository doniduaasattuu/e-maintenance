<?php

use App\Http\Controllers\EquipmentClassController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentInspectionFormController;
use App\Http\Controllers\EquipmentMaterialController;
use App\Http\Controllers\EquipmentStatusController;
use App\Http\Controllers\FindingEquipmentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\InstallDismantleHistoryController;
use App\Http\Controllers\RepositoryEquipmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('equipments', EquipmentController::class);
    // HISTORY
    Route::resource('equipment-histories', InstallDismantleHistoryController::class);
    Route::prefix('equipments')->group(function () {
        // IMAGES
        Route::get('{id}/images/{type}', [ImageController::class, 'index'])->name('images.equipment.index');
        Route::post('{id}/images/{type}', [ImageController::class, 'store'])->name('images.equipment.store');
        // RELATION
        Route::get('{equipment}/repositories', [RepositoryEquipmentController::class, 'show'])->name('equipments.repositories');
        Route::get('{equipment}/findings', [FindingEquipmentController::class, 'show'])->name('equipments.findings');
        Route::get('{equipment}/materials', [EquipmentMaterialController::class, 'show'])->name('equipments.materials');
        // MATERIALS
        Route::post('{equipment}/materials', [EquipmentMaterialController::class, 'store'])->name('equipments.materials.store');
        Route::delete('{equipment}/materials/{material}', [EquipmentMaterialController::class, 'destroy'])
            ->name('equipments.materials.destroy');
        Route::patch('{equipment}/materials/{material}', [EquipmentMaterialController::class, 'update'])
            ->name('equipments.materials.update');
        // HISTORY
        Route::get('{equipment}/history', [InstallDismantleHistoryController::class, 'show'])->name('equipments.history');
        // INSPECTION
        Route::get('{equipment}/inspection', [EquipmentInspectionFormController::class, 'create'])->name('inspections.create');
    });

    // EQUIPMENT CLASS
    Route::resource('equipment-classes', EquipmentClassController::class);
    // EQUIPMENT STATUS
    Route::resource('equipment-statuses', EquipmentStatusController::class);
});
