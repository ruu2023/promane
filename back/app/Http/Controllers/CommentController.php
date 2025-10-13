<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Task $task)
    {
        $comments = $task->comments()->with('user')->latest()->paginate(50);
        return response()->json($comments);
    }

    public function store(Request $request, Task $task)
    {
        $this->authorize('addComment', $task);
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000']
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content']
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function show(Comment $comment)
    {
        $this->authorize('view', $comment);
        return response()->json($comment->load('user'));
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000']
        ]);

        $comment->update($validated);
        return response()->json($comment->load('user'));
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json(null, 204);
    }
}
