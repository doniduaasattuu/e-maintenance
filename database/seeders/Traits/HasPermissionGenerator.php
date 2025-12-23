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

        foreach ($models as $model) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$action}_" . strtolower($model)
                ]);
            }
        }
    }
}
