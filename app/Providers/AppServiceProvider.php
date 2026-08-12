<?php

namespace App\Providers;

use App\Models\Finding;
use App\Models\Improvement;
use App\Models\Repository;
use App\Models\User;
use App\Policies\FindingPolicy;
use App\Policies\ImprovementPolicy;
use App\Policies\RepositoryPolicy;
use App\Policies\RolePolicy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        Gate::before(function (User $user, string $ability) {
            if ($user->isAdministrator()) {
                return true;
            }
        });

        Builder::macro('last', function (string $column = null) {
            return $this->latest($column)->first();
        });

        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Finding::class, FindingPolicy::class);
        Gate::policy(Repository::class, RepositoryPolicy::class);
        Gate::policy(Improvement::class, ImprovementPolicy::class);

        Relation::enforceMorphMap([
            'USER' => 'App\Models\User',
            'INSPECTION_MOTOR' => 'App\Models\InspectionMotor',
            'INSPECTION_PANEL' => 'App\Models\InspectionPanel',
            'INSPECTION_TRANSFORMER' => 'App\Models\InspectionTransformer',
            'INSPECTION_AIR_CONDITIONER' => 'App\Models\InspectionAirConditioner',
            'functional-location' => 'App\Models\FunctionalLocation',
            'equipment' => 'App\Models\Equipment',
            'material' => 'App\Models\Material',
        ]);

        DB::listen(function ($query) {
            Log::info($query->sql); // The SQL string
        });
    }
}
