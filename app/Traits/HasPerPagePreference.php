<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait HasPerPagePreference
{
    /**
     * Get the validated per_page value from request or session.
     */
    protected function getPerPage(Request $request, int $default = 10): int
    {
        $allowed = [10, 25, 50, 100, 250];

        $perPage = $request->input('per_page')
            ?? $request->session()->get('per_page_pref', $default);

        if (!in_array((int) $perPage, $allowed)) {
            $perPage = $default;
        }

        $request->session()->put('per_page_pref', (int) $perPage);

        return (int) $perPage;
    }
}
