<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $models = ['User', 'Role', 'Department', 'Division', 'WorkCenter', 'FunctionalLocation', 'Equipment', 'Material', 'EquipmentClass', 'EquipmentStatus', 'InstallDismantleHistory', 'Inspection', 'InspectionMotor', 'InspectionPanel', 'InspectionTransformer', 'InspectionAirConditioner', 'Report', 'Finding', 'Repository', 'Unit', 'MaterialType', 'Image'];
        $actions = ['create', 'read', 'update', 'delete', 'restore'];

        foreach ($models as $model) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$action}_" . strtolower($model)
                ]);
            }
        }
    }
}
