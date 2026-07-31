# Code Audit Report — Cally (Calendly Clone)

This audit was conducted to review component structure, file sizes, naming standards, code consistency, and security vulnerabilities across the frontend, backend, and background workers.

---

## 1. File Size & Component Structure

### Flagged Files & Components

| File Path | Lines | Issue Type | Description | Suggested Fix |
| :--- | :--- | :--- | :--- | :--- |
| `frontend/src/pages/Booking/index.tsx` | 1,480 | **God Component** | Handles date picking, calendar month grids, dynamic timezone selector list, custom booking form renderer, payments (Razorpay checkout.js loader), cancellation/rescheduling steps, and raw Axios API calls. Extremely high complexity. | Split into smaller modular components:<br>- `CalendarGrid.tsx` (handles calendar generation and pagination)<br>- `BookingFormRenderer.tsx` (handles dynamic JSON form questions)<br>- `TimezoneSelect.tsx` (encapsulates the timezone dropdown and auto-detection)<br>- `useBookingFlow.ts` (custom hook managing steps, API calls, and local storage state). |
| `frontend/src/pages/Preview/index.tsx` | 689 | **Duplicate Calendar & Form Logic** | A preview sandbox representing the mock booking flow. It re-implements calendar page construction, month selectors, and dynamic forms in an inline copy-paste manner with static mock arrays for event details. | Extract mock layouts and core calendar/form rendering code to shareable component files in `components/ui/` or `components/booking/` so that both the live `/booking` route and the `/preview` route share the same UI logic instead of duplicating it. |
| `frontend/src/pages/Dashboard/Bookings.tsx` | 517 | **Duplicated Filtering & Display Logic** | Shares ~90% of code with `BookingsTab.tsx`. Both define identical state, search term matching, date filtering helpers, and HTML layout. | Create a reusable `BookingsList` component in `Dashboard/components/` and call it from both `Bookings.tsx` (overall view) and `BookingsTab.tsx` (event type specific detail tab), passing the relevant `eventTypeId` filter prop. |
| `frontend/src/pages/Dashboard/components/EventEdit/BookingsTab.tsx` | 494 | **Duplicated Filtering & Display Logic** | Shares ~90% of code with `Bookings.tsx`. Both define identical search term matching, sorting helpers, and layout structures. | Delete the duplicate markup and logic; import and render a shared `BookingsList` component, passing down `eventTypeId={eventTypeId}`. |
| `frontend/src/pages/Dashboard/Analytics.tsx` | 631 | **God Page Component** | Mixes heavy presentation layout, direct state modifications, and pagination math inside the page file. Includes formatters for currency and numbers inline. | Move formatting utilities to a central helper `utils/formatters.ts`. Extract components like `AnalyticsStatsCard.tsx` and `AnalyticsBookingsTable.tsx`. |
| `backend/modules/bookings/services/bookings.service.ts` | 672 | **God Service Class** | Handles Razorpay API instantiation, scheduling logic, buffer offset logic, time conversion helpers, and multiple validation checks (overlapping, notice time, limit upcoming, duration limits) all in one file. | Extract limits and buffer validation checks into helper functions inside `modules/bookings/utils/booking-validation.ts`. Keep `bookings.service.ts` purely as a service coordinator. |

---

## 2. Consistency & Standards

### Naming Conventions & Structure
* **Folder Structure Inconsistency**: Frontend pages in `frontend/src/pages` use PascalCase (`Dashboard`, `Booking`, `Preview`, `Onboarding`, `NotFound`), but dashboard subdirectories mixed with kebab-case or general files (like `frontend/src/components/layout/Header.tsx` vs subcomponents).
* **Export Style Mixing**: The project mixes named exports (e.g., `export function BasicsTab` in event edit tabs) and default exports (e.g., `export default function BookingPage`). Named exports should be preferred project-wide for better IDE refactoring support.
* **Hardcoded API URLs**: Throughout `frontend/src/pages/Booking/index.tsx`, axios requests are directly coded using the local address string `"http://localhost:5001/api/"` (e.g., lines 158, 203, 348, 764, 789, 820, 889). If the backend port changes or runs on another origin, the booking flow will break. This must be replaced with a reference to `VITE_API_URL` or run through the API hook client.

---

## 3. Security Vulnerabilities

### High & Medium Risks Detected

| File Path | Line Range | Issue Type | Severity | Description | Suggested Fix |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `backend/modules/bookings/routes/bookings.routes.ts` | 21-22 | **Authorization Bypass / IDOR** | **High** | Endpoints `POST /:bookingId/cancel` and `POST /:bookingId/reschedule` allow public unauthenticated execution. Anyone who knows or guesses a `bookingId` can cancel or reschedule any meeting without authorization verification. | Add signature validation or require a cryptographically secure `cancellationToken` / `rescheduleToken` generated at booking time and sent in the confirmation email/URL. Verify this token server-side before allowing changes. |
| `backend/modules/bookings/services/bookings.service.ts` | 8-11, 326 | **Hardcoded Fallback Secrets** | **Medium** | Initializes Razorpay client using `"rzp_test_12345"` / `"razorpay_secret_12345"` as fallback values if environment variables are missing. This leaks test credentials in source code. | Throw an explicit startup error if required variables like `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` are not set. Never provide secret key fallback strings inline in codebase. |
| `worker/workers/payment.worker.ts` | 23-36 | **Signature Bypass Risk** | **Medium** | Razorpay webhook signature verification is fully bypassed if `hasRazorpayCreds` is false (e.g., if environment variables are not configured). If this happens in a staging/production build, fake payments can be easily injected. | Enforce signature verification on all webhooks unconditionally in non-local development environments. |
| `frontend/src/lib/api.ts` | 10 | **Hardcoded Client Configuration** | **Low** | Base API URL `"http://localhost:5001/api"` is hardcoded inline. | Replace with `import.meta.env.VITE_API_URL` to allow env-specific configurations. |

---

## Prioritized Action List (Top 5 First)

1. **Fix Cancel & Reschedule IDOR Vulnerability (High Severity — High Priority)**
   - *Impact vs. Effort*: High Security Impact, Low Effort.
   - *Fix*: Generate a `cancellationToken` (UUID v4) on booking creation and store it in the Database. Require this token in request params to cancel/reschedule.
2. **Remove Fallback/Hardcoded Test Secrets (Medium Severity — High Priority)**
   - *Impact vs. Effort*: Medium Security Impact, Very Low Effort.
   - *Fix*: Throw error on startup if `RAZORPAY_KEY_SECRET` or `CLERK_SECRET_KEY` are undefined in `env.ts`.
3. **Use Environment Variable for Backend API Base URL (Medium Severity — Medium Priority)**
   - *Impact vs. Effort*: Medium Consistency Impact, Low Effort.
   - *Fix*: Update `api.ts` and `Booking/index.tsx` to read `import.meta.env.VITE_API_URL` instead of hardcoded `"http://localhost:5001"`.
4. **De-duplicate Booking Page Filtering and Listing (Low Severity — Medium Priority)**
   - *Impact vs. Effort*: High Code Quality Impact, Medium Effort.
   - *Fix*: Refactor `Bookings.tsx` and `BookingsTab.tsx` to import a single shared `BookingsList` component.
5. **Split Booking God Component (Low Severity — Medium Priority)**
   - *Impact vs. Effort*: High Maintainability Impact, Medium/High Effort.
   - *Fix*: Modularize `Booking/index.tsx` into sub-components (`CalendarGrid`, `TimezoneSelect`, `BookingForm`).
