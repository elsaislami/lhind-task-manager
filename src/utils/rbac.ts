const roles: { [key: string]: string[] } = {
  admin: ["all", "admin"],
  user: ["all", "user"],
};

export const hasPermission = (role: string, permission: string): boolean => {
  return roles[role]?.includes(permission) ?? false;
};
