export type RoleName = 'Owner' | 'Admin' | 'Viewer';

export interface JwtPayload {
  sub: string;
  email: string;
  role: RoleName;
  organizationId?: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role: RoleName;
  organizationId: string | null;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskCategory = 'Work' | 'Personal' | 'Other';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: number;
  category?: TaskCategory;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  organizationId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}
