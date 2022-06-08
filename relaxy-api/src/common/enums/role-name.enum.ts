export enum RoleNameEnum {
  SUPER_ADMIN_ROLE = 'SUPER_ADMIN_ROLE',
  ADMIN_ROLE = 'ADMIN_ROLE',
}

export const SUPERADMIN_ADMIN: RoleNameEnum[] = [
  RoleNameEnum.SUPER_ADMIN_ROLE,
  RoleNameEnum.ADMIN_ROLE,
];

export const ADMIN: RoleNameEnum[] = [RoleNameEnum.ADMIN_ROLE];
export const SUPERADMIN: RoleNameEnum[] = [RoleNameEnum.SUPER_ADMIN_ROLE];
