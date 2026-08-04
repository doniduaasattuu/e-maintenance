<?php

use Tests\Support\ExportDefinition;
use App\Exports\ArchivedFindingExport;
use App\Exports\CauseCodeExport;
use App\Exports\DepartmentExport;
use App\Exports\DivisionExport;
use App\Exports\EquipmentClassExport;
use App\Exports\EquipmentExport;
use App\Exports\EquipmentMaterialExport;
use App\Exports\EquipmentStatusExport;
use App\Exports\FindingClauseExport;
use App\Exports\FindingExport;
use App\Exports\FindingMomExport;
use App\Exports\FindingPriorityExport;
use App\Exports\FindingStatusExport;
use App\Exports\FindingTypeExport;
use App\Exports\FunctionalLocationExport;
use App\Exports\InstallDismantleHistoryExport;
use App\Exports\MaterialExport;
use App\Exports\MaterialTypeExport;
use App\Exports\MaterialUnitExport;
use App\Exports\RepositoryExport;
use App\Exports\UserExport;
use App\Exports\WorkCenterExport;
use App\Models\CauseCode;
use App\Models\Department;
use App\Models\Division;
use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\Finding;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\FindingType;
use App\Models\FunctionalLocation;
use App\Models\InstallDismantleHistory;
use App\Models\Material;
use App\Models\MaterialType;
use App\Models\MaterialUnit;
use App\Models\Repository;
use App\Models\User;
use App\Models\WorkCenter;
use Database\Seeders\CauseCodeSeeder;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentMaterialSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\EquipmentTypeSeeder;
use Database\Seeders\FindingClauseSeeder;
use Database\Seeders\FindingPrioritySeeder;
use Database\Seeders\FindingStatusSeeder;
use Database\Seeders\FindingTypeSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Database\Seeders\InstallDismantleHistorySeeder;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\MaterialUnitSeeder;
use Database\Seeders\RepositorySeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\WorkCenterSeeder;

dataset('exports', [
    'divisions' => new ExportDefinition(
        factory: fn() => new DivisionExport(),
        setup: fn() => null,
        modelFactory: fn() => Division::factory()->create(),
        title: 'divisions',
        headings: [
            'id',
            'code',
            'name',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {
            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->name,
                    $model->created_at?->format('Y-d-m h:i:s'),
                    $model->updated_at?->format('Y-d-m h:i:s'),
                ]);
        }
    ),

    'departments' => new ExportDefinition(
        factory: fn() => new DepartmentExport(),
        setup: fn() => null,
        modelFactory: fn() => Department::factory()->create(),
        title: 'departments',
        headings: [
            'id',
            'code',
            'name',
            'division_id',
            'created_at',
            'updated_at',
        ],

        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->name,
                    $model->division_id,
                    $model->created_at?->format('Y-d-m h:i:s'),
                    $model->updated_at?->format('Y-d-m h:i:s'),
                ]);
        }

    ),

    'users' => new ExportDefinition(
        factory: fn() => new UserExport([]),
        setup: fn() => null,
        modelFactory: fn() => User::factory()->create(),
        title: 'users',
        headings: [
            'ID',
            'Employee ID',
            'Name',
            'Email',
            'Phone Number',
            'Department',
            'Position',
            'Work Center',
        ],

        mappingAssertion: function ($export, $model) {
            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->employee_id,
                    $model->name,
                    $model->email,
                    $model->phone_number ?? '-',
                    $model->department?->name ?? '-',
                    $model->position?->name ?? '-',
                    $model->workCenter?->name ?? '-',
                ]);
        }

    ),

    'archivedFindings' => new ExportDefinition(
        factory: fn() => new ArchivedFindingExport([
            'start_date' => null,
            'end_date' => null,
        ]),
        title: 'archived_findings',
        setup: fn($test) => $test->seed([
            FindingStatusSeeder::class,
            FindingTypeSeeder::class,
            FindingClauseSeeder::class,
            FindingPrioritySeeder::class,
            CauseCodeSeeder::class,
            UserSeeder::class,
            FunctionalLocationSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentTypeSeeder::class,
            EquipmentSeeder::class,
            MaterialUnitSeeder::class,
            MaterialTypeSeeder::class,
            MaterialSeeder::class,
        ]),
        modelFactory: function () {
            return Finding::factory()->create([
                'finding_status_id' => FindingStatus::where('name', 'Closed')->value('id'),
                'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
            ]);
        },
        headings: [
            'ID',
            'Date',
            'Type',
            'Status',
            'Clause Code',
            'Clause Description',
            'Cause Code',
            'Cause Description',
            'Priority',
            'Equipment',
            'Equipment Description',
            'Plant',
            'Funcloc',
            'Funcloc Description',
            'Finding Description',
            'Department',
            'Work Center',
            'Rectification Plan',
            'Inspector',
            'Action By',
            'Verified By',
            'Created Date',
            'Approved Date',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->created_at->format('d-M-y'),
                    $model->type->name ?? '-',
                    $model->status->name ?? '-',
                    $model->clause->code ?? '-',
                    $model->clause->description ?? '-',
                    $model->causeCode->code ?? '-',
                    $model->causeCode->description ?? '-',
                    $model->priority->label ?? '-',
                    $model->equipment->code ?? 'N/A',
                    $model->equipment->description ?? 'N/A',
                    $model->functionalLocation->code ? (substr($model->functionalLocation->code ?? '-', 0, 5) ?? '-') : '-',
                    $model->functionalLocation->code ?? '-',
                    $model->functionalLocation->description ?? '-',
                    $model->description,
                    $model->department->name ?? '-',
                    $model->workCenter->name ?? '-',
                    $model->rectification_action ?? '-',
                    $model->inspector->name ?? '-',
                    $model->rectifier->name ?? '-',
                    $model->verifier->name ?? '-',
                    $model->created_at
                        ? $model->created_at->format('d-M-y')
                        : '-',
                    $model->closed_at
                        ? $model->closed_at->format('d-M-y')
                        : '-',
                ]);
        }
    ),

    'causeCodes' => new ExportDefinition(
        factory: fn() => new CauseCodeExport(),
        title: 'cause_codes',
        setup: fn($test) => $test->seed([
            CauseCodeSeeder::class,
        ]),
        modelFactory: function () {
            return CauseCode::first();
        },
        headings: [
            'id',
            'code',
            'description',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->description,
                    $model->created_at
                        ? $model->created_at->format('Y-d-m h:i:s')
                        : '-',
                    $model->updated_at
                        ? $model->updated_at->format('Y-d-m h:i:s')
                        : '-',
                ]);
        }
    ),

    'equipmentClass' => new ExportDefinition(
        factory: fn() => new EquipmentClassExport(),
        title: 'equipment_classes',
        setup: fn($test) => $test->seed([
            EquipmentClassSeeder::class,
        ]),
        modelFactory: function () {
            return EquipmentClass::first();
        },
        headings: [
            'id',
            'code',
            'name',
            'formable_type',
            'description',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->name,
                    $model->formable_type,
                    $model->description,
                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'equipments' => new ExportDefinition(
        factory: fn() => new EquipmentExport([
            'start_date' => null,
            'end_date' => null,
            'functional_location_id' => null,
        ]),
        title: 'equipments',
        setup: fn($test) => $test->seed([
            FunctionalLocationSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentTypeSeeder::class,
            EquipmentSeeder::class,
        ]),
        modelFactory: function () {
            return Equipment::first();
        },
        headings: [
            'ID',
            'Code',
            'Sort field',
            'Description',
            'Class',
            'Status',
            'Funcloc',
            'Funcloc Description',
            'Created at',
            'Updated at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model?->sort_field ?? '-',
                    $model?->description ?? '-',

                    $model?->eclass?->name ?? '-',
                    $model?->status?->name ?? '-',

                    $model?->functionalLocation?->code ?? 'N/A',
                    $model?->functionalLocation?->description ?? 'N/A',

                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'equipmentMaterials' => new ExportDefinition(
        factory: fn(Equipment $equipment) => new EquipmentMaterialExport($equipment),
        title: 'equipment_materials',
        setup: fn($test) => $test->seed([
            FunctionalLocationSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentSeeder::class,
            MaterialUnitSeeder::class,
            MaterialTypeSeeder::class,
            MaterialSeeder::class,
            EquipmentMaterialSeeder::class,
        ]),

        modelFactory: function () {

            $equipment = Equipment::with('materials.type', 'materials.unit')
                ->has('materials')
                ->first();

            expect($equipment)->not->toBeNull();

            expect($equipment->materials)->not->toBeEmpty();

            return $equipment;
        },


        headings: [
            'ID',
            'Code',
            'Name',
            'Price',
            'Qty',
            'Note',
            'Type',
            'Type Description',
            'Unit',
            'Created at',
            'Updated at',
        ],

        mappingAssertion: function ($export, Equipment $equipment) {

            $material = $equipment->materials->first();

            expect($export->map($material))
                ->toBe([
                    $material->id,
                    $material->code,
                    $material->name,
                    $material->price ?? '-',

                    $material->pivot?->quantity ?? '1',
                    $material->pivot?->note ?? '-',

                    $material->type?->code ?? '-',
                    $material->type?->description ?? '-',
                    $material->unit?->name ?? '-',

                    $material->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $material->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'equipmentStatus' => new ExportDefinition(
        factory: fn() => new EquipmentStatusExport(),
        title: 'equipment_statuses',
        setup: fn($test) => $test->seed([
            EquipmentStatusSeeder::class,
        ]),
        modelFactory: function () {
            return EquipmentStatus::first();
        },
        headings: [
            'id',
            'code',
            'name',
            'description',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->name,
                    $model->description,
                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'findingClause' => new ExportDefinition(
        factory: fn() => new FindingClauseExport(),
        title: 'finding_clauses',
        setup: fn($test) => $test->seed([
            FindingClauseSeeder::class,
        ]),
        modelFactory: function () {
            return FindingClause::first();
        },
        headings: [
            'id',
            'code',
            'type',
            'title',
            'description',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->type,
                    $model->title,
                    $model->description,
                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'findings' => new ExportDefinition(
        factory: fn() => new FindingExport([
            'start_date' => null,
            'end_date' => null,
            'type_id' => null,
            'functional_location_id' => null,
            'equipment_id' => null,
            'status_ids' => null,
            'department_ids' => null,
            'priority_ids' => null,
        ]),
        title: 'findings',
        setup: fn($test) => $test->seed([
            FindingStatusSeeder::class,
            FindingTypeSeeder::class,
            FindingClauseSeeder::class,
            FindingPrioritySeeder::class,
            CauseCodeSeeder::class,
            UserSeeder::class,
            FunctionalLocationSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentTypeSeeder::class,
            EquipmentSeeder::class,
            MaterialUnitSeeder::class,
            MaterialTypeSeeder::class,
            MaterialSeeder::class,
        ]),
        modelFactory: function () {
            return Finding::factory()->create([
                'finding_status_id' => FindingStatus::where('name', 'Open')->value('id'),
                'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
            ]);
        },
        headings: [
            'ID',
            'Date',
            'Type',
            'Status',
            'Clause Code',
            'Clause Description',
            'Cause Code',
            'Cause Description',
            'Priority',
            'Equipment',
            'Equipment Description',
            'Plant',
            'Funcloc',
            'Funcloc Description',
            'Finding Description',
            'Department',
            'Work Center',
            'Rectification Plan',
            'Inspected By',
            'Action By',
            'Verified By',
            'Created Date',
            'Approved Date',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->created_at->format('d-M-y'),
                    $model->type->name ?? '-',
                    $model->status->name ?? '-',
                    $model->clause->code ?? '-',
                    $model->clause->description ?? '-',
                    $model->causeCode->code ?? '-',
                    $model->causeCode->description ?? '-',
                    $model->priority->label ?? '-',
                    $model->equipment->code ?? 'N/A',
                    $model->equipment->description ?? 'N/A',
                    $model->functionalLocation->code ? (substr($model->functionalLocation->code ?? '-', 0, 5) ?? '-') : '-',
                    $model->functionalLocation->code ?? '-',
                    $model->functionalLocation->description ?? '-',
                    $model->description,
                    $model->department->name ?? '-',
                    $model->workCenter->name ?? '-',
                    $model->rectification_action ?? '-',
                    $model->inspector->name ?? '-',
                    $model->rectifier->name ?? '-',
                    $model->verifier->name ?? '-',
                    $model->created_at
                        ? $model->created_at->format('d-M-y')
                        : '-',
                    $model->closed_at
                        ? $model->closed_at->format('d-M-y')
                        : '-',
                ]);
        }


    ),

    'momsFindings' => new ExportDefinition(
        factory: fn() => new FindingMomExport([
            'start_date' => null,
            'end_date' => null,
            'type_id' => null,
            'functional_location_id' => null,
            'equipment_id' => null,
            'status_ids' => null,
            'department_ids' => null,
            'priority_ids' => null,
        ]),
        title: 'moms_findings',
        setup: fn($test) => $test->seed([
            FindingStatusSeeder::class,
            FindingTypeSeeder::class,
            FindingClauseSeeder::class,
            FindingPrioritySeeder::class,
            CauseCodeSeeder::class,
            UserSeeder::class,
            FunctionalLocationSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentTypeSeeder::class,
            EquipmentSeeder::class,
            MaterialUnitSeeder::class,
            MaterialTypeSeeder::class,
            MaterialSeeder::class,
        ]),
        modelFactory: function () {
            return Finding::factory()->create([
                'finding_status_id' => FindingStatus::where('name', 'Closed')->value('id'),
                'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
                'created_at' => now()->subDays(2),
            ]);
        },
        headings: [
            'ID',
            'Date',
            'Type',
            'Status',
            'Clause Code',
            'Clause Description',
            'Cause Code',
            'Cause Description',
            'Priority',
            'Equipment',
            'Equipment Description',
            'Plant',
            'Funcloc',
            'Funcloc Description',
            'Finding Description',
            'Department',
            'Work Center',
            'Rectification Plan',
            'Inspected By',
            'Action By',
            'Verified By',
            'Created Date',
            'Approved Date',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([

                    $model->id,
                    $model->created_at->format('d-M-y'),
                    $model->type->name ?? '-',
                    $model->status->name ?? '-',
                    $model->clause->code ?? '-',
                    $model->clause->description ?? '-',
                    $model->causeCode->code ?? '-',
                    $model->causeCode->description ?? '-',
                    $model->priority->label ?? '-',
                    $model->equipment->code ?? 'N/A',
                    $model->equipment->description ?? 'N/A',
                    $model->functionalLocation->code ? (substr($model->functionalLocation->code ?? '-', 0, 5) ?? '-') : '-',
                    $model->functionalLocation->code ?? '-',
                    $model->functionalLocation->description ?? '-',
                    $model->description,
                    $model->department->name ?? '-',
                    $model->workCenter->name ?? '-',
                    $model->rectification_action ?? '-',
                    $model->inspector->name ?? '-',
                    $model->rectifier->name ?? '-',
                    $model->verifier->name ?? '-',
                    $model->created_at
                        ? $model->created_at->format('d-M-y')
                        : '-',
                    $model->closed_at
                        ? $model->closed_at->format('d-M-y')
                        : '-',

                ]);
        }
    ),

    'findingPriority' => new ExportDefinition(
        factory: fn() => new FindingPriorityExport(),
        title: 'finding_priorities',
        setup: fn($test) => $test->seed([
            FindingPrioritySeeder::class,
        ]),
        modelFactory: function () {
            return FindingPriority::first();
        },
        headings: [
            'id',
            'label',
            'description',
            'color_code',
            'sla_resolution_hours',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->label,
                    $model->description,
                    $model->color_code,
                    $model->sla_resolution_hours,
                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'findingStatus' => new ExportDefinition(
        factory: fn() => new FindingStatusExport(),
        title: 'finding_statuses',
        setup: fn($test) => $test->seed([
            FindingStatusSeeder::class,
        ]),
        modelFactory: function () {
            return FindingStatus::first();
        },
        headings: [
            'id',
            'name',
            'description',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->name,
                    $model->description,
                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'findingType' => new ExportDefinition(
        factory: fn() => new FindingTypeExport(),
        title: 'finding_types',
        setup: fn($test) => $test->seed([
            FindingTypeSeeder::class,
        ]),
        modelFactory: function () {
            return FindingType::first();
        },
        headings: [
            'id',
            'code',
            'name',
            'description',
            'created_at',
            'updated_at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->name,
                    $model->description,
                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'functionalLocation' => new ExportDefinition(
        factory: fn() => new FunctionalLocationExport([
            'area' => null,
        ]),
        title: 'functional_locations',
        setup: fn($test) => $test->seed([
            FunctionalLocationSeeder::class,
        ]),
        modelFactory: function () {
            return FunctionalLocation::first();
        },
        headings: [
            'ID',
            'Code',
            'Description',
            'Created at',
            'Updated at',
        ],
        mappingAssertion: function ($export, $model) {

            expect($export->map($model))
                ->toBe([
                    $model->id,
                    $model->code,
                    $model->description,
                    $model->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $model->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'installDismantleHistories' => new ExportDefinition(

        factory: fn($context) => new InstallDismantleHistoryExport([
            'start_date' => null,
            'end_date' => null,
            'functional_location_id' => null,
            'equipment_id' => null,
        ]),

        title: 'equipment_histories',

        setup: fn($test) => $test->seed([
            UserSeeder::class,
            FunctionalLocationSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentTypeSeeder::class,
            EquipmentSeeder::class,
            InstallDismantleHistorySeeder::class,
        ]),

        modelFactory: function () {

            return InstallDismantleHistory::withAllRelations()
                ->first();
        },

        headings: [
            'Id',
            'Equipment',
            'Status before',
            'Functional location before',
            'Status after',
            'Functional location after',
            'Changed by',
            'Date',
        ],

        mappingAssertion: function ($export, $history) {

            expect($export->map($history))
                ->toBe([
                    $history->id,
                    $history->equipment?->code,
                    $history->fromStatus?->code,
                    $history->fromFunctionalLocation?->code,
                    $history->toStatus?->code,
                    $history->toFunctionalLocation?->code,
                    $history->changedBy?->name,
                    $history->changed_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }

    ),

    'materials' => new ExportDefinition(
        factory: fn($context) => new MaterialExport([
            'functional_location_id' => null,
            'type_ids' => null,
        ]),
        title: 'materials',
        setup: fn($test) => $test->seed([
            MaterialUnitSeeder::class,
            MaterialTypeSeeder::class,
            MaterialSeeder::class,
        ]),

        modelFactory: function () {

            return Material::withDefaultRelations()
                ->first();
        },

        headings: [
            'ID',
            'Code',
            'Name',
            'Price',
            'Type',
            'Type Description',
            'Unit',
            'Created at',
            'Updated at',
        ],

        mappingAssertion: function ($export, $material) {

            expect($export->map($material))
                ->toBe([
                    $material->id,
                    $material->code,
                    $material->name,
                    $material->price ?? '-',

                    $material->type?->code ?? '-',
                    $material->type?->description ?? '-',
                    $material->unit?->name ?? '-',

                    $material->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $material->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'materialTypes' => new ExportDefinition(

        factory: fn($context) => new MaterialTypeExport(),

        title: 'material_types',

        setup: fn($test) => $test->seed([
            MaterialTypeSeeder::class,
        ]),

        modelFactory: function () {

            return MaterialType::first();
        },

        headings: [
            'id',
            'code',
            'description',
            'created_at',
            'updated_at',
        ],

        mappingAssertion: function ($export, $materialType) {
            expect($export->map($materialType))
                ->toBe([
                    $materialType->id,
                    $materialType->code,
                    $materialType->description,
                    $materialType->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $materialType->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    'materialUnits' => new ExportDefinition(

        factory: fn($context) => new MaterialUnitExport(),

        title: 'material_units',

        setup: fn($test) => $test->seed([
            MaterialUnitSeeder::class,
        ]),

        modelFactory: function () {

            return MaterialUnit::first();
        },

        headings: [
            'id',
            'name',
            'created_at',
            'updated_at',
        ],

        mappingAssertion: function ($export, $materialUnit) {

            expect($export->map($materialUnit))
                ->toBe([
                    $materialUnit->id,
                    $materialUnit->name,
                    $materialUnit->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $materialUnit->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }
    ),

    // 'panelTrends' => new ExportDefinition(

    //     factory: fn(Equipment $equipment) => new PanelTrendExport(
    //         $equipment,
    //         null,
    //         null,
    //     ),

    //     title: 'panel_trends',

    //     setup: function ($test) {
    //         $test->seed([
    //             UserSeeder::class,
    //             FunctionalLocationSeeder::class,
    //             EquipmentClassSeeder::class,
    //             EquipmentStatusSeeder::class,
    //             EquipmentTypeSeeder::class,
    //         ]);

    //         $panelClass = EquipmentClass::where('code', 'ZCLASS_E008')->firstOrFail();
    //         $panelType = EquipmentType::where('equipment_class_id', $panelClass->id)
    //             ->firstOrFail();
    //         $installed = EquipmentStatus::where('code', 'INST')->firstOrFail();

    //         Equipment::factory()
    //             ->count(10)
    //             ->create([
    //                 'equipment_class_id' => $panelClass->id,
    //                 'equipment_type_id' => $panelType->id,
    //                 'functional_location_id' => FunctionalLocation::first()->id,
    //                 'equipment_status_id' => $installed->id,
    //             ]);

    //         $test->seed([
    //             InspectionPanelSeeder::class,
    //         ]);
    //     },

    //     modelFactory: function () {
    //         return Equipment::whereHas('inspections', function ($query) {
    //             $query->where('formable_type', InspectionPanel::class);
    //         })->firstOrFail();
    //     },

    //     headings: [
    //         'Inspection Date',

    //         'Operational',
    //         'Clean',

    //         'Temp Incoming R',
    //         'Temp Incoming S',
    //         'Temp Incoming T',

    //         'Temp Cabinet',

    //         'Temp Outgoing R',
    //         'Temp Outgoing S',
    //         'Temp Outgoing T',

    //         'Current R',
    //         'Current S',
    //         'Current T',

    //         'Inspector',
    //     ],

    //     mappingAssertion: function (PanelTrendExport $export, Equipment $equipment) {

    //         $row = $export->collection()->first();

    //         expect($row)->not->toBeNull();

    //         expect($export->map($row))
    //             ->toBe([
    //                 $row->inspected_at,

    //                 $row->is_operational ? 'YES' : 'NO',
    //                 $row->is_clean ? 'YES' : 'NO',

    //                 $row->temperature_incoming_r,
    //                 $row->temperature_incoming_s,
    //                 $row->temperature_incoming_t,

    //                 $row->temperature_cabinet,

    //                 $row->temperature_outgoing_r,
    //                 $row->temperature_outgoing_s,
    //                 $row->temperature_outgoing_t,

    //                 $row->current_r,
    //                 $row->current_s,
    //                 $row->current_t,

    //                 $row->inspector_name,
    //             ]);
    //     }

    // ),

    'repositories' => new ExportDefinition(

        factory: fn($context) => new RepositoryExport([]),

        title: 'repositories',

        setup: fn($test) => $test->seed([
            UserSeeder::class,
            RepositorySeeder::class,
        ]),

        modelFactory: function () {

            return Repository::with('uploadedBy')
                ->first();
        },

        headings: [
            'ID',
            'Title',
            'Url',
            'Extension',
            'Uploaded by',
            'Uploaded at',
            'Updated at',
        ],

        mappingAssertion: function ($export, $repository) {

            expect($export->map($repository))
                ->toBe([
                    $repository->id,
                    $repository->title,
                    $repository->url(),
                    $repository->extension ?? '-',
                    $repository->uploadedBy?->name ?? '-',

                    $repository->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $repository->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }

    ),

    'workCenters' => new ExportDefinition(

        factory: fn($context) => new WorkCenterExport(),

        title: 'work_centers',

        setup: fn($test) => $test->seed([
            WorkCenterSeeder::class,
        ]),

        modelFactory: function () {

            return WorkCenter::first();
        },

        headings: [
            'id',
            'code',
            'name',
            'created_at',
            'updated_at',
        ],

        mappingAssertion: function ($export, $workCenter) {

            expect($export->map($workCenter))
                ->toBe([
                    $workCenter->id,
                    $workCenter->code,
                    $workCenter->name,
                    $workCenter->created_at?->format('Y-d-m h:i:s') ?? '-',
                    $workCenter->updated_at?->format('Y-d-m h:i:s') ?? '-',
                ]);
        }

    ),
]);
