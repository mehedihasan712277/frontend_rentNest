# API Integration Status — RentNest Frontend

This document tracks how the frontend (`src/store/*.ts`, Zustand) integrates
with the RentNest backend (`https://server-rentnest.onrender.com`, see the
backend `README.md` for the full API reference). It exists so anyone working
on the frontend can see, at a glance, which backend routes are already wired
up, which are missing, and where the known inconsistencies are.

> Note: `src/store/propertyStore.ts` was not available for this review (the
> file supplied for it was actually a project directory tree). The
> **Properties** section below is therefore based on the backend README only
> — it should be re-audited once the actual store contents are checked in.

---

## How to read this

Each section lists every route the backend exposes for that resource, and
marks whether the frontend store currently calls it:

- ✅ Integrated — a store action calls this route
- ⚠️ Partial — called, but response typing / error handling differs from the rest of the store
- ❌ Missing — no store action calls this route yet

---

## Auth — `/api/auth`

Not handled by a Zustand store — auth is implemented separately via
`src/actions/auth.actions.ts` (Next.js server actions) and
`src/lib/auth-cookies.ts` / `src/lib/jwt.ts` / `src/lib/get-current-user.ts`,
consistent with the httpOnly-cookie access token model described in the
backend README.

| Route                 | Status | Notes                                                                                                   |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `POST /login`         | ✅     | via `auth.actions.ts`                                                                                   |
| `POST /register`      | ✅     | via `auth.actions.ts`                                                                                   |
| `POST /refresh-token` | ❓     | verify this is called from the axios client interceptor (`src/lib/axios-client.ts`), not confirmed here |
| `GET /me`             | ✅     | via `get-current-user.ts`                                                                               |
| `POST /logout`        | ✅     | via `LogoutButton.tsx` / `auth.actions.ts`                                                              |

---

## Users — `/api/users` (`userStore.ts`)

| Route                 | Role  | Status     | Store action                                                                    |
| --------------------- | ----- | ---------- | ------------------------------------------------------------------------------- |
| `POST /create-user`   | ADMIN | ❌ Missing | no equivalent action                                                            |
| `GET /my-profile`     | any   | ✅         | `fetchProfile`                                                                  |
| `PUT /update-profile` | any   | ❌ Missing | no equivalent action — profile edits currently have no store support            |
| `GET /all`            | ADMIN | ✅         | `fetchAllUsers`                                                                 |
| `PUT /delete-account` | ADMIN | ✅         | `updateUserStatus` (also patches `allUsers` + `profile` locally after the call) |

**Gap:** there's no way for any role to update their own profile
(`PUT /update-profile`) or for an admin to create a user directly
(`POST /create-user`) through the store yet.

---

## Categories — `/api/categories` (`categoryStore.ts`)

| Route                 | Role   | Status | Store action           |
| --------------------- | ------ | ------ | ---------------------- |
| `POST /`              | ADMIN  | ✅     | `createCategory`       |
| `GET /`               | public | ✅     | `fetchCategories`      |
| `GET /:categoryId`    | ADMIN  | ✅     | `fetchCategoryDetails` |
| `PUT /:categoryId`    | ADMIN  | ✅     | `updateCategory`       |
| `DELETE /:categoryId` | ADMIN  | ✅     | `deleteCategory`       |

Fully integrated. All mutating actions (`create`/`update`/`delete`) refetch
the list afterward instead of patching state locally, keeping ordering
consistent with the server.

---

## Amenities — `/api/amenities` (`amenityStore.ts`)

| Route                | Role            | Status | Store action          |
| -------------------- | --------------- | ------ | --------------------- |
| `POST /`             | ADMIN, LANDLORD | ✅     | `createAmenity`       |
| `GET /`              | public          | ✅     | `fetchAmenities`      |
| `GET /:amenityId`    | ADMIN           | ✅     | `fetchAmenityDetails` |
| `DELETE /:amenityId` | ADMIN, LANDLORD | ✅     | `deleteAmenity`       |

Fully integrated — matches the backend 1:1 (there is no update route for
amenities on the backend, so none is expected here).

---

## Properties — `/api/properties` (`propertyStore.ts` — **not reviewed**)

Based on the backend README only, since the store contents weren't
available for this pass:

| Route                            | Role            | Status        |
| -------------------------------- | --------------- | ------------- |
| `POST /`                         | LANDLORD        | ❓ Unverified |
| `GET /`                          | public          | ❓ Unverified |
| `GET /admin`                     | ADMIN           | ❓ Unverified |
| `GET /my-properties`             | LANDLORD, ADMIN | ❓ Unverified |
| `GET /:propertyId`               | public          | ❓ Unverified |
| `PUT /:propertyId`               | LANDLORD        | ❓ Unverified |
| `PUT /change-status/:propertyId` | LANDLORD        | ❓ Unverified |
| `DELETE /:propertyId`            | LANDLORD        | ❓ Unverified |

**Action item:** re-run this audit once `propertyStore.ts` is available —
the `_components` under `dashboard/landlord/properties` and
`dashboard/admin/properties` imply most of these are wired up in the UI
already, but that should be confirmed against the actual store code.

---

## Rental Requests — `/api/rental-requests` (`rentalRequestStore.ts`)

| Route                           | Role     | Status | Store action                                                                       |
| ------------------------------- | -------- | ------ | ---------------------------------------------------------------------------------- |
| `POST /`                        | TENANT   | ✅     | `createRentalRequest`                                                              |
| `GET /`                         | ADMIN    | ✅     | `fetchAllRentalRequests`                                                           |
| `GET /my-sent-request`          | TENANT   | ✅     | `fetchMySentRequests`                                                              |
| `GET /rental-request-to-me`     | LANDLORD | ✅     | `fetchRequestsToMe`                                                                |
| `PUT /:requestId`               | LANDLORD | ✅     | `updateRentalRequestStatus`                                                        |
| `PUT /tenant-delete/:requestId` | TENANT   | ✅     | `tenantDeleteRequest`                                                              |
| `DELETE /:requestId`            | ADMIN    | ✅     | `adminDeleteRequest`                                                               |
| `POST /:id/subscribe`           | TENANT   | ✅     | `subscribeToRentalRequest` — opens the returned Stripe Checkout `url` in a new tab |

Fully integrated — this is the most complete store in the codebase, and the
only one using a shared `getErrorMessage()` helper that unwraps the
backend's `{ response: { data: { message } } }` shape rather than falling
back to the generic axios error message. See **Known Inconsistencies**
below.

---

## Rentals — `/api/rentals` (`rentalStore.ts`)

| Route                      | Role     | Status         | Store action             |
| -------------------------- | -------- | -------------- | ------------------------ |
| `GET /my-rentals`          | TENANT   | ✅             | `fetchMyRentals`         |
| `GET /my-property-rentals` | LANDLORD | ✅             | `fetchMyPropertyRentals` |
| `GET /access/:propertyId`  | TENANT   | ❌ **Missing** | no equivalent action     |
| `GET /all-rental-info`     | ADMIN    | ✅             | `fetchAllRentals`        |

**Gap:** `GET /rentals/access/:propertyId` — the endpoint the backend README
explicitly calls out for frontend content gating
(`{ hasActiveAccess: boolean }`) — has no store action. Anywhere the UI
needs to decide whether a tenant can see gated property content, it should
be calling this route rather than deriving access from `RentalRequest`
status or from the rentals list, per the backend's documented rule:

> Property access / content gating should always check
> `Rental.status === 'ACTIVE' && currentPeriodEnd > now()` — never
> `RentalRequest.status`.

This should be added, e.g. as a `checkPropertyAccess(propertyId)` action.

---

## Payments — `/api/payments` (`paymentStore.ts`)

| Route                       | Role     | Status | Store action              |
| --------------------------- | -------- | ------ | ------------------------- |
| `GET /`                     | ADMIN    | ✅     | `fetchAllPayments`        |
| `GET /my-payments`          | TENANT   | ✅     | `fetchMyPayments`         |
| `GET /my-property-payments` | LANDLORD | ✅     | `fetchMyPropertyPayments` |

Fully integrated. Read-only, as expected — payments are only ever created
server-side by Stripe webhooks, never by a direct frontend call.

---

## Webhook — `/api/webhook/stripe`

Backend-only (Stripe → server). No frontend integration needed or expected.

---

## Reviews — `/api/reviews` (`reviewStore.ts`)

| Route                           | Role     | Status         | Store action                                                                        |
| ------------------------------- | -------- | -------------- | ----------------------------------------------------------------------------------- |
| `POST /`                        | TENANT   | ✅             | `createReview`                                                                      |
| `GET /`                         | ADMIN    | ✅             | `fetchAllReviews`                                                                   |
| `GET /my-reviews`               | TENANT   | ✅             | `fetchMyReviews`                                                                    |
| `GET /reviews-to-my-properties` | LANDLORD | ✅             | `fetchReviewsToMyProperties`                                                        |
| `PUT /edit/:reviewId`           | TENANT   | ❌ **Missing** | no equivalent action                                                                |
| `PUT /status/:reviewId`         | ADMIN    | ✅             | `updateReviewStatus` — patches all three review lists locally instead of refetching |
| `DELETE /:reviewId`             | TENANT   | ✅             | `deleteReview` — also patches all three lists (and their counts) locally            |

**Gap:** `PUT /edit/:reviewId` (a tenant editing their own review) has no
store action. `createReview` and `deleteReview` exist, but there's
currently no way to edit an existing review without deleting and recreating
it.

---

## Known Inconsistencies (worth cleaning up)

1. **Error message extraction differs across stores.** Every store except
   `rentalRequestStore.ts` does:

    ```ts
    err instanceof Error ? err.message : "fallback";
    ```

    which, for an axios error, just yields something like `"Request failed
with status code 400"` instead of the backend's actual `message` field.
    `rentalRequestStore.ts` is the only one using a `getErrorMessage()`
    helper that reads `err.response.data.message` first. Recommend either:
    - moving `getErrorMessage()` into a shared `src/lib` utility and using it
      everywhere, or
    - handling this once in the `axios-client.ts` interceptor so every store
      gets a clean `Error` with the backend's message already attached.

2. **Refetch-after-mutation vs. local patch.** `amenityStore`,
   `categoryStore`, and `rentalRequestStore` all refetch the full list after
   a create/update/delete. `reviewStore` and `userStore` instead patch the
   relevant item(s) in local state. Both are valid strategies, but it's
   inconsistent — worth deciding on one approach per data-freshness needs
   (patching is cheaper but can drift from the server; refetching is always
   correct but costs a round trip).

3. **`isLoading` vs. `isRefetching` split** exists in `amenityStore`,
   `categoryStore`, and `rentalRequestStore` (so the UI can distinguish
   first load from a background refresh), but not in `paymentStore`,
   `rentalStore`, `reviewStore`, or `userStore`, which only have a single
   loading flag. Consider whether those should get the same treatment.

---

## Summary of Open Gaps

| Area       | Missing route                     | Impact                                                                                         |
| ---------- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| Rentals    | `GET /rentals/access/:propertyId` | No store-level way to do the access check the backend explicitly recommends for content gating |
| Reviews    | `PUT /reviews/edit/:reviewId`     | Tenants can't edit an existing review                                                          |
| Users      | `PUT /users/update-profile`       | No user can update their own profile                                                           |
| Users      | `POST /users/create-user`         | Admins can't create users directly (only via `/register`)                                      |
| Properties | entire store unverified           | Needs a follow-up audit once `propertyStore.ts` is available                                   |

Everything else in the backend's `/api/*` surface — auth, categories,
amenities, rental requests, payments, and reviews (aside from edit) — has
matching frontend store coverage.
