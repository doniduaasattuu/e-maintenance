<?php

namespace Tests\Concerns;

use App\Models\User;

trait InteractsWithPermissions
{
    protected function givePermission(User $user, string $permission): User
    {
        $user->givePermissionTo($permission);

        return $user;
    }
}
