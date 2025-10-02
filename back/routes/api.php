<?php

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
    // User Routes
    // Route::get('/users', [App\Http\Controllers\UserController::class, 'index']);
    // Route::get('/users/{id}', [App\Http\Controllers\UserController::class, 'show']);
    // Route::post('/users', [App\Http\Controllers\UserController::class, 'store']);
    // Route::put('/users/{id}', [App\Http\Controllers\UserController::class, 'update']);
    // Route::delete('/users/{id}', [App\Http\Controllers\UserController::class, 'destroy']);

    // // Project Routes
    // Route::get('/projects', [App\Http\Controllers\ProjectController::class, 'index']);
    // Route::get('/projects/{id}', [App\Http\Controllers\ProjectController::class, 'show']);
    // Route::post('/projects', [App\Http\Controllers\ProjectController::class, 'store']);
    // Route::put('/projects/{id}', [App\Http\Controllers\ProjectController::class, 'update']);
    // Route::delete('/projects/{id}', [App\Http\Controllers\ProjectController::class, 'destroy']);

    // // Task Routes
    // Route::get('/tasks', [App\Http\Controllers\TaskController::class, 'index']);
    // Route::get('/tasks/{id}', [App\Http\Controllers\TaskController::class, 'show']);
    // Route::post('/tasks', [App\Http\Controllers\TaskController::class, 'store']);
    // Route::put('/tasks/{id}', [App\Http\Controllers\TaskController::class, 'update']);
    // Route::delete('/tasks/{id}', [App\Http\Controllers\TaskController::class, 'destroy']);
});
