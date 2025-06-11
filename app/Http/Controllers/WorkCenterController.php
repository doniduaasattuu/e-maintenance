<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkCenterResource;
use App\Models\WorkCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $workCenters = WorkCenter::search($request)->paginate()->withQueryString();

        return Inertia::render('work-center/index', [
            'workCenters' => WorkCenterResource::collection($workCenters),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkCenter $workCenter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkCenter $workCenter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WorkCenter $workCenter)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkCenter $workCenter)
    {
        //
    }
}
