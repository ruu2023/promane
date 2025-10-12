<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TaskLabel;
use Illuminate\Http\Request;

class TaskLabelController extends Controller
{
    public function index(Project $project)
    {
        return response()->json($project->labels()->orderBy('name')->get());
    }

    public function store(Request $request, Project $project)
    {
        $this->authorize('addLabel', $project);
        $validated = $request->validate(([
            'name' => ['required', 'string', 'max:50'],
            'color' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]));

        $label = $project->labels()->create([
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#999999',
        ]);

        return response()->json($label, 201);
    }

    public function show(TaskLabel $label)
    {
        $this->authorize('view', $label);
        return response()->json($label);
    }

    public function update(Request $request, TaskLabel $label)
    {
        $this->authorize('update', $label);
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:50'],
            'color' => ['nullable', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/']
        ]);

        $label->update($validated);

        return response()->json($label, 200);
    }

    public function destroy(TaskLabel $label)
    {
        $this->authorize('delete', $label);
        $label->delete();
        return response()->json(null, 204);
    }
}
