<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EquipmentClassController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentImageController;
use App\Http\Controllers\EquipmentInspectionFormController;
use App\Http\Controllers\EquipmentStatusController;
use App\Http\Controllers\FunctionalLocationController;
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

    // INSPECTION MOTOR
    Route::post('/inspections/motor', [InspectionMotorController::class, 'store'])->name('inspectionmotors.store');
    Route::get('/inspections/motor/{inspectionMotor}/edit', [InspectionMotorController::class, 'edit'])->name('inspectionmotors.edit');
    Route::patch('/inspections/motor/{inspectionMotor}', [InspectionMotorController::class, 'update'])->name('inspectionmotors.update');

    // INSPECTION PANEL
    Route::post('/inspections/panel', [InspectionPanelController::class, 'store'])->name('inspectionpanels.store');
    Route::get('/inspections/panel/{inspectionPanel}/edit', [InspectionPanelController::class, 'edit'])->name('inspectionpanels.edit');
    Route::patch('/inspections/panel/{inspectionPanel}', [InspectionPanelController::class, 'update'])->name('inspectionpanels.update');

    // INSPECTION TRANSFORMER
    Route::post('/inspections/transformer', [InspectionTransformerController::class, 'store'])->name('inspectiontransformers.store');
    Route::get('/inspections/transformer/{inspectionTransformer}/edit', [InspectionTransformerController::class, 'edit'])->name('inspectiontransformers.edit');
    Route::patch('/inspections/transformer/{inspectionTransformer}', [InspectionTransformerController::class, 'update'])->name('inspectiontransformers.update');

    // INSPECTION AIR CONDITIONER
    Route::post('/inspections/airconditioner', [InspectionAirConditionerController::class, 'store'])->name('inspectionairconditioners.store');
    Route::get('/inspections/airconditioner/{inspectionAirConditioner}/edit', [InspectionAirConditionerController::class, 'edit'])->name('inspectionairconditioners.edit');
    Route::patch('/inspections/airconditioner/{inspectionAirConditioner}', [InspectionAirConditionerController::class, 'update'])->name('inspectionairconditioners.update');

    // EQUIPMENT CLASS
    Route::resource('/equipment-classes', EquipmentClassController::class);

    // EQUIPMENT STATUS
    Route::resource('/equipment-statuses', EquipmentStatusController::class);

    // MATERIAL TYPE
    Route::resource('/material-types', MaterialTypeController::class);

    // EQUIPMENT IMAGE
    Route::get('/equipments/{equipment}/image', [EquipmentImageController::class, 'index'])->name('equipments.image');
    Route::post('/equipments/{equipment}/image/store', [EquipmentImageController::class, 'store'])->name('equipment-image.store');
    Route::delete('/equipments/{equipment}/image/{image}', [EquipmentImageController::class, 'destroy'])->name('equipment-image.destroy');

    // DEPARTMENT
    Route::resource('/organizations/departments', DepartmentController::class)->names([
        'index' => 'departments.index',
        'create' => 'departments.create',
        'edit' => 'departments.edit',
        'update' => 'departments.update',
        'delete' => 'departments.delete',
    ]);

    // DIVISION
    Route::resource('/organizations/divisions', DivisionController::class)->names([
        'index' => 'divisions.index',
        'create' => 'divisions.create',
        'edit' => 'divisions.edit',
        'update' => 'divisions.update',
        'delete' => 'divisions.delete',
    ]);

    // WORK CENTER
    Route::resource('/organizations/work-centers', WorkCenterController::class)->names([
        'index' => 'work-centers.index',
        'create' => 'work-centers.create',
        'edit' => 'work-centers.edit',
        'update' => 'work-centers.update',
        'delete' => 'work-centers.delete',
    ]);

    Route::resource('units', UnitController::class);
});


Route::fallback(function () {
    return Inertia::render('errors/not-found', [], 404);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
