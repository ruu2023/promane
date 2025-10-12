<?php

namespace App\Policies;

use App\Models\TaskLabel;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskLabelPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TaskLabel $taskLabel): bool
    {
        return $user->projects()->where('project_id', $taskLabel->project_id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TaskLabel $taskLabel): bool
    {
        return $user->projects()->where('project_id', $taskLabel->project_id)->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TaskLabel $taskLabel): bool
    {
        return $user->projects()
            ->where('project_id', $taskLabel->project_id)
            ->wherePivot('role', 'owner')
            ->exists();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TaskLabel $taskLabel): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TaskLabel $taskLabel): bool
    {
        return false;
    }
}
