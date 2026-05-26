<?php

use App\Http\Controllers\EquipmentInspectionFormController;
use App\Http\Controllers\InspectionAirConditionerController;
use App\Http\Controllers\InspectionMotorController;
use App\Http\Controllers\InspectionPanelController;
use App\Http\Controllers\InspectionTransformerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('inspection')->group(function () {
        // MOTOR
        Route::post('motor', [InspectionMotorController::class, 'store'])->name('inspectionmotors.store');
        // PANEL
        Route::post('panel', [InspectionPanelController::class, 'store'])->name('inspectionpanels.store');
        // TRANSFORMER
        Route::post('transformer', [InspectionTransformerController::class, 'store'])->name('inspectiontransformers.store');
        // AIR CONDITIONER      
        Route::post('airconditioner', [InspectionAirConditionerController::class, 'store'])->name('inspectionairconditioners.store');
    });

    Route::prefix('equipments/{equipment}')->group(function () {
        // MOTOR
        // Route::get('inspection/motor/{inspectionMotor}/edit', [InspectionMotorController::class, 'edit'])->name('inspectionmotors.edit');
        // Route::patch('inspection/motor/{inspectionMotor}', [InspectionMotorController::class, 'update'])->name('inspectionmotors.update');
        // // PANEL   
        // Route::get('inspection/panel/{inspectionPanel}/edit', [InspectionPanelController::class, 'edit'])->name('inspectionpanels.edit');
        // Route::patch('inspection/panel/{inspectionPanel}', [InspectionPanelController::class, 'update'])->name('inspectionpanels.update');
        // // TRANSFORMER
        // Route::get('inspection/transformer/{inspectionTransformer}/edit', [InspectionTransformerController::class, 'edit'])->name('inspectiontransformers.edit');
        // Route::patch('inspection/transformer/{inspectionTransformer}', [InspectionTransformerController::class, 'update'])->name('inspectiontransformers.update');
        // // AIR CONDITIONER
        // Route::get('inspection/ac/{inspectionAirConditioner}/edit', [InspectionAirConditionerController::class, 'edit'])->name('inspectionairconditioners.edit');
        // Route::patch('inspection/ac/{inspectionAirConditioner}', [InspectionAirConditionerController::class, 'update'])->name('inspectionairconditioners.update');

        // INSPECTION
        // Route::get('{equipment}/inspection', [EquipmentInspectionFormController::class, 'create'])->name('inspections.create');

        // STORE
        Route::prefix('inspection')->group(function () {
            // GET
            Route::get('', [EquipmentInspectionFormController::class, 'create'])->name('inspections.create');

            // MOTOR
            Route::get('motor/{inspectionMotor}/edit', [InspectionMotorController::class, 'edit'])->name('inspectionmotors.edit');
            Route::patch('motor/{inspectionMotor}', [InspectionMotorController::class, 'update'])->name('inspectionmotors.update');
            // PANEL   
            Route::get('panel/{inspectionPanel}/edit', [InspectionPanelController::class, 'edit'])->name('inspectionpanels.edit');
            Route::patch('panel/{inspectionPanel}', [InspectionPanelController::class, 'update'])->name('inspectionpanels.update');
            // TRANSFORMER
            Route::get('transformer/{inspectionTransformer}/edit', [InspectionTransformerController::class, 'edit'])->name('inspectiontransformers.edit');
            Route::patch('transformer/{inspectionTransformer}', [InspectionTransformerController::class, 'update'])->name('inspectiontransformers.update');
            // AIR CONDITIONER
            Route::get('ac/{inspectionAirConditioner}/edit', [InspectionAirConditionerController::class, 'edit'])->name('inspectionairconditioners.edit');
            Route::patch('ac/{inspectionAirConditioner}', [InspectionAirConditionerController::class, 'update'])->name('inspectionairconditioners.update');
        });
    });
});
