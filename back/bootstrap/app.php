<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, $request) {
        // API リクエストは必ず JSON で返す
        if ($request->is('api/*') || $request->expectsJson()) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
            ], method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500);
        }
        
        // それ以外はデフォルト処理
        return null;
    });
    })->create();
