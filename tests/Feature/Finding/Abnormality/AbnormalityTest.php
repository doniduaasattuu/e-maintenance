<?php

use App\Models\CauseCode;
use App\Models\Department;
use App\Models\Equipment;
use App\Models\Finding;
use App\Models\FindingClause;
use App\Models\FindingImage;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\FindingType;
use App\Models\FunctionalLocation;
use App\Models\WorkCenter;
use Database\Seeders\CauseCodeSeeder;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\FindingClauseSeeder;
use Database\Seeders\FindingPrioritySeeder;
use Database\Seeders\FindingStatusSeeder;
use Database\Seeders\FindingTypeSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\MaterialUnitSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Finding', 'Audit', 'Abnormality']);
    Permission::findOrCreate('view_all_finding');

    $this->seed([
        FindingStatusSeeder::class,
        FindingTypeSeeder::class,
        FindingClauseSeeder::class,
        FindingPrioritySeeder::class,
        CauseCodeSeeder::class,
        UserSeeder::class,
        FunctionalLocationSeeder::class,
        EquipmentClassSeeder::class,
        EquipmentStatusSeeder::class,
        EquipmentSeeder::class,
        MaterialUnitSeeder::class,
        MaterialTypeSeeder::class,
        MaterialSeeder::class,
    ]);
});

test('abnormality index page accessible', function () {
    $admin = createAdminUser();
    $admin->givePermissionTo('view_all_finding');

    $abnormalities = Finding::factory()->count(15)->create([
        'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
    ]);

    $this->assertNotNull($abnormalities);
    $this->assertCount(15, $abnormalities);

    $response = $this
        ->actingAs($admin)
        ->get(route('abnormalities.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding/abnormality/index')
                ->has('findings.data')
        );
});

test('create abnormality page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('abnormalities.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('finding/abnormality/create')
        );
});

test('store abnormality successfully', function () {
    $image = UploadedFile::fake()->create('finding.jpeg', 100, 'image/jpeg');
    $description = fake()->sentence();
    expect($description)->toBeString();

    $department = Department::first();
    $workCenter = WorkCenter::factory()->create([
        'department_id' => $department->id,
    ]);

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('abnormalities.create'))
        ->post(route('abnormalities.store'), [
            'finding_clause_id'         => FindingClause::first()->id,
            'cause_code_id'             => CauseCode::first()->id,
            'description'               => $description,
            'functional_location_id'    => FunctionalLocation::first()->id,
            'department_id'             => $department->id,
            'work_center_id'            => $workCenter->id,
            'finding_status_id'         => FindingStatus::first()->id,
            'finding_priority_id'       => FindingPriority::first()->id,
            'images'                    => [$image],
        ]);

    $response
        ->assertRedirect(route('abnormalities.index'));

    $finding = Finding::where('description', $description)->first();
    expect($finding)->not()->toBeNull();
});

test('store abnormality fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('abnormalities.create'))
        ->post(route('abnormalities.store'), [
            'finding_clause_id'         => null,
            'cause_code_id'             => null,
            'description'               => null,
            'functional_location_id'    => null,
            'equipment_id'              => null,
            'department_id'             => Department::last('id')->id + 1,
            'work_center_id'            => WorkCenter::last('id')->id + 1,
            'finding_status_id'         => null,
            'finding_priority_id'       => null,
            'images'                    => [],
        ]);

    $response->assertSessionHasErrors([
        'finding_clause_id',
        'cause_code_id',
        'description',
        'functional_location_id',
        'department_id',
        'work_center_id',
        'finding_status_id',
        'finding_priority_id',
        'images',
    ]);
});

test('edit abnormality page accessible', function () {
    $finding = Finding::factory()->create([
        'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
    ]);

    $this
        ->actingAs(createAdminUser())
        ->get(route('abnormalities.edit', $finding->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding/abnormality/edit')
                ->has('finding.data')
                ->has('findingClauses.data')
                ->has('findingStatuses.data')
                ->has('findingPriorities.data')
                ->has('causeCodes.data')
                ->has('departments.data')
                ->has('workCenters.data')
                ->has('priorityScales.safety')
                ->has('priorityScales.quality')
                ->has('priorityScales.breakdown')
        );
});

test('update abnormality successfully', function () {
    $finding = Finding::factory()->create([
        'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
    ]);

    $this->withoutExceptionHandling();
    $department = Department::first();
    $workCenter = WorkCenter::factory()->create([
        'department_id' => $department->id,
    ]);

    $this
        ->actingAs(createAdminUser())
        ->from(route('abnormalities.edit', $finding->id))
        ->post(route('abnormalities.update', $finding->id), [
            'finding_clause_id'         => FindingClause::first()->id,
            'cause_code_id'             => CauseCode::first()->id,
            'description'               => 'New description of finding abnormality',
            'functional_location_id'    => FunctionalLocation::first()->id,
            'department_id'             => $department->id,
            'equipment_id'              => Equipment::first()->id,
            'work_center_id'            => $workCenter->id,
            'finding_status_id'         => FindingStatus::first()->id,
            'finding_priority_id'       => FindingPriority::first()->id,
        ])
        ->assertStatus(302)
        ->assertRedirect(route('abnormalities.edit', $finding->id));

    $finding->refresh();
    expect($finding->description)->toBe('New description of finding abnormality');
});

test('update abnormality fails validation', function () {
    $finding = Finding::factory()->create();
    $image1 = UploadedFile::fake()->create('finding1.jpeg', 100, 'image/jpeg');
    $image2 = UploadedFile::fake()->create('finding1.jpeg', 100, 'image/jpeg');
    $image3 = UploadedFile::fake()->create('finding1.jpeg', 100, 'image/jpeg');
    $image4 = UploadedFile::fake()->create('finding1.jpeg', 100, 'image/jpeg');
    $image5 = UploadedFile::fake()->create('finding1.jpeg', 100, 'image/jpeg');
    $image6 = UploadedFile::fake()->create('finding1.jpeg', 100, 'image/jpeg');

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('abnormalities.edit', $finding->id))
        ->post(route('abnormalities.update', $finding->id), [
            'finding_clause_id'         => null,
            'description'               => null,
            'functional_location_id'    => null,
            'department_id'             => Department::last('id')->id + 1,
            'work_center_id'            => WorkCenter::last('id')->id + 1,
            'finding_status_id'         => null,
            'finding_priority_id'       => null,
            'images'                    => [
                $image1,
                $image2,
                $image3,
                $image4,
                $image5,
                $image6,
            ],
        ]);

    $response->assertSessionHasErrors([
        'finding_clause_id',
        'description',
        'functional_location_id',
        'department_id',
        'work_center_id',
        'finding_status_id',
        'finding_priority_id',
        'images',
    ]);
});

test('can resolve abnormality finding', function () {
    $admin = createAdminUser();
    $openStatus = FindingStatus::where('name', 'Open')->first();
    $reviewStatus = FindingStatus::where('name', 'Review')->first();
    $image = UploadedFile::fake()->create('finding.jpeg', 100, 'image/jpeg');

    $finding = Finding::factory()->create([
        'finding_status_id' => $openStatus->id,
    ]);

    $this
        ->actingAs($admin)
        ->post(route('findings.images.store', $finding->id), [
            'rectification_action' => 'Close finding dengan action yang dijelaskan pada textarea',
            'closed_at' => \Carbon\Carbon::now()->format('Y-m-d H:i:s'),
            'images' => [$image],
        ])
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Photos uploaded successfully.',
        ]);

    $finding->refresh();
    $this->assertEquals($finding->status->id, $reviewStatus->id);
});

test('can close abnormality finding', function () {
    $admin = createAdminUser();
    $reviewStatus = FindingStatus::where('name', 'Review')->first();
    $closedStatus = FindingStatus::where('name', 'Closed')->first();

    $finding = Finding::factory()->create([
        'finding_status_id' => $reviewStatus->id,
    ]);

    FindingImage::create([
        'finding_id' => $finding->id,
        'file_path' => fake()->filePath(),
        'category' => 'after',
        'original_name' => fake()->word(),
    ]);

    Permission::findOrCreate('close_audit');
    $admin->givePermissionTo('close_audit');

    $this
        ->actingAs($admin)
        ->post(route('abnormalities.close', $finding->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Finding has been mark as Closed. The finding is archived.',
        ]);

    $finding->refresh();
    $this->assertEquals($finding->status->id, $closedStatus->id);
});

test('can delete abnormality finding', function () {
    $finding = Finding::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('abnormalities.index'))
        ->delete(route('abnormalities.destroy', $finding->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Abnormality and photos deleted successfully.',
        ]);

    expect(Finding::find($finding->id))->toBeNull();
});
