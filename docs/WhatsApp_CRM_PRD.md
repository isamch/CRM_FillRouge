# WhatsApp CRM Platform
## Product Requirements Document
**Version:** 1.0 | **Status:** Draft — Pending Review | **Date:** March 2026

---

| Field | Details |
|---|---|
| Product Name | WhatsApp CRM Platform |
| Version | 1.0 |
| Status | Draft — Pending Review |
| Date | March 2026 |
| Audience | Development Team, Product Owners, Stakeholders |
| Author | Product Owner / Admin |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Objectives](#2-goals--objectives)
3. [Project Scope](#3-project-scope)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture Overview](#7-technical-architecture-overview)
8. [User Stories](#8-user-stories)
9. [UI/UX Design Guidelines](#9-uiux-design-guidelines)
10. [Core Data Models](#10-core-data-models)
11. [Campaign State Machine](#11-campaign-state-machine)
12. [Error Handling & Edge Cases](#12-error-handling--edge-cases)
13. [Security Requirements](#13-security-requirements)
14. [Release Plan](#14-release-plan)
15. [Open Questions & Assumptions](#15-open-questions--assumptions)
16. [Glossary](#16-glossary)

---

## 1. Executive Summary

The **WhatsApp CRM Platform** is a multi-tenant SaaS web application that allows businesses to manage their WhatsApp communications at scale. It provides a unified interface for connecting WhatsApp accounts via QR code, managing contacts, sending targeted bulk campaigns, and tracking message delivery — all through an intuitive dashboard.

The platform operates under a two-tier access model: a super **Admin** who oversees all users and platform health, and standard **Users** who manage their own WhatsApp channels. The system is built around three core pillars:

- **Communication** — Real-time messaging, conversation management, and WhatsApp connection via QR scan.
- **Campaign Management** — Bulk messaging through campaigns with scheduling, progress tracking, and stop controls.
- **Administration** — User management, usage analytics, and in-app notification broadcasting.

---

## 2. Goals & Objectives

### 2.1 Business Goals

- Provide a reliable, scalable WhatsApp messaging solution for small and medium businesses.
- Enable structured, category-based contact management with bulk import capability.
- Allow non-technical users to run high-volume WhatsApp campaigns without developer assistance.
- Give admins full visibility into platform usage, user activity, and message volume.

### 2.2 Success Metrics

| KPI | Metric | Target |
|---|---|---|
| KPI 1 | Campaign delivery rate | ≥ 95% of messages successfully sent |
| KPI 2 | QR connection success rate | ≥ 99% first-scan success |
| KPI 3 | Number validation accuracy | ≥ 98% accuracy |
| KPI 4 | User onboarding time | First message sent within 5 minutes |
| KPI 5 | Admin notification delivery | Delivered to users within 30 seconds |

---

## 3. Project Scope

### 3.1 In Scope

- WhatsApp Web integration via QR code using a headless browser / WhatsApp Web API library.
- Conversation inbox with message history per contact (phone number or name lookup).
- Contact management: manual entry, CSV bulk import, category tagging, and list naming.
- Phone number validation tool integrated within each contact list.
- Message template builder (text-based, with variable placeholders).
- Campaign engine: choose template + list, run immediately or schedule, stop mid-run, progress bar.
- Admin panel: user list, per-user message counters, user CRUD, in-app notification system.
- User dashboard: personal usage stats, notification inbox from admin.

### 3.2 Out of Scope (v1.0)

- WhatsApp Business API (Meta official) integration — v1.0 uses WhatsApp Web scraping/library.
- Rich media campaign messages (images, videos, documents) — text templates only.
- Two-way campaign conversation automation / chatbot flows.
- Native mobile application (iOS / Android).
- Payment gateway / subscription billing module.
- Multi-language interface (English only in v1.0).

---

## 4. User Roles & Permissions

### 4.1 Role Definitions

#### Admin (Super User)
There is a single Admin account (the platform owner). The Admin has full access to all system features and is responsible for user governance. The Admin can also use all User-level features for their own WhatsApp account.

#### User (Standard)
Users are created and managed by the Admin. Each User manages their own WhatsApp connection, contacts, campaigns, and templates in isolation from other users. Users cannot view or interact with another user's data.

### 4.2 Permissions Matrix

| Permission | Admin | User |
|---|:---:|:---:|
| Connect WhatsApp via QR | ✅ | ✅ |
| View & send messages | ✅ | ✅ |
| Manage contacts & lists | ✅ | ✅ |
| Create message templates | ✅ | ✅ |
| Create & run campaigns | ✅ | ✅ |
| View own usage stats | ✅ | ✅ |
| View notifications | ✅ | ✅ |
| View all users | ✅ | ❌ |
| Manage users (CRUD) | ✅ | ❌ |
| View user message stats | ✅ | ❌ |
| Send notifications to users | ✅ | ❌ |
| System configuration | ✅ | ❌ |

---

## 5. Functional Requirements

### 5.1 WhatsApp Connection Module

Each user must connect their WhatsApp account to the platform before using any messaging features.

#### 5.1.1 QR Code Connection

- The system generates a fresh QR code each time the user navigates to the connection page.
- The QR code is displayed prominently with a countdown timer indicating expiry (default: 60 seconds).
- On successful scan, the session is persisted and the user sees a green **Connected** status badge.
- If the QR expires, a **Refresh QR Code** button appears automatically.
- The connection status is shown on the main dashboard sidebar at all times.

#### 5.1.2 Session Management

- WhatsApp sessions are stored server-side per user (encrypted session file or database record).
- If a session disconnects, the system sends an in-app alert and prompts re-connection.
- The user can manually disconnect (log out from WhatsApp) from the settings page.
- Only one active WhatsApp session is permitted per user account at a time.

---

### 5.2 Conversation & Messaging Module

The messaging inbox allows users to view and reply to individual WhatsApp conversations in real time.

#### 5.2.1 Conversation List

- Displays all active conversations sorted by most recent message (descending).
- Each conversation entry shows: contact name (or phone number), last message preview, timestamp, and unread count badge.
- Search bar at the top filters conversations by contact name or phone number in real time.
- Clicking on a conversation loads the full message thread in the right panel.

#### 5.2.2 Message Thread View

- Displays the full chronological message history with the selected contact.
- Sent messages appear on the right (blue background); received messages on the left (white/gray).
- Message status indicators: sent (single tick), delivered (double tick), read (blue double tick).
- A text input field at the bottom allows typing and sending new messages.
- Supports emoji insertion via an emoji picker button.
- A **Load Earlier Messages** button fetches older history (paginated, 50 messages per page).

---

### 5.3 Contact Management Module

Contacts are the foundation of the campaign system. All contacts are organized into named, categorized lists.

#### 5.3.1 Contact Lists

- Each list has a unique name (e.g., "VIP Clients", "Newsletter Subscribers").
- Each list belongs to a **category** (e.g., "Customers", "Leads", "Partners"). Categories are user-defined.
- The sidebar shows all categories, each expandable to reveal its lists.
- Users can create, rename, and delete both categories and lists.
- A list shows: list name, category tag, number of contacts, validation status summary.

#### 5.3.2 Adding Contacts — Manual Entry

- A form with fields: Name (optional), Phone Number (required, international format), Notes (optional).
- Phone number format is validated on entry (must start with country code, digits only).
- Duplicate phone numbers within the same list trigger a warning before saving.
- Contacts can be edited or deleted individually.

#### 5.3.3 Adding Contacts — CSV Import

- Users click **Import CSV** and upload a `.csv` file.
- The system previews the first 5 rows and asks the user to map columns to fields (Name, Phone, Notes).
- After confirmation, all valid rows are imported; invalid rows (malformed numbers) are shown in an error report.
- The CSV template can be downloaded from the import dialog.

#### 5.3.4 Number Validation & Cleanup

- A **Validate All Numbers** button runs validation on every number in the selected list.
- Validation checks: format correctness, country code presence, and WhatsApp registration status.
- Results: each contact is flagged as **Valid** (green), **Invalid** (red), or **Unknown** (gray).
- A **Clear Invalid Numbers** button removes all red-flagged contacts from the list after a confirmation dialog.
- Validation runs asynchronously and shows a progress indicator.
- A validation report (count of valid/invalid/unknown) is shown at the end.

---

### 5.4 Message Templates Module

#### 5.4.1 Template Builder

- Users can create, edit, duplicate, and delete message templates.
- Each template has: a **name** (internal label) and a **body** (the actual message content).
- Variable placeholders use double-brace syntax: `{{name}}`, `{{company}}`, `{{offer}}`, etc.
- A live preview panel shows how the message looks with sample values substituted.
- Character count displayed in real time (WhatsApp message limits apply).
- Templates are listed in a searchable, sortable table.

---

### 5.5 Campaign Management Module

Campaigns allow users to send a chosen template to an entire contact list, either immediately or on a schedule.

#### 5.5.1 Campaign Creation

- **Campaign name** (required).
- **Select template** — dropdown showing all user's templates with a preview on hover.
- **Select contact list** — dropdown showing all user's lists with contact count displayed.
- **Variable mapping** — if the template has placeholders, the user maps them to contact fields (name, notes, etc.).
- **Send speed / rate limit** — messages per minute setting (to avoid WhatsApp bans).

#### 5.5.2 Execution Options

- **Run Now** — campaign starts immediately after confirmation.
- **Schedule** — date/time picker to set a future start time (user's local timezone with UTC offset shown).
- Scheduled campaigns are listed separately with a countdown to start time.

#### 5.5.3 Campaign Execution & Progress

- A real-time **progress bar** shows: messages sent / total contacts (e.g., `134 / 500 — 26.8%`).
- Status counters below the bar: **Sent**, **Failed**, **Pending**, remaining **Estimated Time**.
- A **Pause** button pauses sending; a **Resume** button continues from where it stopped.
- A **Stop** button permanently stops the campaign (with confirmation dialog). Stopped campaigns cannot be resumed.
- On completion, a summary report is shown: total sent, total failed (with reasons), duration.

#### 5.5.4 Campaign History

- All campaigns (completed, stopped, scheduled) are listed in a history table.
- Columns: name, template, list, status, start time, end time, sent count, failed count.
- Each row is expandable to see per-contact delivery details.
- Filter by status: All, Running, Completed, Stopped, Scheduled.

---

### 5.6 Admin Panel

The Admin panel is accessible only to the Admin account via a dedicated section in the navigation.

#### 5.6.1 User Management

- View all registered users in a table: username, email, registration date, account status, last active.
- **Create new user** — username, email, password, role (always "User" for created accounts).
- **Edit user** — change username, email, reset password, toggle account active/inactive status.
- **Delete user** — confirmation dialog, with option to export user data before deletion.
- Search and filter users by name, email, or status.

#### 5.6.2 Usage Analytics

- A table showing per-user statistics: total messages sent (all time), messages sent in current month, number of campaigns run, number of active contacts.
- Sortable by any column.
- A top-level summary card showing platform totals: total users, total messages sent, total active sessions.
- Export usage data as CSV.

#### 5.6.3 Admin Notifications

- The Admin can compose and send a notification message to any specific user or broadcast to all users.
- Notification form: **recipient** (dropdown — specific user or "All Users"), **subject**, **message body**.
- Sent notifications are logged with timestamp and recipient.
- Admin can view full notification history (sent notifications).

---

### 5.7 User Dashboard & Notifications

#### 5.7.1 Usage Stats

- Card showing: messages sent today, this week, this month, all time.
- Campaigns run: number of campaigns, breakdown by status.
- Contact lists: total contacts across all lists.
- WhatsApp connection status prominently displayed.

#### 5.7.2 Notification Inbox

- A bell icon in the top navigation bar shows the count of unread notifications.
- Clicking opens a notification panel listing all messages from the Admin.
- Each notification shows: subject, preview of body, timestamp, and read/unread status.
- Clicking a notification marks it as read and expands the full message.
- Users can delete individual notifications.

---

## 6. Non-Functional Requirements

| Category | Requirement | Priority |
|---|---|---|
| Performance | Dashboard loads within 2 seconds. Campaign progress updates every 2 seconds via WebSocket. | High |
| Scalability | System must support up to 100 concurrent users each running campaigns simultaneously. | High |
| Security | All data encrypted in transit (HTTPS/TLS 1.3). Passwords hashed with bcrypt. JWT session tokens with 24h expiry. | High |
| Availability | 99.5% uptime SLA. Scheduled downtime communicated 48h in advance. | High |
| Data Isolation | Each user's contacts, campaigns, and sessions are strictly isolated. No cross-user data access. | High |
| Reliability | WhatsApp session auto-reconnects up to 3 times on disconnect before alerting user. | Medium |
| Audit Logging | All admin actions (user creation, deletion, notifications) logged with timestamp and actor. | Medium |
| Responsiveness | UI responsive from 1280px to 1920px width (desktop-first, tablet support secondary). | Medium |
| Browser Support | Chrome 110+, Firefox 110+, Edge 110+, Safari 16+. | Low |

---

## 7. Technical Architecture Overview

### 7.1 Recommended Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (or Next.js) + Tailwind CSS. Real-time updates via Socket.IO client. |
| Backend | Node.js with Express.js (or NestJS). RESTful API + WebSocket server. |
| WhatsApp Integration | `whatsapp-web.js` library (headless Chromium / Puppeteer). |
| Primary Database | PostgreSQL — users, contacts, campaigns, templates, notifications. |
| Cache / Queue | Redis — session cache, campaign queue (Bull). |
| Job Queue | Bull (Redis-backed) — campaign scheduling and rate-limited message dispatch. |
| Authentication | JWT with refresh tokens. bcrypt for password hashing. |
| Storage | Local filesystem or S3-compatible object storage for WhatsApp session files. |

### 7.2 Key Architectural Decisions

- One WhatsApp session instance per user, spawned on demand and pooled on the server.
- Campaign sending handled by a background worker queue (Bull), not the HTTP request cycle.
- Real-time progress updates pushed to the client via WebSocket (Socket.IO room per user).
- Multi-tenancy enforced at the application layer (`user_id` foreign key on all resource tables).
- CSV import processed server-side with streaming to handle large files without memory spikes.

---

## 8. User Stories

### 8.1 End User Stories

- As a user, I want to scan a QR code to link my WhatsApp so I can start messaging without technical setup.
- As a user, I want to see all my WhatsApp conversations in one place so I can reply quickly.
- As a user, I want to search conversations by contact name or phone number so I can find specific chats fast.
- As a user, I want to import contacts from a CSV file so I can quickly build large lists.
- As a user, I want to validate all phone numbers in a list and remove invalid ones so my campaigns reach real recipients.
- As a user, I want to create message templates with variables so I can send personalized messages at scale.
- As a user, I want to run a campaign immediately or schedule it for a future time so I can plan communications in advance.
- As a user, I want to see a progress bar during a campaign so I know how many messages have been sent.
- As a user, I want to stop a running campaign in case of error so I can prevent unwanted messages.
- As a user, I want to see my usage statistics so I can track my messaging activity.
- As a user, I want to receive notifications from the admin so I stay informed about platform updates.

### 8.2 Admin User Stories

- As an admin, I want to create and manage user accounts so I can control who has access to the platform.
- As an admin, I want to see how many messages each user has sent so I can monitor platform usage.
- As an admin, I want to deactivate a user account so I can instantly revoke access when needed.
- As an admin, I want to send a notification to a specific user or all users so I can communicate important information.
- As an admin, I want to export usage data as CSV so I can analyze it in external tools.
- As an admin, I want to view a log of all notifications I have sent so I can track communications.

---

## 9. UI/UX Design Guidelines

### 9.1 Layout

- Fixed left sidebar for navigation (WhatsApp green accent, dark background).
- Main content area fills the rest of the screen.
- Top navigation bar: page title, user avatar/name, notification bell, logout button.

### 9.2 Navigation Structure

```
├── Dashboard          (usage overview + connection status)
├── Conversations      (messaging inbox)
├── Contacts           (lists by category)
├── Templates
├── Campaigns
├── Notifications      (user inbox)
├── Admin              (Admin only)
│   ├── Users
│   ├── Analytics
│   └── Send Notification
└── Settings           (account settings, disconnect WhatsApp)
```

### 9.3 Design Tokens

| Token | Value |
|---|---|
| Primary / CTA | WhatsApp Green `#25D366` |
| Page Background | Off-white `#F7F8FA` |
| Card Background | White `#FFFFFF` |
| Primary Text | Dark `#1E293B` |
| Secondary Text | Gray `#64748B` |
| Success / Valid | Green `#16A34A` |
| Error / Invalid | Red `#DC2626` |
| Warning / Pending | Amber `#D97706` |
| Typography | Inter or system-ui, 14px base, 1.6 line-height |

---

## 10. Core Data Models

### User
```
id, username, email, password_hash, role (admin | user),
is_active, created_at, last_login_at
```

### WhatsApp Session
```
id, user_id (FK), session_data (encrypted), status (connected | disconnected),
connected_at, disconnected_at
```

### Category
```
id, user_id (FK), name
```

### Contact List
```
id, user_id (FK), name, category_id (FK), created_at, updated_at
```

### Contact
```
id, list_id (FK), name, phone_number, notes,
validation_status (valid | invalid | unknown | pending), created_at
```

### Template
```
id, user_id (FK), name, body, variables (JSON array of placeholder names),
created_at, updated_at
```

### Campaign
```
id, user_id (FK), name, template_id (FK), list_id (FK),
status (draft | scheduled | running | paused | completed | stopped),
scheduled_at, started_at, completed_at,
total_contacts, sent_count, failed_count, rate_per_minute
```

### Campaign Message Log
```
id, campaign_id (FK), contact_id (FK),
status (pending | sent | failed), sent_at, error_message
```

### Notification
```
id, sender_id (admin FK), recipient_id (user FK — null = broadcast),
subject, body, is_read, created_at
```

---

## 11. Campaign State Machine

```
Draft ──────────────────► Running ◄──────── Scheduled
                            │  ▲                ▲
                            │  │                │
                          Pause  Resume    (scheduled_at reached)
                            │  │
                            ▼  │
                          Paused
                            │
                            ▼
                          Stopped (terminal)

Running ────────────────► Completed (terminal)
Running / Paused ───────► Stopped (terminal)
```

| Transition | Trigger |
|---|---|
| Draft → Scheduled | User sets a future start time and saves. |
| Draft → Running | User clicks **Run Now**. |
| Scheduled → Running | System clock triggers at scheduled time. |
| Running → Paused | User clicks **Pause**. |
| Paused → Running | User clicks **Resume**. |
| Running → Completed | All contacts processed (sent or failed). |
| Running → Stopped | User clicks **Stop** and confirms. |
| Paused → Stopped | User clicks **Stop** and confirms. |
| Stopped | Terminal — no further transitions. |
| Completed | Terminal — no further transitions. |

---

## 12. Error Handling & Edge Cases

- **WhatsApp ban / rate-limit detection** — if WhatsApp returns a rate-limit signal, the campaign auto-pauses and notifies the user.
- **Session expiry during campaign** — campaign pauses, user is notified to re-scan QR and manually resume.
- **CSV import with 0 valid rows** — error shown, no list created.
- **Scheduling a campaign in the past** — validation error on save, user prompted to correct the date.
- **Deleting a list used in an active campaign** — not allowed. User must stop the campaign first.
- **Deleting a template used in a scheduled campaign** — warning shown; user must confirm, and the campaign is moved to Draft.
- **Admin deleting a user with active campaigns** — campaigns are stopped automatically before deletion.

---

## 13. Security Requirements

- All API endpoints require a valid JWT token except `/auth/login` and `/auth/register`.
- Admin-only endpoints protected by role middleware. Any non-admin access returns HTTP `403 Forbidden`.
- WhatsApp session files encrypted at rest with AES-256 using a per-user derived key.
- Rate limiting on authentication endpoints: **10 attempts per IP per 15 minutes**.
- Input sanitization on all user-supplied fields to prevent XSS and SQL injection.
- CORS restricted to the platform's own domain(s).
- All admin actions logged to an immutable audit trail table.

---

## 14. Release Plan

| Phase | Scope | Timeline |
|---|---|---|
| **Phase 1 — Core** | Auth, QR connection, conversation inbox, basic contact management. | Weeks 1–4 |
| **Phase 2 — Campaigns** | Templates, campaign creation, run/stop, progress bar, CSV import. | Weeks 5–8 |
| **Phase 3 — Admin** | Admin panel, user CRUD, analytics, notification system. | Weeks 9–11 |
| **Phase 4 — Polish** | Number validation, scheduling, campaign history, UX refinement, QA. | Weeks 12–14 |
| **Phase 5 — Launch** | Security audit, performance testing, production deployment. | Weeks 15–16 |

---

## 15. Open Questions & Assumptions

### 15.1 Open Questions

- Will the platform support multiple WhatsApp numbers per user in a future version?
- Should failed campaign messages be retried automatically? If so, how many times and with what delay?
- Is there a maximum contacts-per-list limit to prevent system overload?
- Should campaigns support rich media (images, PDFs) in v2.0?
- What is the data retention policy for campaign logs and conversation history?

### 15.2 Assumptions

- `whatsapp-web.js` (or equivalent open-source library) will be used for WhatsApp integration in v1.0.
- The platform will be deployed on a dedicated server with persistent storage (not serverless).
- Each user is responsible for their own WhatsApp account compliance with Meta's Terms of Service.
- The Admin account is created manually at deployment time (no self-registration for admin).

---

## 16. Glossary

| Term | Definition |
|---|---|
| CRM | Customer Relationship Management — system to manage interactions with contacts. |
| Campaign | A bulk messaging operation sending a template to all contacts in a list. |
| Template | A reusable message body with optional variable placeholders like `{{name}}`. |
| Contact List | A named collection of contacts belonging to a category. |
| Category | A user-defined grouping label for organizing multiple contact lists. |
| QR Code | Quick Response code — scanned by the user's phone to link WhatsApp to the platform. |
| Session | The persistent WhatsApp Web login state stored server-side per user. |
| Validation | The process of checking whether a phone number is registered on WhatsApp. |
| Rate Limit | The controlled pace at which messages are sent to avoid WhatsApp bans. |
| JWT | JSON Web Token — a signed token used for authenticating API requests. |
| Broadcast | Sending a notification to all users simultaneously (Admin feature only). |

---

*This document is confidential and intended for internal use only. © 2026 WhatsApp CRM Platform — All rights reserved.*
