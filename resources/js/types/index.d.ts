import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
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
    [key: string]: unknown; // This allows for additional properties...
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
