<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

Route::get('/error-test', function () {
    throw new Exception("テストエラー");
});


Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:15',
        'email' => 'required|string|email|max:50|unique:users,email',
        'password' => 'required|string|min:8',
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
});

Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => __('auth.failed'),
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});
