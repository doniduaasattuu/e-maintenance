<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EquipmentClassController;
use App\Http\Controllers\EquipmentController;
// use App\Http\Controllers\EquipmentImageController;
use App\Http\Controllers\EquipmentInspectionFormController;
use App\Http\Controllers\EquipmentStatusController;
use App\Http\Controllers\FunctionalLocationController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\InspectionAirConditionerController;
use App\Http\Controllers\InspectionMotorController;
use App\Http\Controllers\InspectionPanelController;
use App\Http\Controllers\InspectionTransformerController;
use App\Http\Controllers\InstallDismantleHistoryController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MaterialTypeController;
use App\Http\Controllers\ScannerController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkCenterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('welcome');

    return redirect('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // SCANNER
    Route::get('/qr-scanner', [ScannerController::class, 'index'])->name('qr-scanner');
    Route::get('/qr-scanner/{equipment_code}', [ScannerController::class, 'create'])->name('equipments.scan');

    Route::resource('roles', RoleController::class);
    Route::post('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::post('/users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::resource('/users', UserController::class)->except('update');

    // MASTER DATA
    Route::resource('/functional-locations', FunctionalLocationController::class);
    Route::resource('/equipments', EquipmentController::class);
    Route::resource('/materials', MaterialController::class);

    Route::get('/equipments/{equipment}/history', [InstallDismantleHistoryController::class, 'show'])->name('equipments.history');
    Route::resource('/equipment-histories', InstallDismantleHistoryController::class);

    // INSPECTION
    Route::get('/equipments/{equipment}/inspection', [EquipmentInspectionFormController::class, 'create'])->name('inspections.create');

    Route::prefix('inspection')->group(function () {
        // INSPECTION MOTOR
        Route::post('/motor', [InspectionMotorController::class, 'store'])->name('inspectionmotors.store');
        Route::get('/motor/{inspectionMotor}/edit', [InspectionMotorController::class, 'edit'])->name('inspectionmotors.edit');
        Route::patch('/motor/{inspectionMotor}', [InspectionMotorController::class, 'update'])->name('inspectionmotors.update');

        // INSPECTION PANEL
        Route::post('/panel', [InspectionPanelController::class, 'store'])->name('inspectionpanels.store');
        Route::get('/panel/{inspectionPanel}/edit', [InspectionPanelController::class, 'edit'])->name('inspectionpanels.edit');
        Route::patch('/panel/{inspectionPanel}', [InspectionPanelController::class, 'update'])->name('inspectionpanels.update');

        // INSPECTION TRANSFORMER
        Route::post('/transformer', [InspectionTransformerController::class, 'store'])->name('inspectiontransformers.store');
        Route::get('/transformer/{inspectionTransformer}/edit', [InspectionTransformerController::class, 'edit'])->name('inspectiontransformers.edit');
        Route::patch('/transformer/{inspectionTransformer}', [InspectionTransformerController::class, 'update'])->name('inspectiontransformers.update');

        // INSPECTION AIR CONDITIONER
        Route::post('/airconditioner', [InspectionAirConditionerController::class, 'store'])->name('inspectionairconditioners.store');
        Route::get('/airconditioner/{inspectionAirConditioner}/edit', [InspectionAirConditionerController::class, 'edit'])->name('inspectionairconditioners.edit');
        Route::patch('/airconditioner/{inspectionAirConditioner}', [InspectionAirConditionerController::class, 'update'])->name('inspectionairconditioners.update');
    });

    // EQUIPMENT CLASS
    Route::resource('/equipment-classes', EquipmentClassController::class);

    // EQUIPMENT STATUS
    Route::resource('/equipment-statuses', EquipmentStatusController::class);

    // MATERIAL TYPE
    Route::resource('/material-types', MaterialTypeController::class);

    // UNIT
    Route::resource('units', UnitController::class);

    // IMAGE CONTROLLER
    Route::prefix('images')->group(function () {
        Route::get('/{model}/{id}', [ImageController::class, 'index'])->name('images.index');
        Route::post('/{model}/{id}', [ImageController::class, 'store'])->name('images.store');
        Route::delete('/{image}', [ImageController::class, 'destroy'])->name('images.destroy');
    });

    // ORGANIZATIONS
    Route::prefix('organizations')->group(function () {
        // DEPARTMENT
        Route::resource('departments', DepartmentController::class)->names([
            'index' => 'departments.index',
            'create' => 'departments.create',
            'store' => 'departments.store',
            'edit' => 'departments.edit',
            'update' => 'departments.update',
            'destroy' => 'departments.destroy',
        ])->only([
            'index',
            'create',
            'store',
            'edit',
            'update',
            'destroy',
        ]);

        // DIVISION
        Route::resource('/organizations/divisions', DivisionController::class)->names([
            'index' => 'divisions.index',
            'create' => 'divisions.create',
            'store' => 'divisions.store',
            'edit' => 'divisions.edit',
            'update' => 'divisions.update',
            'destroy' => 'divisions.destroy',
        ])->only([
            'index',
            'create',
            'store',
            'edit',
            'update',
            'destroy',
        ]);

        // WORK CENTER
        Route::resource('/organizations/work-centers', WorkCenterController::class)->names([
            'index' => 'work-centers.index',
            'create' => 'work-centers.create',
            'store' => 'work-centers.store',
            'edit' => 'work-centers.edit',
            'update' => 'work-centers.update',
            'destroy' => 'work-centers.destroy',
        ])->only([
            'index',
            'create',
            'store',
            'edit',
            'update',
            'destroy',
        ]);
    });
});

Route::fallback(function () {
    return Inertia::render('errors/not-found', [], 404);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
