<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        $tasks = $project->tasks()
            ->with(['assignee', 'creator', 'labels'])
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->priority, fn ($q) => $q->where('priority', $request->priority))
            ->latest()
            ->paginate(50);

        return response()->json($tasks);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'in:backlog,in_progress,review,done'],
            'is_today' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $task = $project->tasks()->create($validated, [
            'created_by' => $request->user()->id,
        ]);

        return response()->json($task->load(['assignee', 'creator', 'labels']), 201);
    }
}
