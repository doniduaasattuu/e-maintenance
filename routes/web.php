<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ScannerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/', function () {
        return redirect('dashboard');
    })->name('home');

    // DASHBOARD
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // SCANNER
    Route::get('qr-scanner', [ScannerController::class, 'index'])->name('qr-scanner');
    Route::get('qr-scanner/{equipment_code}', [ScannerController::class, 'create'])->name('equipments.scan');

    // IMAGES 
    Route::prefix('images')->group(function () {
        Route::delete('{image}', [ImageController::class, 'destroy'])->name('images.destroy');
    });
});

require __DIR__ . '/functional-locations.php';
require __DIR__ . '/equipments.php';
require __DIR__ . '/materials.php';
require __DIR__ . '/findings.php';
require __DIR__ . '/repositories.php';
require __DIR__ . '/organizations.php';
require __DIR__ . '/inspection.php';
require __DIR__ . '/roles.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::fallback(function () {
    return abort(404);
});
