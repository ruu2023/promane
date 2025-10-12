<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
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
    public function view(User $user, Project $project): bool
    {
        return $user->projects()->where('project_id', $project->id)
                    ->exists();
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
    public function update(User $user, Project $project): bool
    {
        return $user->projects()->where('project_id', $project->id)
                    ->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->projects()->where('project_id', $project->id)
                    ->wherePivot('role', 'owner')
                    ->exists();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        return false;
    }

    public function addTask(User $user, Project $project): bool
    {
        return $user->projects()->where('project_id', $project->id)->exists();
    }

    public function addLabel(User $user, Project $project): bool
    {
        return $user->projects()->where('project_id', $project->id)->exists();
    }

    public function addMember(User $user, Project $project): bool
    {
        return $user->projects()->where('project_id', $project->id)->exists();
    }

    public function updateMember(User $user, Project $project): bool
    {
        return $user->projects()->where('project_id', $project->id)->exists();
    }

    public function removeMember(User $user, Project $project, User $memberToRemove): bool
    {
        $isOwner = $user->projects()->where('project_id', $project->id)
                        ->wherePivot('role', 'owner')
                        ->exists();

        if (!$isOwner) {
            return false;
        }

        // 自身の削除に対して、owner 不在を防止
        if ($user->id === $memberToRemove->id) {
            return $project->users()->withPivot('role', 'owner')->count() > 1;
        }

        return true;
    }
}
