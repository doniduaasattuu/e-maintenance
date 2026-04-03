<?php

namespace Database\Seeders;

use Database\Seeders\Traits\HasPermissionGenerator;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    use HasPermissionGenerator;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $models = [
            'User',
            'Role',
            'Department',
            'Division',
            'WorkCenter',
            'FunctionalLocation',
            'Equipment',
            'Material',
            'EquipmentClass',
            'EquipmentStatus',
            'InstallDismantleHistory',
            'Inspection',
            'InspectionMotor',
            'InspectionPanel',
            'InspectionTransformer',
            'InspectionAirConditioner',
            'Report',
            'FindingType',
            'FindingClause',
            'FindingStatus',
            'FindingPriority',
            'CauseCode',
            'Finding',
            'Audit',
            'Abnormality',
            'Repository',
            'MaterialUnit',
            'MaterialType',
            'Image'
        ];

        $this->generatePermissions($models);
    }
}
