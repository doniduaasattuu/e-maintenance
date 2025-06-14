<?php

namespace App\Http\Middleware;

use App\Events\UserActivityDetected;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()) {
            event(new UserActivityDetected($request->user()));
        }

        return $next($request);
    }
}
