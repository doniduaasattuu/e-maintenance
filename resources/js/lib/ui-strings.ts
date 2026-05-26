interface UIEntry {
    label: string;
    plural?: string;
    description?: string;
    show?: { header: string; description: string };
    create?: { header: string; description: string };
    edit?: { header: string; description: string };
}

export const DEFAULT_STRINGS: Record<string, UIEntry> = {
    DASHBOARD: {
        label: 'Dashboard',
    },

    QR_SCANNER: {
        label: 'QR Scanner',
    },

    FUNCTIONAL_LOCATION: {
        label: 'Functional Location',
        plural: 'Functional Locations',
        description:
            'An organizational unit that structures technical systems, buildings, or equipment based on functional, spatial, or process criteria.',
        show: {
            header: 'Show Functional Location',
            description: 'Detail of location to the functional hierarchy for maintenance tracking.',
        },
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
        description: 'Represents a unique physical object tracked for maintenance, costing, and history.',
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
        description: 'The textual name or identifier assigned to a specific product, part, or raw material within the Material Master record.',
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
        description: 'Installation and dismantle history for equipments, including status and functional location changes.',
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
        description: 'Defines the technical grouping of assets based on shared characteristics, maintenance requirements, and performance criteria.',
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
        description: 'Tracks the current operational availability of an asset to support maintenance planning and scheduling.',
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
        description: 'Specifies the standard unit of measure for stock management, purchasing, and consumption recording.',
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
        description: 'Defines the category of materials to control business logic, valuation, and procurement planning.',
        create: {
            header: 'Create Material Type',
            description: 'Define a new planning type or classification for material logic.',
        },
        edit: {
            header: 'Edit Material Type',
            description: 'Adjust the planning behavior or category for this material type.',
        },
    },

    FINDING_TYPE: {
        label: 'Finding Type',
        plural: 'Finding Types',
        description: 'Categorizes findings based on their source or discovery method, such as formal Audit 5RK3 or spontaneous Abnormality reports.',
        create: {
            header: 'Create Finding Type',
            description: 'Define a new category for inspection findings to improve data grouping and reporting accuracy.',
        },
        edit: {
            header: 'Edit Finding Type',
            description: 'Modify existing finding categories to align with updated operational or audit classification systems.',
        },
    },

    FINDING_CLAUSE: {
        label: 'Finding Clause',
        plural: 'Finding Clauses',
        description:
            'Represents the regulatory, safety, or operational standard reference against which an inspection finding is evaluated to ensure compliance.',
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
        description:
            'Represents the lifecycle stage of a maintenance finding, tracking its progression from initial discovery to final closure or verification.',
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
        description:
            'Represents the urgency level of a maintenance finding, determining the required response time and resource allocation based on operational impact.',
        create: {
            header: 'Create Finding Priority',
            description: 'Define a new urgency level to categorize maintenance findings.',
        },
        edit: {
            header: 'Edit Finding Priority',
            description: 'Modify the priority name or response time expectations.',
        },
    },

    CAUSE_CODE: {
        label: 'Cause Code',
        plural: 'Cause Codes',
        description:
            'A standardized classification used to identify the root cause of an equipment failure, operational error, or maintenance incident.',
        create: {
            header: 'Create Cause Code',
            description: 'Add a new failure cause classification to the system for root cause analysis.',
        },
        edit: {
            header: 'Edit Cause Code',
            description: 'Update the cause code identifier or description to ensure accurate reporting and analytics.',
        },
    },

    FINDING: {
        label: 'Finding',
        plural: 'Findings',
        description: 'Represents a unique physical object tracked for maintenance, costing, and history.',
        create: {
            header: 'Create Finding',
            description: 'Record a new issue or observation discovered during inspection.',
        },
        edit: {
            header: 'Edit Finding',
            description: 'Update the finding details, evidence, or current resolution progress.',
        },
    },

    AUDIT: {
        label: 'Audit 5RK3',
        plural: 'Audits 5RK3',
        description:
            'A formal evaluation of workplace standards based on the 5RK3 criteria (Ringkas, Rapi, Resik, Rawat, Rajin, K3) to ensure operational compliance.',
        create: {
            header: 'Create Audit Finding',
            description: 'Record a new non-compliance finding discovered during a formal 5RK3 audit session.',
        },
        edit: {
            header: 'Edit Audit Finding',
            description: 'Update the audit observation, clause reference, or evidence for the selected finding.',
        },
    },

    ABNORMALITY: {
        label: 'Abnormality',
        plural: 'Abnormalities',
        description: 'Represents any deviation from established standards, procedures, or specifications.',
        create: {
            header: 'Create Abnormality Finding',
            description: 'Record a new issue or observation discovered during inspection.',
        },
        edit: {
            header: 'Edit Abnormality Finding',
            description: 'Update the finding details, evidence, or current resolution progress.',
        },
    },

    MOM: {
        label: 'MoM',
        plural: 'Minutes of Meeting',
        description:
            'A consolidated view of Audit and Abnormality findings, representing any deviation from established standards, procedures, or specifications recorded within the last 7 days.',
    },

    ARCHIVED_FINDING: {
        label: 'Archived',
        plural: 'Archives',
        description: 'Represents any finding that have been closed.',
    },

    REPOSITORY: {
        label: 'Repository',
        plural: 'Repositories',
        description: 'Centralized document storage module',
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
        description:
            'Represents an authorized individual within the system, responsible for performing maintenance tasks, inspections, or administrative operations.',
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
        description:
            'Defines the scope of access rights and responsibilities within the system, ensuring users can only perform actions assigned to their function.',
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
        description:
            'Manages the hierarchical structure of the company, including Divisions, Departments, and Work Centers for operational and cost allocation.',
        create: {
            header: 'Create Organization',
            description: 'Add a new department, division, or work center to the hierarchy.',
        },
        edit: {
            header: 'Edit Organization',
            description: 'Update the organizational structure or reporting lines.',
        },
    },

    INSPECTION_AIR_CONDITIONER: {
        label: 'AC Inspection',
        plural: 'AC Inspections',
        description: 'Monitors cooling performance, filter cleanliness, and refrigerant pressure for HVAC assets.',
        create: { header: 'New AC Inspection', description: 'Log a new maintenance check for an Air Conditioning unit.' },
        edit: { header: 'Edit AC Inspection', description: 'Update cooling diagnostics or maintenance findings for this AC unit.' },
    },
    INSPECTION_MOTOR: {
        label: 'Motor Inspection',
        plural: 'Motor Inspections',
        description: 'Tracks vibration levels, temperature, and electrical load for industrial motors.',
        create: { header: 'New Motor Inspection', description: 'Record mechanical and electrical telemetry for a motor.' },
        edit: { header: 'Edit Motor Inspection', description: 'Update motor diagnostic data or technical observations.' },
    },
    INSPECTION_PANEL: {
        label: 'Panel Inspection',
        plural: 'Panel Inspections',
        description: 'Tracks thermal imaging, circuit breaker status, and wiring integrity for electrical panels.',
        create: { header: 'New Panel Inspection', description: 'Perform a safety and integrity check on an electrical panel.' },
        edit: { header: 'Edit Panel Inspection', description: 'Modify electrical safety test results or panel status.' },
    },
    INSPECTION_TRANSFORMER: {
        label: 'Transformer Inspection',
        plural: 'Transformer Inspections',
        description: 'Monitors oil levels, dielectric strength, and core temperature for power transformers.',
        create: { header: 'New Transformer Inspection', description: 'Capture diagnostic readings for a power transformer unit.' },
        edit: { header: 'Edit Transformer Inspection', description: 'Update transformer maintenance records and test results.' },
    },
} as const;

const TENANT_OVERRIDES: Record<string, Partial<Record<string, Partial<UIEntry>>>> = {
    DJABESMEN: {
        FINDING: {
            label: 'Audit 5RK3',
            plural: 'Audit 5RK3',
            description: 'Centralized document storage module',
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
            label: 'Document Control',
            plural: 'Document Controls',
            description: 'Centralized document storage module',
            create: {
                header: 'Upload to Repository',
                description: 'Upload a new technical document, manual, or reference file.',
            },
            edit: {
                header: 'Edit Repository File',
                description: 'Update file metadata, description, or replace with a newer version.',
            },
        },
    },
};

const tenant = import.meta.env.VITE_APP_TENANT || 'DEFAULT';

export const UI_STRINGS = {
    ...DEFAULT_STRINGS,
    ...(TENANT_OVERRIDES[tenant] || {}),
};
