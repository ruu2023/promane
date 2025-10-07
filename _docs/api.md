### ルーティング例（routes/api.php）

```php
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TaskLabelController;

Route::middleware('auth:sanctum')->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);

    // Project members
    Route::get('projects/{project}/members', [ProjectController::class, 'members']);
    Route::post('projects/{project}/members', [ProjectController::class, 'addMember']);
    Route::patch('projects/{project}/members/{user}', [ProjectController::class, 'updateMember']);
    Route::delete('projects/{project}/members/{user}', [ProjectController::class, 'removeMember']);

    // Tasks
    Route::apiResource('projects.tasks', TaskController::class); // ネストでプロジェクト配下のタスク

    // 今日やること
    Route::post('tasks/{task}/move-to-today', [TaskController::class, 'moveToToday']);
    Route::get('tasks/today', [TaskController::class, 'getTodayTasks']);

    // Task labels
    Route::apiResource('projects.labels', TaskLabelController::class)->shallow();

    // Task ↔ Labels attach/detach
    Route::post('tasks/{task}/labels/{label}', [TaskController::class, 'attachLabel']);
    Route::delete('tasks/{task}/labels/{label}', [TaskController::class, 'detachLabel']);

    // Comments
    Route::apiResource('tasks.comments', CommentController::class)->shallow();
});
```

### ProjectController

```php
<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // $this->authorize('viewAny', Project::class);
        $projects = Project::withCount('tasks')
            ->whereHas('users', fn($q) => $q->where('users.id', $request->user()->id))
            ->latest()
            ->paginate(20);

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        // $this->authorize('create', Project::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
        ]);

        $project = Project::create($validated);

        // 作成者を owner として紐付け
        $project->users()->attach($request->user()->id, [
            'role' => 'owner',
            'join_at' => now(),
        ]);

        return response()->json($project->load('users'), 201);
    }

    public function show(Request $request, Project $project)
    {
        // $this->authorize('view', $project);
        $project->load(['tasks', 'users']);
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        // $this->authorize('update', $project);
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    public function destroy(Request $request, Project $project)
    {
        // $this->authorize('delete', $project);
        $project->delete();
        return response()->json(null, 204);
    }

    // Members
    public function members(Request $request, Project $project)
    {
        // $this->authorize('viewMembers', $project);
        $members = $project->users()->withPivot('role', 'join_at', 'leave_at')->get();
        return response()->json($members);
    }

    public function addMember(Request $request, Project $project)
    {
        // $this->authorize('manageMembers', $project);
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
        // $this->authorize('manageMembers', $project);
        $data = $request->validate([
            'role' => ['required', 'in:owner,member,viewer'],
            'leave' => ['nullable', 'boolean'], // true なら leave_at セット
        ]);

        $attrs = ['role' => $data['role']];
        if (!empty($data['leave'])) {
            $attrs['leave_at'] = now();
        }

        $project->users()->updateExistingPivot($user->id, $attrs);

        return response()->json(['message' => 'Member updated']);
    }

    public function removeMember(Request $request, Project $project, User $user)
    {
        // $this->authorize('manageMembers', $project);
        $project->users()->detach($user->id);
        return response()->json(['message' => 'Member removed']);
    }
}
```

### TaskController

```php
<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskLabel;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        // $this->authorize('view', $project);
        $tasks = $project->tasks()
            ->with(['assignee', 'creator', 'labels'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->priority, fn($q) => $q->where('priority', $request->priority))
            ->latest()
            ->paginate(50);

        return response()->json($tasks);
    }

    public function store(Request $request, Project $project)
    {
        // $this->authorize('createTask', $project);
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

        $task = $project->tasks()->create(array_merge($validated, [
            'created_by' => $request->user()->id,
        ]));

        return response()->json($task->load(['assignee', 'creator', 'labels']), 201);
    }

    public function show(Project $project, Task $task)
    {
        // $this->authorize('view', $task);
        $task->load(['assignee', 'creator', 'labels', 'comments.user']);
        return response()->json($task);
    }

    public function update(Request $request, Project $project, Task $task)
    {
        // $this->authorize('update', $task);
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

    public function destroy(Project $project, Task $task)
    {
        // $this->authorize('delete', $task);
        $task->delete();
        return response()->json(null, 204);
    }

    // 今日やること
    public function moveToToday(Task $task)
    {
        // $this->authorize('update', $task);
        if ($task->is_today) {
            return response()->json(['message' => 'タスクは既に「今日やること」です'], 200);
        }
        $task->update(['is_today' => true]);
        return response()->json(['message' => '今日やることに移動しました'], 200);
    }

    public function getTodayTasks(Request $request)
    {
        $tasks = Task::today()
            ->where(function($query) use ($request) {
                $query->whereHas('project.users', fn($u) => $u->where('users.id', $request->user()->id))
                      ->orWhere('assigned_to', $request->user()->id);
            })
            ->with(['project', 'assignee'])
            ->get();

        return response()->json($tasks);
    }

    // Labels attach/detach
    public function attachLabel(Request $request, Task $task, TaskLabel $label)
    {
        // $this->authorize('update', $task);
        // 同一プロジェクトのラベルだけ付与できるようチェック
        abort_unless($task->project_id === $label->project_id, 422, 'Label belongs to different project');

        $task->labels()->syncWithoutDetaching([$label->id]);
        return response()->json(['message' => 'Label attached']);
    }

    public function detachLabel(Request $request, Task $task, TaskLabel $label)
    {
        // $this->authorize('update', $task);
        $task->labels()->detach($label->id);
        return response()->json(['message' => 'Label detached']);
    }
}
```

### CommentController

```php
<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Task $task)
    {
        // $this->authorize('view', $task);
        $comments = $task->comments()->with('user')->latest()->paginate(50);
        return response()->json($comments);
    }

    public function store(Request $request, Task $task)
    {
        // $this->authorize('comment', $task);
        $data = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $data['content'],
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function show(Task $task, Comment $comment)
    {
        // $this->authorize('view', $comment);
        return response()->json($comment->load('user'));
    }

    public function update(Request $request, Task $task, Comment $comment)
    {
        // $this->authorize('update', $comment);
        $data = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $comment->update($data);

        return response()->json($comment->load('user'));
    }

    public function destroy(Task $task, Comment $comment)
    {
        // $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json(null, 204);
    }
}
```

### TaskLabelController

```php
<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TaskLabel;
use Illuminate\Http\Request;

class TaskLabelController extends Controller
{
    public function index(Project $project)
    {
        // $this->authorize('view', $project);
        return response()->json($project->labels()->orderBy('name')->get());
    }

    public function store(Request $request, Project $project)
    {
        // $this->authorize('update', $project);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'color' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        $label = $project->labels()->create([
            'name' => $data['name'],
            'color' => $data['color'] ?? '#999999',
        ]);

        return response()->json($label, 201);
    }

    public function show(TaskLabel $label)
    {
        // $this->authorize('view', $label);
        return response()->json($label);
    }

    public function update(Request $request, TaskLabel $label)
    {
        // $this->authorize('update', $label);
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:50'],
            'color' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        $label->update($data);

        return response()->json($label);
    }

    public function destroy(TaskLabel $label)
    {
        // $this->authorize('delete', $label);
        $label->delete();
        return response()->json(null, 204);
    }
}
```

### モデル側に必要な補足（Project に labels リレーション）

TaskLabelController のために、Project モデルに labels() を追加しておきます。

```php
// app/Models/Project.php
public function labels()
{
    return $this->hasMany(\App\Models\TaskLabel::class);
}
```
