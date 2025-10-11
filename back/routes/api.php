<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/**
 * API Test Routes
 */
Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});
Route::get('/error-test', function () {
    throw new Exception("テストエラー");
});

/**
 * Authentication Routes
*/
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/me', [App\Http\Controllers\AuthController::class, 'me']);

/**
 * Protected Routes
 */
Route::middleware('auth:sanctum')->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);

    // Project members
    Route::get('projects/{project}/members', [ProjectController::class, 'members']);
    Route::post('projects/{project}/members', [ProjectController::class, 'addMember']);
    Route::patch('projects/{project}/members/{user}', [ProjectController::class, 'updateMember']);
    Route::delete('projects/{project}/members/{user}', [ProjectController::class, 'removeMember']);

    // Tasks
    Route::apiResource('projects.tasks', TaskController::class); // ネストでプロジェクト配下

    // 今日やること
    Route::post('tasks/{task}/move-to-today', [TaskController::class, 'moveToToday']);
    Route::get('tasks/today', [TaskController::class, 'getTodayTasks']);

    // Comments
    Route::apiResource('tasks.comments', CommentController::class)->shallow();
});
