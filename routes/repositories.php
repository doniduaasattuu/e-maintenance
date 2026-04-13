<?php

use App\Http\Controllers\RepositoryController;
use App\Http\Controllers\RepositoryEquipmentController;
use App\Http\Controllers\RepositoryMaterialController;
use App\Http\Controllers\RepositoryRelationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('repositories', RepositoryController::class)->except(['update']);
    Route::post('repositories/{repository}', [RepositoryController::class, 'update'])->name('repositories.update');

    Route::prefix('repositories')->group(function () {
        // RELATION
        Route::get('{repository}/relation', [RepositoryRelationController::class, 'index'])->name('repositories.relation');
        // RELATION EQUIPMENT
        Route::post('{repository}/equipment/{equipment}', [RepositoryEquipmentController::class, 'store'])->name('repositories.equipment.store');
        Route::delete('{repository}/equipment/{equipment}', [RepositoryEquipmentController::class, 'destroy'])->name('repositories.equipment.destroy');
        // RELATION MATERIAL
        Route::post('{repository}/material/{material}', [RepositoryMaterialController::class, 'store'])->name('repositories.material.store');
        Route::delete('{repository}/material/{material}', [RepositoryMaterialController::class, 'destroy'])->name('repositories.material.destroy');
    });
});
