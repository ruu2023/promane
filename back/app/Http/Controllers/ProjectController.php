<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // return response()->json($request->user()->id);
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
}
