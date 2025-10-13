<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskLabel;
use Carbon\Carbon;
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
        $this->authorize('addTask', $project);
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

        $task = $project->tasks()->create([
            ...$validated,
            'created_by' => $request->user()->id
        ]);

        return response()->json($task->load(['assignee', 'creator', 'labels']), 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        $task->load(['assignee', 'creator', 'labels', 'comments.user']);
        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'in:backlog,in_progress,review,done'],
            'is_today' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $task->update($validated);

        return response()->json($task->load(['assignee', 'creator', 'labels']));
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();
        return response()->json(null, 204);
    }

    // 今日やること
    public function moveToToday(Task $task)
    {
        $this->authorize('moveToToday', $task);
        if ($task->is_today) {
            return response()->json(['message' => 'タスクは既に「今日やること」です', 200]);
        }
        $task->update(['is_today' => true]);
        return response()->json(['message' => '今日やることに移動しました'], 200);
    }

    public function getTodayTasks(Request $request)
    {
        $tasks = Task::today()
            ->where(function ($query) use ($request) {
                $query->whereHas('project.users', fn ($u) => $u->where('users.id', $request->user()->id))
                    ->orWhere('assigned_to', $request->user()->id);
            })
            ->with(['project', 'assignee'])
            ->get();

        return response()->json($tasks);
    }

    // Labels attach/detach
    public function attachLabel(Task $task, TaskLabel $label)
    {
        $this->authorize('attachLabel', $task);
        // 同一プロジェクトのラベルだけ付与できるようチェック
        abort_unless($task->project_id === $label->project_id, 422, 'Label belongs to different project');

        $task->labels()->syncWithoutDetaching([$label->id]);
        return response()->json(['message' => 'label attached']);
    }

    public function detachLabel(Task $task, TaskLabel $label)
    {
        $this->authorize('detachLabel', $task);
        $task->labels()->detach($label->id);
        return response()->json(['message' => 'Label detached']);
    }
}
