import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    roles: string[];
    permissions: Record<string, boolean>;
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string;
    children?: string[];
    subItems?: NavItem[];
    multiple?: boolean;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface Message {
    type: 'success' | 'error' | 'warning' | 'info';
    description: string;
    action?: {
        label: string;
        url: string;
        method: HttpMethod;
    };
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    permissions: Record<string, boolean>;
    message: Message;
    notifications: {
        findings: {
            audit_open: number;
            abnormality_open: number;
        };
    };
    [key: string]: unknown;
}

export interface Division {
    id: number;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Department {
    id: number;
    code: string;
    name: string;
    division_id: number;
    division?: Division;
    users: number;
    created_at: string;
    updated_at: string;
}

export interface Position {
    id: number;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface WorkCenter {
    id: number;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    employee_id: string;
    name: string;
    email: string;
    phone_number?: string;
    avatar?: string;
    email_verified_at: string | null;
    department?: Department;
    position?: Position;
    work_center?: WorkCenter;
    department_id?: number;
    position_id?: number;
    work_center_id?: number;
    isOnline?: boolean;
    deleted_at?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: Permission[];
    created_at: string;
    updated_at: string;
}

export interface MetaLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: MetaLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

// MASTER DATA
export interface FunctionalLocation {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface EquipmentClass {
    id: number;
    code: string;
    name: string;
    formable_type: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface EquipmentStatus {
    id: number;
    code: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Equipment {
    id: number;
    code: string;
    sort_field: string;
    description: string | null;
    functional_location_id: number | null;
    equipment_class_id: number | null;
    equipment_status_id: number | null;
    functionalLocation: FunctionalLocation | null;

    eclass: EquipmentClass | null;
    status: EquipmentStatus | null;
    images: null | Image[];

    created_at: string;
    updated_at: string;
}

export interface InstallDismantleHistory {
    id: number;
    equipment_id: number;
    from_status_id: number;
    to_status_id: number;
    from_sort_field: string | null;
    to_sort_field: string | null;
    from_functional_location_id: number;
    to_functional_location_id: number;
    changed_by: number;
    changed_at: string;
    note: string;
    created_at: string;
    updated_at: string;
    equipment: Equipment;
    fromStatus: EquipmentStatus;
    toStatus: EquipmentStatus;
    fromFunctionalLocation: FunctionalLocation | null;
    toFunctionalLocation: FunctionalLocation | null;
    changedBy: User | null;
}

export interface InspectionForm {
    equipment_id: number;
    formable_id: number;
    formable_type: string;
    equipment: Equipment;
}

export interface InspectionMotor {
    id: number;
    is_operational: number;
    is_clean: number;
    number_of_greasing: number;
    temperature_de: string | null; // decimal
    temperature_body: string | null; // decimal
    temperature_nde: string | null; // decimal
    vibration_dev: string | null; // decimal
    vibration_deh: string | null; // decimal
    vibration_dea: string | null; // decimal
    vibration_def: string | null; // decimal
    is_noisy_de: number;
    vibration_ndev: string | null; // decimal
    vibration_ndeh: string | null; // decimal
    vibration_ndef: string | null; // decimal
    is_noisy_nde: number;
    inspected_by: number | null;
    created_at: string;
    updated_at: string;
    inspectedBy: User | null;
    inspectionForm: InspectionForm;
}

export interface InspectionPanel {
    id: number;
    is_operational: number;
    is_clean: number;
    temperature_incoming_r: string | null; // decimal
    temperature_incoming_s: string | null; // decimal
    temperature_incoming_t: string | null; // decimal
    temperature_cabinet: string | null; // decimal
    temperature_outgoing_r: string | null; // decimal
    temperature_outgoing_s: string | null; // decimal
    temperature_outgoing_t: string | null; // decimal
    current_r: string | null; // decimal
    current_s: string | null; // decimal
    current_t: string | null; // decimal
    inspected_by: number | null;
    created_at: string;
    updated_at: string;
    inspectedBy: User | null;
    inspectionForm: InspectionForm;
}

export interface InspectionTransformer {
    id: number;
    is_operational: number;
    is_clean: number;
    primary_current_r: string | null; // decimal
    primary_current_s: string | null; // decimal
    primary_current_t: string | null; // decimal
    primary_voltage_r: string | null; // decimal
    primary_voltage_s: string | null; // decimal
    primary_voltage_t: string | null; // decimal
    secondary_current_r: string | null; // decimal
    secondary_current_s: string | null; // decimal
    secondary_current_t: string | null; // decimal
    secondary_voltage_r: string | null; // decimal
    secondary_voltage_s: string | null; // decimal
    secondary_voltage_t: string | null; // decimal
    temperature_oil: string | null; // decimal
    temperature_winding: string | null; // decimal
    desicant_level_id: number;
    inspected_by: number | null;
    created_at: string;
    updated_at: string;
    inspectedBy: User | null;
    inspectionForm: InspectionForm;
}

export interface InspectionAirConditioner {
    id: number;
    is_operational: number;
    is_drain_leaking: number;
    current_load: string | null;
    blowing_temperature: string | null;
    ambient_temperature: string | null;
    is_filter_clean: number;
    is_evaporator_clean: number;
    is_condensor_clean: number;
    inspected_by: number | null;
    created_at: string;
    updated_at: string;
    inspectedBy: User | null;
    inspectionForm: InspectionForm;
}

export interface Image {
    id: number;
    path: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface MaterialUnit {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface MaterialType {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Material {
    id: number;
    code: string;
    name: string;
    price: number;
    material_unit_id: number | null;
    material_type_id: number | null;

    unit: MaterialUnit | null;
    type: MaterialType | null;
    images: null | Image[];

    created_at: string;
    updated_at: string;
}

export interface Repository {
    id: number;
    title: string;
    path: string;
    url: string;
    extension: ?string;
    mime_type: ?string;
    uploaded_by: number | null;
    uploadedBy: User | null;
    created_at: string;
    updated_at: string;
}

export interface FindingType {
    id: number;
    code: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface FindingClause {
    id: number;
    code: string;
    type: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface FindingStatus {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface FindingPriority {
    id: number;
    label: string;
    description: string;
    sla_resolution_hours?: string;
    color_code?: string;
    created_at: string;
    updated_at: string;
}

export interface CauseCode {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Finding {
    id: number;
    description: string;
    rectification_action?: string;
    notification: string;

    // Relasi (Optional karena menggunakan whenLoaded di Resource)
    type?: FindingType;
    clause?: FindingClause;
    status?: FindingStatus;
    priority?: FindingPriority;
    causeCode?: CauseCode;
    department?: Department;
    equipment?: Equipment;
    functionalLocation?: FunctionalLocation;

    inspector?: User | null;
    rectifier?: USer | null;
    verifier?: User | null; // Bisa null jika belum diverifikasi

    images?: FindingImage[];
    gallery?: {
        before: FindingImage[];
        after: FindingImage[];
    };

    due_date: string;
    due_date_readable: string;
    is_overdue: boolean;

    // Timestamps
    created_at: string;
    updated_at: string;
    closed_at: string | null;
}

export interface FindingImage {
    id: number;
    finding_id: number;
    file_path: string;
    url: string;
    category: 'before' | 'after';
    original_name: string;
    created_at: string;
    updated_at: string;
}
