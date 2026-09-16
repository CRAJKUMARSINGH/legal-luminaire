/**
 * ChamberModePage — Month 4 Roadmap
 * ─────────────────────────────────────────────────────────────────────────────
 * Multi-lawyer chamber mode with role-based access control.
 * Wires chamberAuth.ts into a working UI.
 *
 * Roles:
 *   Admin     — full access (manage users, approve exports, delete cases)
 *   Advocate  — finalize drafts, approve exports, edit case law
 *   Associate — upload documents, view assigned cases only
 *
 * Storage: localStorage (Phase 1 — no backend required)
 * Phase 2: Wire to JWT / Replit Auth when ready
 *
 * Route: /chamber  (added to routes.tsx)
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users, LogIn, LogOut, ShieldCheck, Shield, User,
  CheckCircle2, XCircle, Crown, Briefcase, GraduationCap,
  Info, Lock, Unlock, Key,
} from "lucide-react";
import { useChamberAuth, type ChamberRole, ROLE_PERMISSIONS } from "@/lib/chamber-auth";

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_CFG: Record<ChamberRole, {
  label: string; labelHi: string; icon: React.ElementType;
  badgeClass: string; cardClass: string; description: string;
}> = {
  Admin: {
    label: "Admin", labelHi: "प्रशासक",
    icon: Crown,
    badgeClass: "bg-violet-700 text-white",
    cardClass: "border-violet-200 bg-violet-50/30",
    description: "Full access — manage users, approve exports, delete cases, bulk export.",
  },
  Advocate: {
    label: "Advocate", labelHi: "अधिवक्ता",
    icon: Briefcase,
    badgeClass: "bg-blue-700 text-white",
    cardClass: "border-blue-200 bg-blue-50/30",
    description: "Finalize drafts, approve exports, edit case law. Cannot delete cases or manage users.",
  },
  Associate: {
    label: "Associate", labelHi: "सहयोगी",
    icon: GraduationCap,
    badgeClass: "bg-emerald-700 text-white",
    cardClass: "border-emerald-200 bg-emerald-50/30",
    description: "Upload documents, view assigned cases. Cannot finalize drafts or approve exports.",
  },
};

const ALL_PERMISSIONS = [
  { key: "canFinalizeDraft",  label: "Finalize Drafts",    labelHi: "प्रारूप अन्तिम करें" },
  { key: "canDeleteCase",     label: "Delete Cases",       labelHi: "वाद हटाएँ" },
  { key: "canManageUsers",    label: "Manage Users",       labelHi: "उपयोगकर्ता प्रबंधन" },
  { key: "canViewAllCases",   label: "View All Cases",     labelHi: "सभी वाद देखें" },
  { key: "canApproveExport",  label: "Approve Export",     labelHi: "निर्यात अनुमोदन" },
  { key: "canEditCaseLaw",    label: "Edit Case Law",      labelHi: "विधि संशोधन" },
  { key: "canBulkExport",     label: "Bulk Export",        labelHi: "सामूहिक निर्यात" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChamberModePage() {
  const { user, login, logout, can, isLoggedIn } = useChamberAuth();

  // Login form state
  const [loginName, setLoginName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginRole, setLoginRole] = useState<ChamberRole>("Associate");
  const [loginChamber, setLoginChamber] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (!loginName.trim()) { setLoginError("Name is required."); return; }
    setLoginError("");
    login({
      name: loginName.trim(),
      email: loginEmail.trim() || undefined,
      role: loginRole,
      chamberName: loginChamber.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Chamber Mode
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            बहु-अधिवक्ता चैम्बर — Multi-lawyer role-based access control
          </p>
        </div>
        {isLoggedIn && user && (
          <Badge className={ROLE_CFG[user.role].badgeClass}>
            {user.role} · {ROLE_CFG[user.role].labelHi}
          </Badge>
        )}
      </div>

      {!isLoggedIn ? (
        /* ── Login Card ─────────────────────────────────────────────────── */
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <LogIn className="h-4 w-4" /> Join Chamber
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Full Name *</label>
                <Input
                  className="mt-1 text-sm"
                  placeholder="e.g. Rajkumar Singh"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Email (optional)</label>
                <Input
                  type="email"
                  className="mt-1 text-sm"
                  placeholder="advocate@chamber.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Role *</label>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {(["Admin", "Advocate", "Associate"] as ChamberRole[]).map((r) => {
                    const cfg = ROLE_CFG[r];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={r}
                        onClick={() => setLoginRole(r)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          loginRole === r
                            ? `${cfg.badgeClass} border-transparent`
                            : "border-muted-foreground/30 hover:border-primary text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {r} · {cfg.labelHi}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Chamber Name (optional)</label>
                <Input
                  className="mt-1 text-sm"
                  placeholder="e.g. Singh & Associates"
                  value={loginChamber}
                  onChange={(e) => setLoginChamber(e.target.value)}
                />
              </div>
            </div>
            {loginError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <XCircle className="h-3 w-3" /> {loginError}
              </p>
            )}
            <Button size="sm" className="gap-1.5" onClick={handleLogin}>
              <LogIn className="h-3.5 w-3.5" /> Enter Chamber
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* ── Logged-in view ──────────────────────────────────────────────── */
        <>
          {/* User card */}
          {user && (
            <Card className={`border-2 ${ROLE_CFG[user.role].cardClass}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`rounded-full p-3 ${
                  user.role === "Admin" ? "bg-violet-100" :
                  user.role === "Advocate" ? "bg-blue-100" : "bg-emerald-100"
                }`}>
                  {(() => { const Icon = ROLE_CFG[user.role].icon; return <Icon className="h-5 w-5" />; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base">{user.name}</span>
                    <Badge className={ROLE_CFG[user.role].badgeClass}>
                      {user.role} · {ROLE_CFG[user.role].labelHi}
                    </Badge>
                  </div>
                  {user.email && <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>}
                  {user.chamberName && (
                    <p className="text-xs text-muted-foreground">{user.chamberName}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Session started: {new Date(user.loginAt).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 italic">{ROLE_CFG[user.role].description}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={logout}>
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Permissions matrix */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Key className="h-4 w-4" /> Your Permissions — {user?.role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((perm) => {
                  const allowed = can(perm.key);
                  return (
                    <div
                      key={perm.key}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                        allowed
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-muted-foreground/20 bg-muted/20 opacity-60"
                      }`}
                    >
                      {allowed
                        ? <Unlock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        : <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      }
                      <div>
                        <p className={`font-medium text-xs ${allowed ? "text-emerald-800" : "text-muted-foreground"}`}>
                          {perm.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{perm.labelHi}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Role comparison matrix */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" /> Role Comparison Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 text-muted-foreground font-medium border-b">Permission</th>
                  {(["Admin", "Advocate", "Associate"] as ChamberRole[]).map((r) => (
                    <th key={r} className="text-center p-2 border-b">
                      <Badge className={`${ROLE_CFG[r].badgeClass} text-[10px]`}>{r}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMISSIONS.map((perm, i) => (
                  <tr key={perm.key} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="p-2 font-medium">
                      {perm.label}
                      <span className="ml-1 text-muted-foreground font-normal">· {perm.labelHi}</span>
                    </td>
                    {(["Admin", "Advocate", "Associate"] as ChamberRole[]).map((r) => (
                      <td key={r} className="p-2 text-center">
                        {ROLE_PERMISSIONS[r][perm.key]
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mx-auto" />
                          : <XCircle className="h-3.5 w-3.5 text-red-400 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <div>
          <strong>Phase 1 — localStorage only.</strong> User session is stored in your browser and persists
          across page refreshes. No backend authentication is required yet.{" "}
          <em>Phase 2 upgrade: wire to Replit Auth / JWT for real multi-user chamber support with
          server-side session enforcement.</em>
        </div>
      </div>
    </div>
  );
}
