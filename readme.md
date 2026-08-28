# RentNest — Frontend

The frontend for **RentNest**, a property rental marketplace where landlords
list properties, tenants apply and rent them, and Stripe handles recurring
monthly billing end-to-end.

Built with **Next.js (App Router)**, **TypeScript**, **Zustand**, **Axios**,
and **shadcn/ui**, consuming the [RentNest API](#backend).

**Live app:** [https://frontend-rentnest.vercel.app/](https://frontend-rentnest.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Roles & Dashboards](#roles--dashboards)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## Overview

RentNest connects **landlords**, **tenants**, and **admins** in a single
marketplace:

- **Landlords** list properties, manage amenities, review and approve/reject
  rental requests, and track rentals and payments on their properties.
- **Tenants** browse listings, submit rental requests, and — once approved —
  pay via Stripe Checkout to activate a recurring monthly subscription, then
  track their rentals, payments, and reviews.
- **Admins** get platform-wide visibility into users, properties,
  categories, amenities, rental requests, rentals, payments, and reviews.

This repo is the client only. It talks to the RentNest API for all data and
auth; see [API Integration](#api-integration) below.

---

## Tech Stack

| Layer            | Technology                                                         |
| ---------------- | ------------------------------------------------------------------ |
| Framework        | Next.js (App Router) + TypeScript                                  |
| State management | Zustand                                                            |
| HTTP client      | Axios (`src/lib/axios-client.ts`)                                  |
| UI components    | shadcn/ui (Radix primitives) + Tailwind                            |
| Auth             | JWT via httpOnly cookies (see `lib/auth-cookies.ts`, `lib/jwt.ts`) |
| Payments         | Stripe Checkout (redirect flow)                                    |

---

## Project Structure

```
.
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── actions
│   │   └── auth.actions.ts
│   ├── app
│   │   ├── api
│   │   │   └── proxy
│   │   │       └── [...path]
│   │   │           └── route.ts
│   │   ├── (private)
│   │   │   ├── checkout
│   │   │   │   ├── cancel
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── success
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard
│   │   │   │   ├── admin
│   │   │   │   │   ├── _components
│   │   │   │   │   │   ├── amenity
│   │   │   │   │   │   │   ├── AmenityDetailsDialog.tsx
│   │   │   │   │   │   │   ├── AmenityFeedbackDialof.tsx
│   │   │   │   │   │   │   ├── CreateAmenityForm.tsx
│   │   │   │   │   │   │   ├── GetAmenity.tsx
│   │   │   │   │   │   │   └── ManageAmenity.tsx
│   │   │   │   │   │   ├── category
│   │   │   │   │   │   │   ├── CategoryDetailsDialog.tsx
│   │   │   │   │   │   │   ├── CategoryFeedbackDialog.tsx
│   │   │   │   │   │   │   ├── CreateCategoryForm.tsx
│   │   │   │   │   │   │   ├── EditCategoryDialog.tsx
│   │   │   │   │   │   │   ├── GetCategory.tsx
│   │   │   │   │   │   │   └── ManageCategory.tsx
│   │   │   │   │   │   ├── payment
│   │   │   │   │   │   │   └── AllPayments.tsx
│   │   │   │   │   │   ├── properties
│   │   │   │   │   │   │   ├── AdminPropertyDetailsSheet.tsx
│   │   │   │   │   │   │   ├── AdminPropertyFilter.tsx
│   │   │   │   │   │   │   ├── AdminPropertyList.tsx
│   │   │   │   │   │   │   └── GetAdminProperties.tsx
│   │   │   │   │   │   ├── rentals
│   │   │   │   │   │   │   └── AllRentalInfo.tsx
│   │   │   │   │   │   ├── requests
│   │   │   │   │   │   │   └── AllRentalRequest.tsx
│   │   │   │   │   │   ├── review
│   │   │   │   │   │   │   └── ManageAllReviews.tsx
│   │   │   │   │   │   └── users
│   │   │   │   │   │       └── ManageUsers.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── landlord
│   │   │   │   │   ├── _components
│   │   │   │   │   │   ├── amenity
│   │   │   │   │   │   │   ├── AmenityFeedbackDialof.tsx
│   │   │   │   │   │   │   ├── AmenityMetaDetails.tsx
│   │   │   │   │   │   │   ├── CreateAmenityForm.tsx
│   │   │   │   │   │   │   ├── GetAmenity.tsx
│   │   │   │   │   │   │   └── ManageAmenity.tsx
│   │   │   │   │   │   ├── payment
│   │   │   │   │   │   │   └── PaymentOnMyProperty.tsx
│   │   │   │   │   │   ├── properties
│   │   │   │   │   │   │   ├── AddProperty.tsx
│   │   │   │   │   │   │   ├── EditPropertyDialog.tsx
│   │   │   │   │   │   │   ├── GetMyProperties.tsx
│   │   │   │   │   │   │   ├── ManageProperty.tsx
│   │   │   │   │   │   │   ├── PropertyDetailsDialog.tsx
│   │   │   │   │   │   │   └── PropertyFeedbackDialog.tsx
│   │   │   │   │   │   ├── rented-property
│   │   │   │   │   │   │   └── MyRentedProperty.tsx
│   │   │   │   │   │   ├── requests
│   │   │   │   │   │   │   ├── ManageRequestToProperty.tsx
│   │   │   │   │   │   │   └── RentalRequestToMyProperties.tsx
│   │   │   │   │   │   └── review
│   │   │   │   │   │       └── ReviewsToMyproperty.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── tenant
│   │   │   │       ├── _components
│   │   │   │       │   ├── myrentals
│   │   │   │       │   │   └── MyRentals.tsx
│   │   │   │       │   ├── my-sent-rental-request
│   │   │   │       │   │   └── MySentRentalRequest.tsx
│   │   │   │       │   ├── payment
│   │   │   │       │   │   └── MyPayment.tsx
│   │   │   │       │   └── reviews
│   │   │   │       │       └── MyGivenReviews.tsx
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)
│   │   │   ├── about
│   │   │   │   └── page.tsx
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   ├── login-form.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register
│   │   │   │       ├── page.tsx
│   │   │   │       └── register-form.tsx
│   │   │   └── properties
│   │   │       ├── _components
│   │   │       │   ├── PropertyCard.tsx
│   │   │       │   ├── PropertyFilters.tsx
│   │   │       │   └── RequestToRentButton.tsx
│   │   │       ├── [id]
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── provider
│   │   │   └── theme-provider.tsx
│   │   ├── shared
│   │   │   ├── Footer.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavLink.tsx
│   │   │   ├── ThemeSwitcher.tsx
│   │   │   └── UserProfileCard.tsx
│   │   └── ui
│   │       ├── alert-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── password-input.tsx
│   │       ├── select.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   ├── lib
│   │   ├── auth-config.ts
│   │   ├── auth-cookies.ts
│   │   ├── axios-client.ts
│   │   ├── get-current-user.ts
│   │   ├── jwt.ts
│   │   └── utils.ts
│   ├── store
│   │   ├── amenityStore.ts
│   │   ├── categoryStore.ts
│   │   ├── paymentStore.ts
│   │   ├── propertyStore.ts
│   │   ├── rentalRequestStore.ts
│   │   ├── rentalStore.ts
│   │   ├── reviewStore.ts
│   │   └── userStore.ts
│   └── proxy.ts
├── AGENTS.md
├── API_INTEGRATION.md
├── CLAUDE.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── readme.md
└── tsconfig.json
```

A few notes on the layout:

- **`app/(public)`** — routes anyone can hit: property browsing, property
  detail, login/register, about.
- **`app/(private)`** — routes behind auth, further split by role under
  `dashboard/admin`, `dashboard/landlord`, and `dashboard/tenant`, plus the
  Stripe `checkout/success` and `checkout/cancel` redirect pages.
- **`app/api/proxy/[...path]`** — a catch-all Next.js route used to proxy
  requests to the backend where needed (e.g. to keep the httpOnly auth
  cookie attached server-side).
- **`store/`** — one Zustand store per backend resource (`amenityStore`,
  `categoryStore`, `paymentStore`, `propertyStore`, `rentalRequestStore`,
  `rentalStore`, `reviewStore`, `userStore`), each wrapping the matching
  `/api/*` module on the backend.
- **`lib/axios-client.ts`** — the shared Axios instance every store calls
  into.
- **`actions/auth.actions.ts`** — Next.js server actions for login,
  register, and logout, working alongside `lib/auth-cookies.ts` and
  `lib/jwt.ts`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [RentNest API](#backend) (local or the hosted
  one below)

### Installation

```bash
git clone <repo-url>
cd rentnest-frontend
npm install
```

### Run the dev server

```bash
npm run dev
```

The app starts on `http://localhost:3000` by default.

---

## Environment Variables

Create a `.env` (or `.env.local`) file in the project root:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://server-rentnest.onrender.com
```

> Point this at your own local backend (e.g. `http://localhost:5000`) during
> development, or leave it as the hosted URL above to develop against the
> live API. Double-check the exact variable name against
> `src/lib/axios-client.ts`, since that file is the single source of truth
> for how the base URL is read.

---

## API Integration

<a id="backend"></a>
This frontend is a client for the **RentNest API**
(`https://server-rentnest.onrender.com`) — an Express + Prisma + PostgreSQL
backend with Stripe Subscriptions for recurring monthly rent.

For the current, resource-by-resource status of which backend endpoints
each Zustand store integrates (and which are still missing), see
[`API_INTEGRATION.md`](./API_INTEGRATION.md).

Renting a property is a multi-step lifecycle handled entirely by the
backend and reflected here through the stores:

1. Tenant submits a rental request (`rentalRequestStore`).
2. Landlord approves or rejects it (`rentalRequestStore`).
3. Tenant hits "Subscribe," which creates a Stripe Checkout session and
   redirects them to Stripe (`rentalRequestStore.subscribeToRentalRequest`).
4. On success, Stripe redirects back to `checkout/success`; on
   cancellation, to `checkout/cancel/[id]`.
5. The backend's Stripe webhooks keep `Rental` status in sync
   (`ACTIVE`, `PAST_DUE`, `CANCELED`) independently of any frontend action —
   the frontend just reads that state via `rentalStore`.

---

## Roles & Dashboards

| Role       | Dashboard route      | Can do                                                                                                                           |
| ---------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `TENANT`   | `dashboard/tenant`   | Browse properties, send rental requests, subscribe/pay, view own rentals, payments, and reviews                                  |
| `LANDLORD` | `dashboard/landlord` | List/manage properties and amenities, approve/reject requests, view rentals and payments on their properties, respond to reviews |
| `ADMIN`    | `dashboard/admin`    | Manage users, categories, amenities, all properties, all rental requests, all rentals, all payments, moderate reviews            |

---

## Scripts

| Script          | Purpose                              |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server with hot reload |
| `npm run build` | Production build                     |
| `npm start`     | Run the production build             |
| `npm run lint`  | Run ESLint                           |

---

## Deployment

Currently deployed on **Vercel**:
[https://frontend-rentnest.vercel.app/](https://frontend-rentnest.vercel.app/)
