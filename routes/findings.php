<?php

use App\Http\Controllers\AbnormalityController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\CauseCodeController;
use App\Http\Controllers\FindingClauseController;
use App\Http\Controllers\FindingImageController;
use App\Http\Controllers\FindingPriorityController;
use App\Http\Controllers\FindingStatusController;
use App\Http\Controllers\FindingTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // EXPORT
    Route::get('audits/export', [AuditController::class, 'export'])->name('audits.export');
    Route::get('abnormalities/export', [AbnormalityController::class, 'export'])->name('abnormalities.export');

    // AUDIT
    Route::resource('audits', AuditController::class)->except('update');
    Route::post('audits/{finding}', [AuditController::class, 'update'])->name('audits.update');
    Route::post('audits/{finding}/close', [AuditController::class, 'close'])->name('audits.close');
    // ABNORMALITY
    Route::resource('abnormalities', AbnormalityController::class)->except('update');
    Route::post('abnormalities/{finding}', [AbnormalityController::class, 'update'])->name('abnormalities.update');
    Route::post('abnormalities/{finding}/close', [AbnormalityController::class, 'close'])->name('abnormalities.close');

    // FINDING TYPE
    Route::resource('finding-types', FindingTypeController::class)->except(['show']);
    // FINDING ClAUSE
    Route::resource('finding-clauses', FindingClauseController::class)->except(['show']);
    // FINDING STATUS
    Route::resource('finding-statuses', FindingStatusController::class)->except(['show']);
    // FINDING PRIORITY
    Route::resource('finding-priorities', FindingPriorityController::class)->except(['show']);
    // CAUSE CODE
    Route::resource('cause-codes', CauseCodeController::class)->except('show');
    Route::post('findings/{finding}/images', [FindingImageController::class, 'store'])->name('findings.images.store');
});
