export const UI_STRINGS = {
    // Global Action Labels (Reusable for Buttons)
    ACTIONS: {
        CREATE: 'Create',
        SAVE_CHANGES: 'Save Changes',
        UPDATE: 'Update',
        CANCEL: 'Cancel',
        DELETE: 'Delete',
        BACK: 'Back to List',
    },

    // Module Specific Strings
    FUNCTIONAL_LOCATION: {
        label: 'Functional Location',
        plural: 'Functional Locations',
        create: {
            header: 'Create Functional Location',
            description: 'Add a new location to the functional hierarchy for maintenance tracking.',
        },
        edit: {
            header: 'Edit Functional Location',
            description: 'Modify the details or configuration of this functional area.',
        },
    },

    EQUIPMENT: {
        label: 'Equipment',
        plural: 'Equipments',
        create: {
            header: 'Create Equipment',
            description: 'Register a new asset to the inventory for tracking and maintenance.',
        },
        edit: {
            header: 'Edit Equipment',
            description: 'Update technical specifications or location status for this asset.',
        },
    },

    MATERIAL: {
        label: 'Material',
        plural: 'Materials',
        create: {
            header: 'Create Material',
            description: 'Add a new spare part or consumable to the material master list.',
        },
        edit: {
            header: 'Edit Material',
            description: 'Modify material details, specifications, or stock references.',
        },
    },

    EQUIPMENT_HISTORY: {
        label: 'Equipment History',
        plural: 'Equipment Histories',
        create: {
            header: 'Create Equipment History',
            description: 'Log a new installation or removal event to track asset movement.',
        },
        edit: {
            header: 'Edit Equipment History',
            description: 'Correct historical records of equipment placement or timing.',
        },
    },

    EQUIPMENT_CLASS: {
        label: 'Equipment Class',
        plural: 'Equipment Classes',
        create: {
            header: 'Create Equipment Class',
            description: 'Define a new category to group similar types of industrial machinery.',
        },
        edit: {
            header: 'Edit Equipment Class',
            description: 'Update the classification name or technical parameters for this group.',
        },
    },

    EQUIPMENT_STATUS: {
        label: 'Equipment Status',
        plural: 'Equipment Statuses',
        create: {
            header: 'Create Equipment Status',
            description: 'Create a new operational state to track asset availability.',
        },
        edit: {
            header: 'Edit Equipment Status',
            description: 'Modify the definition or visibility of an existing asset status.',
        },
    },

    MATERIAL_UNIT: {
        label: 'Material Unit',
        plural: 'Material Units',
        create: {
            header: 'Create Material Unit',
            description: 'Add a new measurement unit for material quantity tracking.',
        },
        edit: {
            header: 'Edit Material Unit',
            description: 'Update the unit name or abbreviation used in the system.',
        },
    },

    MATERIAL_TYPE: {
        label: 'Material Type',
        plural: 'Material Types',
        create: {
            header: 'Create Material Type',
            description: 'Define a new planning type or classification for material logic.',
        },
        edit: {
            header: 'Edit Material Type',
            description: 'Adjust the planning behavior or category for this material type.',
        },
    },

    FINDING_CLAUSE: {
        label: 'Finding Clause',
        plural: 'Finding Clauses',
        create: {
            header: 'Create Finding Clause',
            description: 'Add a new audit clause to the system for standardized finding reporting.',
        },
        edit: {
            header: 'Edit Finding Clause',
            description: 'Update the clause code or description to match the latest audit standards.',
        },
    },

    FINDING_STATUS: {
        label: 'Finding Status',
        plural: 'Finding Statuses',
        create: {
            header: 'Create Finding Status',
            description: 'Set up a new workflow stage for inspection results.',
        },
        edit: {
            header: 'Edit Finding Status',
            description: 'Update the status label or its position in the finding workflow.',
        },
    },

    FINDING_PRIORITY: {
        label: 'Finding Priority',
        plural: 'Finding Priorities',
        create: {
            header: 'Create Finding Priority',
            description: 'Define a new urgency level to categorize maintenance findings.',
        },
        edit: {
            header: 'Edit Finding Priority',
            description: 'Modify the priority name or response time expectations.',
        },
    },

    FINDING: {
        label: 'Finding',
        plural: 'Findings',
        show: {
            header: 'Finding Details',
            description: 'Finding data and information',
        },
        create: {
            header: 'Create Finding',
            description: 'Record a new issue or observation discovered during inspection.',
        },
        edit: {
            header: 'Edit Finding',
            description: 'Update the finding details, evidence, or current resolution progress.',
        },
    },

    REPOSITORY: {
        label: 'Repository',
        plural: 'Repositories',
        create: {
            header: 'Upload to Repository',
            description: 'Upload a new technical document, manual, or reference file.',
        },
        edit: {
            header: 'Edit Repository File',
            description: 'Update file metadata, description, or replace with a newer version.',
        },
    },

    USER: {
        label: 'User',
        plural: 'Users',
        create: {
            header: 'Create User',
            description: 'Register a new team member and provide access to the platform.',
        },
        edit: {
            header: 'Edit User',
            description: 'Update user profile information or account status.',
        },
    },

    ROLE: {
        label: 'Role',
        plural: 'Roles',
        create: {
            header: 'Create Role',
            description: 'Create a new set of permissions for specific user responsibilities.',
        },
        edit: {
            header: 'Edit Role',
            description: 'Modify the access rights and capabilities assigned to this role.',
        },
    },

    ORGANIZATION: {
        label: 'Organization',
        plural: 'Organizations',
        create: {
            header: 'Create Organization',
            description: 'Add a new department, division, or work center to the hierarchy.',
        },
        edit: {
            header: 'Edit Organization',
            description: 'Update the organizational structure or reporting lines.',
        },
    },
};
