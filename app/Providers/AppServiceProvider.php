<?php

namespace App\Providers;

use App\Policies\RolePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Role::class, RolePolicy::class);

        Relation::enforceMorphMap([
            'USER' => 'App\Models\User',
            'INSPECTION_MOTOR' => 'App\Models\InspectionMotor',
            'INSPECTION_PANEL' => 'App\Models\InspectionPanel',
            'INSPECTION_TRANSFORMER' => 'App\Models\InspectionTransformer',
            'INSPECTION_AIR_CONDITIONER' => 'App\Models\InspectionAirConditioner',
            'equipment' => 'App\Models\Equipment',
            'material' => 'App\Models\Material',
        ]);
    }
}
