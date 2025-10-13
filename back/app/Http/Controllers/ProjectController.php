<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::withCount('tasks')
            ->whereHas('users', fn ($q) => $q->where('users.id', $request->user()->id))
            ->latest()
            ->paginate(20);

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at']
        ]);

        $project = Project::create($validated);

        $project->users()->attach($request->user()->id, [
            'role' => 'owner',
            'join_at' => now(),
        ]);

        return response()->json($project->load('users'), 201);
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);
        $project->load(['tasks', 'users']);
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_at' => ['nullable', 'string'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at']
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        $project->delete();
        return response()->json(null, 204);
    }

    // Members
    public function members(Project $project)
    {
        $members = $project->users()->withPivot('role', 'join_at', 'leave_at')->get();
        return response()->json($members);
    }

    public function addMember(Request $request, Project $project)
    {
        $this->authorize('addMember', $project);
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['required', 'in:owner,member,viewer'],
        ]);

        $project->users()->syncWithoutDetaching([
            $data['user_id'] => ['role' => $data['role'], 'join_at' => now()]
        ]);

        return response()->json(['message' => 'Member added']);
    }

    public function updateMember(Request $request, Project $project, User $user)
    {
        $this->authorize('updateMember', $project);
        $data = $request->validate([
            'role' => ['required', 'in:owner,member,viewer'],
            'leave' => ['nullable', 'boolean'], // true で退場日をセット(leave_at)
        ]);

        $attrs = ['role' => $data['role']];
        if (!empty($data['leave'])) {
            $attrs['leave_at'] = now();
        }

        $project->users()->updateExistingPivot($user->id, $attrs);

        return response()->json(['message' => 'Member updated']);
    }

    public function removeMember(Project $project, User $user)
    {
        $this->authorize('removeMember', [$project, $user]);
        $project->users()->detach($user->id);
        return response()->json(['message' => 'Member removed']);
    }
}
