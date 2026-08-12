<?php

namespace App\Policies;

use App\Models\Improvement;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ImprovementPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('index_improvement');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Improvement $improvement): bool
    {
        return $user->can('show_improvement');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_improvement');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Improvement $improvement): bool
    {
        return $user->can('update_improvement') || $user->id === $improvement->created_by;
    }

    public function submit(User $user, Improvement $improvement): bool
    {
        return $user->can('submit_improvement') && $improvement->status?->name !== 'Submitted';
    }

    public function implement(User $user, Improvement $improvement): bool
    {
        return $user->can('implement_improvement') && $improvement->status?->name === 'Submitted';
    }

    public function approve(User $user, Improvement $improvement): bool
    {
        return $user->can('approve_improvement') && $improvement->status?->name === 'Implemented';
    }

    public function verify(User $user, Improvement $improvement): bool
    {
        return $user->can('verify_improvement') && $improvement->status?->name === 'Approved';
    }

    public function reject(User $user, Improvement $improvement): bool
    {
        return $user->can('reject_improvement')
            && in_array(
                $improvement->status?->name,
                ['Submitted', 'Implemented', 'Approved'],
                true
            );
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Improvement $improvement): bool
    {
        return $user->hasAnyPermission(['update_improvement']) || $user->id == $improvement->created_by || $user->id == $improvement->approved_by;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Improvement $improvement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Improvement $improvement): bool
    {
        return false;
    }
}
