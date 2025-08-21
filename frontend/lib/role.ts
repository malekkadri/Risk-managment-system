export type Role = 'admin' | 'editor' | 'viewer'

export type Permission = 'read' | 'write' | 'delete'

export interface User {
  id: number
  roles: Role[]
}

const rolePermissions: Record<Role, Permission[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
}

export function hasRole(user: User, role: Role): boolean {
  return user.roles.includes(role)
}

export function authorize(user: User, allowed: Role[]): boolean {
  return allowed.some((role) => hasRole(user, role))
}

export function hasPermission(user: User, permission: Permission): boolean {
  return user.roles.some((role) => rolePermissions[role]?.includes(permission))
}