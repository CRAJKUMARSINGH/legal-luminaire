/**
 * Chamber Auth — Month 4
 * ─────────────────────────────────────────────────────────────────────────────
 * Multi-lawyer chamber mode: role-based access control.
 *
 * Roles:   Admin | Advocate | Associate
 * Storage: localStorage (persists across browser sessions, cleared on logout)
 * Phase 1: localStorage-based (no backend auth required yet)
 * Phase 2: Wire to Replit Auth / JWT when ready
 *
 * Usage:
 *   chamberAuth.setUser({ name: "Rajkumar Singh", role: "Advocate" });
 *   chamberAuth.can("canFinalizeDraft") // → true for Advocate
 */

export type ChamberRole = "Admin" | "Advocate" | "Associate";

export interface ChamberUser {
  id: string;
  name: string;
  email?: string;
  role: ChamberRole;
  chamberName?: string;
  loginAt: string;
}

export const ROLE_PERMISSIONS: Record<ChamberRole, Record<string, boolean>> = {
  Admin: {
    canFinalizeDraft:   true,
    canDeleteCase:      true,
    canManageUsers:     true,
    canViewAllCases:    true,
    canApproveExport:   true,
    canEditCaseLaw:     true,
    canBulkExport:      true,
  },
  Advocate: {
    canFinalizeDraft:   true,
    canDeleteCase:      false,
    canManageUsers:     false,
    canViewAllCases:    true,
    canApproveExport:   true,
    canEditCaseLaw:     true,
    canBulkExport:      false,
  },
  Associate: {
    canFinalizeDraft:   false,
    canDeleteCase:      false,
    canManageUsers:     false,
    canViewAllCases:    false,
    canApproveExport:   false,
    canEditCaseLaw:     false,
    canBulkExport:      false,
  },
};

const STORAGE_KEY = "legal-luminaire:chamber-user";

export const chamberAuth = {
  /** Get the current logged-in chamber user, or null. */
  getUser(): ChamberUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ChamberUser) : null;
    } catch {
      return null;
    }
  },

  /** Set the current user (login). */
  setUser(user: Omit<ChamberUser, "id" | "loginAt">): ChamberUser {
    const full: ChamberUser = {
      ...user,
      id: `user-${Date.now()}`,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    return full;
  },

  /** Clear user (logout). */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /** Check if the current user has a permission. */
  can(permission: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
  },

  /** Get the current user's role, or null if not logged in. */
  role(): ChamberRole | null {
    return this.getUser()?.role ?? null;
  },

  /** True if a user is logged in. */
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  },

  /** Get role display label. */
  roleLabel(): string {
    const role = this.role();
    if (!role) return "Guest";
    return role;
  },
};

/** React hook for chamber auth — reads state and provides setUser/logout. */
import { useState, useCallback } from "react";
export function useChamberAuth() {
  const [user, setUserState] = useState<ChamberUser | null>(() => chamberAuth.getUser());

  const login = useCallback((u: Omit<ChamberUser, "id" | "loginAt">) => {
    const full = chamberAuth.setUser(u);
    setUserState(full);
    return full;
  }, []);

  const logout = useCallback(() => {
    chamberAuth.logout();
    setUserState(null);
  }, []);

  const can = useCallback((permission: string) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
  }, [user]);

  return { user, login, logout, can, isLoggedIn: user !== null };
}
