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
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000']
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content']
        ]);

        return response()->json($comment->load('user'), 201);
    }

    /**
     * @param Task $task ※(must)ルートモデルバインディングのスコープ解決にのみ使用
     * @param Comment $comment
     */
    public function show(Task $task, Comment $comment)
    {
        return response()->json($comment->load('user'));
    }
}
