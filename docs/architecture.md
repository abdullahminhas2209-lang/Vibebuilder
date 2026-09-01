# HRMS — Product Architecture (Phase 1 Foundation)

This document is the working contract for the MVP. Phase 1 implements foundation only. Recruitment, onboarding, performance, and AI are deferred.

## A. Product Architecture

Modular monolith on Next.js (App Router). UI, server actions, and API live in one app. PostgreSQL is the system of record. Auth.js (NextAuth v5) handles sessions. Prisma enforces tenant-scoped data access.

```
┌─────────────────────────────────────────────────────────┐
│  Presentation  — App Router, role-aware shell, shadcn   │
├─────────────────────────────────────────────────────────┤
│  Application   — Server Actions, permission checks,     │
│                  Zod validation, audit writer           │
├─────────────────────────────────────────────────────────┤
│  Domain        — Org, Identity/RBAC, Core HR, Time,     │
│                  Leave, Payroll, Documents, Notify      │
├─────────────────────────────────────────────────────────┤
│  Persistence   — PostgreSQL + Prisma (orgId on every    │
│                  tenant entity)                         │
└─────────────────────────────────────────────────────────┘
```

**Module relationships (MVP):** Organization is the tenant root. Users belong to an organization (except platform Super Admin). Employees, departments, attendance, leave, payroll, and documents all hang off Organization. Notifications and audit logs are org-scoped. Later ATS/performance modules will attach to the same tenant root.

**Request path:** Proxy performs an optimistic session-cookie check. Layouts and every Server Action load the session, verify permissions, and constrain queries by `organizationId`.

## B. Database Schema

See `prisma/schema.prisma`. Phase 1 uses: Organization, User, Role, Permission, RolePermission, AuditLog. Remaining MVP tables are in the schema so later modules migrate incrementally rather than redesigning the model.

**Tenant rule:** every org-owned row has `organizationId`. Queries never omit that predicate for tenant users.

## C. RBAC Model

| Role | Scope | Typical access |
|---|---|---|
| SUPER_ADMIN | Platform | Organizations, users, roles, system settings, audit |
| HR_ADMIN | One organization | Employees, attendance, leave, payroll, org settings |
| MANAGER | Team within org | Team view, leave approvals, team attendance |
| EMPLOYEE | Self | Profile, clock, leave request, own payslips/docs |

Permissions are keys such as `employee.view`, `leave.approve`, `payroll.process`, `settings.manage`, `audit.view`. Super Admin bypasses permission checks but still cannot read another pattern of “hidden” data except via explicit org context. HR/Manager/Employee are always org-scoped.

UI navigation is filtered by permission. Server Actions re-check the same keys.

## D. Route Structure

| Path | Audience | Phase 1 |
|---|---|---|
| `/login` | Public | Yes |
| `/dashboard` | All authenticated | Yes |
| `/admin/organizations` | Super Admin | Yes |
| `/admin/users` | Super Admin, HR | Yes |
| `/admin/roles` | Super Admin, HR (view) | Yes |
| `/admin/settings` | Super Admin, HR | Yes |
| `/admin/audit-logs` | Super Admin, HR with `audit.view` | Yes |
| `/forbidden` | Authenticated without permission | Yes |
| `/employees`, `/attendance`, `/leave`, `/payroll`, `/me/*` | Later phases | Schema only |

## E. Component Architecture

- `components/ui/*` — primitives (button, input, card, table, dialog, badge, skeleton)
- `components/layout/*` — sidebar, header, page header, providers
- `components/forms/*` — validated forms bound to Server Actions
- `lib/db.ts` — Prisma client
- `lib/auth.ts` — Auth.js
- `lib/authz.ts` — session + permission helpers
- `lib/audit.ts` — immutable audit writer
- `lib/permissions.ts` — permission catalog and role defaults

## F. Phase 1 Implementation Steps

1. Design tokens, UI primitives, app shell
2. Prisma schema + PostgreSQL + seed
3. Auth.js credentials login/logout + JWT session
4. Proxy + protected layout
5. RBAC catalog, role bootstrap per org
6. Organization CRUD/settings
7. Users + role assignment
8. Audit log viewer (read-only)
9. Role-aware navigation and dashboards
10. Build, seed, and verify golden auth/org flows

## G. Phase 1 Acceptance Criteria

- Login and logout work for four demo roles
- Unauthenticated users cannot open app routes
- Users never see nav items they cannot access
- Super Admin can create an organization and see all orgs
- HR Admin can view/update **their** organization only
- HR of Org A cannot read Org B users or settings
- Permissions are enforced in Server Actions, not only in the UI
- Sensitive actions write an audit row that cannot be edited in the UI
- Layout is responsive; empty/loading/error states exist on foundation pages
- Secrets live in environment variables; demo passwords are not compiled into client bundles
