import { useCallback, useState } from "react";

export type ChamberRole = "Admin" | "Advocate" | "Associate";
export type ChamberPermission =
  | "canFinalizeDraft"
  | "canDeleteCase"
  | "canManageUsers"
  | "canViewAllCases"
  | "canApproveExport"
  | "canEditCaseLaw"
  | "canBulkExport";

export interface ChamberUser {
  id: string;
  name: string;
  email?: string;
  role: ChamberRole;
  chamberName?: string;
}

export const ROLE_PERMISSIONS: Record<
  ChamberRole,
  Record<ChamberPermission, boolean>
> = {
  Admin: {
    canFinalizeDraft: true,
    canDeleteCase: true,
    canManageUsers: true,
    canViewAllCases: true,
    canApproveExport: true,
    canEditCaseLaw: true,
    canBulkExport: true,
  },
  Advocate: {
    canFinalizeDraft: true,
    canDeleteCase: false,
    canManageUsers: false,
    canViewAllCases: true,
    canApproveExport: true,
    canEditCaseLaw: true,
    canBulkExport: false,
  },
  Associate: {
    canFinalizeDraft: false,
    canDeleteCase: false,
    canManageUsers: false,
    canViewAllCases: false,
    canApproveExport: false,
    canEditCaseLaw: false,
    canBulkExport: false,
  },
};

const STORAGE_KEY = "legal-luminaire:chamber-user";

function readUser(): ChamberUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChamberUser) : null;
  } catch {
    return null;
  }
}

function createId() {
  return `chamber-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChamberAuth() {
  const [user, setUser] = useState<ChamberUser | null>(() => readUser());

  const login = useCallback((input: Omit<ChamberUser, "id">) => {
    const next = { ...input, id: createId() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const can = useCallback(
    (permission: ChamberPermission) =>
      user ? ROLE_PERMISSIONS[user.role][permission] : false,
    [user],
  );

  return { user, login, logout, can, isLoggedIn: user !== null };
}
