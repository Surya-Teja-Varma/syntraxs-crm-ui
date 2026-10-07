# Syntraxs CRM UI Redesign Rules & Boundary Specification

> **CRITICAL DIRECTIVE FOR AI REDESIGN TOOLS (Bolt, Lovable, Cursor, etc.):**  
> **"Future UI redesign work must modify the presentation layer only and must not alter backend logic, APIs, database behavior, authentication, authorization, workflows, or business logic."**

---

## 1. Overview
This repository (`syntraxs-crm-ui`) is dedicated exclusively to the **frontend, visual, and UX redesign** of the CRM.  
The core backend functionality, database schemas, calculations, and integrations are working and must be protected.

---

## 2. 🟢 UI / PRESENTATION — AI TOOLS MAY MODIFY
These files and directories are the primary targets for UI/UX overhauls, theming, styling, layouts, and animations:

| Path | Description & Safe Changes |
| :--- | :--- |
| `src/components/ui/*` (47 files) | **Core Design System Primitives**: Button, Card, Badge, Dialog, Dropdown, Table, Input, Select, Sheet, Tabs, Tooltip, Avatar, Calendar, etc. Modify styles, variants, icons, and micro-interactions. |
| `src/components/Login.tsx` | **Login Screen**: Redesign branding banner, login card, typography, layout, inputs, and role toggles. *Keep `onLogin` submission logic and quick test accounts functional.* |
| `src/components/Login.css` | **Login Styles**: Custom typography, responsive breakpoints, font sizes. |
| `src/components/AdminDashboard.tsx` | **Admin Dashboard Layout**: Navigation tabs (`overview`, `leads`, `team`, `revenue`, `targets`, `reports`), top metric widgets, header bar, user avatar presentation, logout button styling, export CSV trigger button, and create user dialog. |
| `src/components/SalesDashboard.tsx` | **Sales Dashboard Layout**: Target progress cards, tab navigation (`leads`, `activities`, `targets`), lead search/filter bar, lead data table styling, activity logging forms, edit modal presentation. |
| `src/components/admin/LeadManagement.tsx` | **Lead Management UI**: Visual tables, filter pill bars, search inputs, bulk selection toolbars, bulk assign modal styling, add lead modal styling, lead details drawer. *(Preserve the XLSX parsing function and activity fetch call).* |
| `src/components/admin/Reports.tsx` | **Reports Screen**: Visual cards, Recharts chart presentation (pie charts, bar charts), report selector tabs, summary tables, filter controls. |
| `src/components/admin/RevenueAnalytics.tsx` | **Revenue Visualizations**: Metric cards, pipeline progress bars, Recharts area/line/bar charts, team member revenue cards. |
| `src/components/admin/TargetManagement.tsx` | **Target Tracking UI**: Target cards, monthly/weekly period filter buttons, progress indicators, target forms. |
| `src/components/admin/TeamPerformance.tsx` | **Team Performance Screen**: Leaderboard cards, rep performance stats, monthly calendar popover, activity metrics presentation. |
| `src/styles/globals.css` | **Theme Tokens**: CSS custom properties (`--background`, `--foreground`, `--primary`, `--secondary`, `--border`, `--radius`, `--chart-1`..`5`, dark mode tokens). |
| `src/index.css` | **Tailwind & Global Styles**: Base typography, global resets, utility classes. |
| `src/assets/*` | **Brand Imagery**: Logos (`zoopiter-logo.png`, `dashboard-logo.png`), backgrounds (`login-background.png`). |
| `index.html` | **HTML Document Shell**: Page title, meta tags, favicon. |

---

## 3. 🔴 PROTECTED — AI TOOLS MUST NOT MODIFY
These files contain active business workflows, Firestore database access, authentication security, and data models. **Do NOT touch or rewrite these files:**

| Path | Reason for Protection |
| :--- | :--- |
| `src/config/firebase.ts` | Firebase App, Auth, Firestore, and Messaging initialization & connection guards. |
| `src/services/authService.ts` | Session management (`localStorage`), Firebase Auth sign-in, user lookup, and credential creation. |
| `src/services/leadService.ts` | Firestore `leads` collection CRUD operations, real-time snapshot queries, and filters. |
| `src/services/targetService.ts` | Firestore `targets` collection CRUD and periodic target updates. |
| `src/services/activityService.ts`| Firestore `activities` collection CRUD and lead activity history queries. |
| `src/services/userService.ts` | Firestore `users` collection management and Firebase Auth user creation. |
| `src/types/index.ts` | System TypeScript data contracts: `Lead`, `Target`, `Activity`, `User`, status literals (`'new' | 'quotation_sent' | 'interested' | 'not_able_to_contact' | 'not_interested' | 'won' | 'pending_payment' | 'follow_up' | 'lost' | 'dnp'`). |
| `src/types/vite-env.d.ts` | Vite environment type definitions. |
| `.env.example` | Template for environment variable names. |
| `package.json` & `package-lock.json` | Core dependency versions and build scripts. |
| `vite.config.ts` | Bundler settings, path aliases (`@` -> `./src`), and port configurations. |

---

## 4. 🟡 SHARED — CAREFUL HYBRID FILES
These files connect UI elements with underlying state and business logic. Modify ONLY visual JSX/CSS while preserving handler signatures:

| Path | Safe Visual Changes | Protected Functional Logic |
| :--- | :--- | :--- |
| `src/App.tsx` | Page wrapper layouts, loading spinner visual presentation, global toaster positioning. | **PRESERVE**: Master React state, `useFirebaseData` hook connection, `handleLogin`, `handleLogout`, all CRUD action callbacks (`updateLead`, `addLead`, `deleteLead`, `updateTarget`, `editTarget`, `addTarget`, `addActivity`, `addUser`), and route guards. |
| `src/hooks/useFirebaseData.ts` | None (pure logic). | **DO NOT TOUCH**: Real-time Firestore snapshot listeners. |
| `src/utils/helpers.ts` | Badge color utility classes returned by `getStatusColor` and `getPriorityColor`. | **PRESERVE**: `formatDate` and period calculation math in `getCurrentPeriod`. |
| `src/components/NotificationManager.tsx` | Modal trigger presentation. | **PRESERVE**: FCM token requests, 5-minute upcoming follow-up interval timer, and overdue detection. |
| `src/components/NotificationBell.tsx` | Bell button icon, unread counter badge, popover dropdown card styling. | **PRESERVE**: Role-based follow-up filtering math (`admin` vs `sales`). |
| `src/components/FollowUpReminderPopup.tsx` | Alert modal appearance and responsive layout. | **PRESERVE**: Action callbacks (`onComplete`, `onSnooze`, `onDismiss`) passed to `onUpdateLead`. |
| `src/components/admin/LeadManagement.tsx` *(hybrid sections)* | Restyle all tables, modals, filters, and cards. | **PRESERVE**: `handleExcelUpload` file parsing with `xlsx`, and `getActivitiesByLead` call when viewing lead details. |

---

## 5. Golden Rules for Redesigning
1. **Never mock APIs**: Do not replace real data handlers with mock static arrays.
2. **Never break prop contracts**: `AdminDashboardProps`, `SalesDashboardProps`, and `LoginProps` must retain their exact prop interfaces.
3. **Preserve data field names**: Statuses, priority levels, and lead property names (`companyName`, `contactName`, `value`, `nextFollowUp`, etc.) must remain unchanged.
4. **Keep role separation**: `admin` and `sales` views have distinct data access rules that must not be merged or bypassed.
