<?php

namespace App\Listeners;

use App\Events\UserActivityDetected;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateLastActivity
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserActivityDetected $event): void
    {
        $user = $event->user;

        if (
            !$user->last_activity ||
            $user->last_activity->lt(Carbon::now()->subMinute())
        ) {
            $user->update(['last_activity' => now()]);
        }
    }
}
