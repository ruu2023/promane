<?php

use App\Http\Controllers\ProjectController;
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
});
