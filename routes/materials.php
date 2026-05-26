<?php

use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentMaterialController;
use App\Http\Controllers\FindingEquipmentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MaterialTypeController;
use App\Http\Controllers\MaterialUnitController;
use App\Http\Controllers\RepositoryEquipmentController;
use App\Http\Controllers\RepositoryMaterialController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // EXPORT
    Route::get('materials/export', [MaterialController::class, 'export'])->name('materials.export');

    Route::resource('materials', MaterialController::class);

    Route::prefix('materials')->group(function () {
        // IMAGES
        Route::get('{id}/images/{type}', [ImageController::class, 'index'])->name('images.material.index');
        Route::post('{id}/images/{type}', [ImageController::class, 'store'])->name('images.material.store');
        // RELATION
        Route::get('{material}/repositories', [RepositoryMaterialController::class, 'show'])->name('materials.repositories');
    });

    // MATERIAL TYPE
    Route::get('material-types/export', [MaterialTypeController::class, 'export'])->name('material-types.export');
    Route::resource('material-types', MaterialTypeController::class);
    // MATERIAL UNIT
    Route::get('material-units/export', [MaterialUnitController::class, 'export'])->name('material-units.export');
    Route::resource('material-units', MaterialUnitController::class);
});
