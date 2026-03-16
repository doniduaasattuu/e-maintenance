<?php

namespace Database\Seeders\Traits;

use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

trait HasPermissionGenerator
{
    /**
     * Generate permissions based on model names and config actions.
     */
    public function generatePermissions(array $models): void
    {
        $actions = config('permission.actions');
        $customActions = config('permission.custom_actions');

        foreach ($models as $model) {
            $modelActions = array_merge($actions, $customActions[$model] ?? []);

            foreach ($modelActions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$action}_" . strtolower($model)
                ]);
            }
        }
    }
}
