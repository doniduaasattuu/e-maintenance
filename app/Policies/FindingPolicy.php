<?php

namespace App\Policies;

use App\Models\Finding;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FindingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['index_finding', 'index_audit', 'index_abnormality']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Finding $finding): bool
    {
        return $user->id == $finding->inspected_by || $user->hasAnyPermission(['show_finding', 'show_audit', 'show_abnormality']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyPermission(['create_finding', 'create_audit', 'create_abnormality']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Finding $finding): bool
    {
        return $finding->inspected_by == $user->id || $user->hasAnyPermission(['update_finding', 'update_audit', 'update_abnormality']);
    }

    /**
     * Determine whether the user can close the finding.
     */
    public function close(User $user, Finding $finding): bool
    {
        return $user->department_id == $finding->department_id || $user->hasAnyPermission(['close_finding', 'close_audit', 'close_abnormality']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Finding $finding): bool
    {
        return $finding->inspected_by == $user->id || $user->hasAnyPermission(['delete_finding', 'delete_audit', 'delete_abnormality']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Finding $finding): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Finding $finding): bool
    {
        return false;
    }
}
