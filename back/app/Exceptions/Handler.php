<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\ExceptionHandler as BaseHandler;
use Throwable;

class Handler extends BaseHandler
{
    /**
     * 全例外を JSON で返す
     */
    public function render($request, Throwable $e)
    {
        return response()->json([
            'message' => $e->getMessage(),
            'exception' => class_basename($e),
        ], $this->isHttpException($e) ? $e->getStatusCode() : 500);
    }
}