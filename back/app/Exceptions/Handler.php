<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as BaseHandler;
use Throwable;

class Handler extends BaseHandler
{
    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    /**
     * 全例外を JSON で返す
     */
    public function render($request, Throwable $e)
    {
        $status = 500;
        if ($this->isHttpException($e)) {
            /** @var \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface $e */
            $status = $e->getStatusCode();
        }

        return response()->json([
            'message' => $e->getMessage(),
            'exception' => class_basename($e),
        ], $status);
    }
}
