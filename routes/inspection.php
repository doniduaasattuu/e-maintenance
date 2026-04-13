<?php

use App\Http\Controllers\InspectionAirConditionerController;
use App\Http\Controllers\InspectionMotorController;
use App\Http\Controllers\InspectionPanelController;
use App\Http\Controllers\InspectionTransformerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('inspection')->group(function () {
        // MOTOR
        Route::post('motor', [InspectionMotorController::class, 'store'])->name('inspectionmotors.store');
        Route::get('motor/{inspectionMotor}/edit', [InspectionMotorController::class, 'edit'])->name('inspectionmotors.edit');
        Route::patch('motor/{inspectionMotor}', [InspectionMotorController::class, 'update'])->name('inspectionmotors.update');
        // PANEL
        Route::post('panel', [InspectionPanelController::class, 'store'])->name('inspectionpanels.store');
        Route::get('panel/{inspectionPanel}/edit', [InspectionPanelController::class, 'edit'])->name('inspectionpanels.edit');
        Route::patch('panel/{inspectionPanel}', [InspectionPanelController::class, 'update'])->name('inspectionpanels.update');
        // TRANSFORMER
        Route::post('transformer', [InspectionTransformerController::class, 'store'])->name('inspectiontransformers.store');
        Route::get('transformer/{inspectionTransformer}/edit', [InspectionTransformerController::class, 'edit'])->name('inspectiontransformers.edit');
        Route::patch('transformer/{inspectionTransformer}', [InspectionTransformerController::class, 'update'])->name('inspectiontransformers.update');
        // AIR CONDITIONER
        Route::post('airconditioner', [InspectionAirConditionerController::class, 'store'])->name('inspectionairconditioners.store');
        Route::get('airconditioner/{inspectionAirConditioner}/edit', [InspectionAirConditionerController::class, 'edit'])->name('inspectionairconditioners.edit');
        Route::patch('airconditioner/{inspectionAirConditioner}', [InspectionAirConditionerController::class, 'update'])->name('inspectionairconditioners.update');
    });
});
