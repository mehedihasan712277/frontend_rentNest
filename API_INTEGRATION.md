# API Integration Map

Brief mapping of frontend stores / components → backend endpoints.  
Base URL: `https://server-rentnest.onrender.com/api` (proxied via `/api/proxy` in the Next.js app).

All authenticated requests send the JWT (cookie or `Authorization: Bearer`).

---

## Auth (`src/actions/auth.actions.ts`, login/register forms)

| Frontend                  | Method | Endpoint              | Role |
| ------------------------- | ------ | --------------------- | ---- |
| Login form                | POST   | `/auth/login`         | —    |
| Register form             | POST   | `/auth/register`      | —    |
| Refresh token             | POST   | `/auth/refresh-token` | —    |
| LogoutButton              | POST   | `/auth/logout`        | any  |
| Navbar / get-current-user | GET    | `/auth/me`            | any  |

---

## Users (`userStore.ts`)

| Store action / component         | Method | Endpoint                | Role  |
| -------------------------------- | ------ | ----------------------- | ----- |
| `fetchProfile` / UserProfileCard | GET    | `/users/my-profile`     | any   |
| `fetchAllUsers` / ManageUsers    | GET    | `/users/all`            | ADMIN |
| `updateUserStatus` / ManageUsers | PUT    | `/users/delete-account` | ADMIN |

---

## Categories (`categoryStore.ts`)

| Store action / component                        | Method | Endpoint          | Role   |
| ----------------------------------------------- | ------ | ----------------- | ------ |
| `fetchCategories` / GetCategory, ManageCategory | GET    | `/categories`     | public |
| `createCategory` / CreateCategoryForm           | POST   | `/categories`     | ADMIN  |
| `fetchCategoryDetails` / CategoryDetailsDialog  | GET    | `/categories/:id` | ADMIN  |
| `updateCategory` / EditCategoryDialog           | PUT    | `/categories/:id` | ADMIN  |
| `deleteCategory` / ManageCategory               | DELETE | `/categories/:id` | ADMIN  |

---

## Amenities (`amenityStore.ts`)

| Store action / component                     | Method | Endpoint         | Role            |
| -------------------------------------------- | ------ | ---------------- | --------------- |
| `fetchAmenities` / GetAmenity, ManageAmenity | GET    | `/amenities`     | public          |
| `createAmenity` / CreateAmenityForm          | POST   | `/amenities`     | ADMIN, LANDLORD |
| `fetchAmenityDetails` / AmenityDetailsDialog | GET    | `/amenities/:id` | ADMIN           |
| `deleteAmenity` / ManageAmenity              | DELETE | `/amenities/:id` | ADMIN, LANDLORD |

---

## Properties (`propertyStore.ts`)

| Store action / component                                                      | Method | Endpoint                        | Role            |
| ----------------------------------------------------------------------------- | ------ | ------------------------------- | --------------- |
| `fetchProperties` + filters / PropertyCard, PropertyFilters                   | GET    | `/properties?…`                 | public          |
| `fetchPropertyDetails` / properties/[id]                                      | GET    | `/properties/:id`               | public          |
| `createProperty` / AddProperty                                                | POST   | `/properties`                   | LANDLORD        |
| `updateProperty` / EditPropertyDialog                                         | PUT    | `/properties/:id`               | LANDLORD        |
| `deleteProperty` / ManageProperty                                             | DELETE | `/properties/:id`               | LANDLORD        |
| `changePropertyStatus` / ManageProperty                                       | PUT    | `/properties/change-status/:id` | LANDLORD        |
| `fetchMyProperties` / GetMyProperties, ManageProperty                         | GET    | `/properties/my-properties`     | LANDLORD, ADMIN |
| `fetchAdminProperties` + adminFilters / GetAdminProperties, AdminPropertyList | GET    | `/properties/admin?…`           | ADMIN           |

---

## Rental Requests (`rentalRequestStore.ts`)

| Store action / component                                                   | Method | Endpoint                                | Role     |
| -------------------------------------------------------------------------- | ------ | --------------------------------------- | -------- |
| `createRentalRequest` / RequestToRentButton                                | POST   | `/rental-requests`                      | TENANT   |
| `fetchMySentRequests` / MySentRentalRequest                                | GET    | `/rental-requests/my-sent-request`      | TENANT   |
| `tenantDeleteRequest` / MySentRentalRequest                                | PUT    | `/rental-requests/tenant-delete/:id`    | TENANT   |
| `subscribeToRentalRequest` / MySentRentalRequest (Stripe Checkout)         | POST   | `/rental-requests/:id/subscribe`        | TENANT   |
| `fetchRequestsToMe` / RentalRequestToMyProperties, ManageRequestToProperty | GET    | `/rental-requests/rental-request-to-me` | LANDLORD |
| `updateRentalRequestStatus` / ManageRequestToProperty                      | PUT    | `/rental-requests/:id`                  | LANDLORD |
| `fetchAllRentalRequests` / AllRentalRequest                                | GET    | `/rental-requests`                      | ADMIN    |
| `adminDeleteRequest` / AllRentalRequest                                    | DELETE | `/rental-requests/:id`                  | ADMIN    |

---

## Rentals (`rentalStore.ts`)

| Store action / component                    | Method | Endpoint                       | Role     |
| ------------------------------------------- | ------ | ------------------------------ | -------- |
| `fetchMyRentals` / MyRentals                | GET    | `/rentals/my-rentals`          | TENANT   |
| `fetchMyPropertyRentals` / MyRentedProperty | GET    | `/rentals/my-property-rentals` | LANDLORD |
| `fetchAllRentals` / AllRentalInfo           | GET    | `/rentals/all-rental-info`     | ADMIN    |

_(Content gating can also call `GET /rentals/access/:propertyId` — TENANT.)_

---

## Payments (`paymentStore.ts`)

| Store action / component                        | Method | Endpoint                         | Role     |
| ----------------------------------------------- | ------ | -------------------------------- | -------- |
| `fetchAllPayments` / AllPayments                | GET    | `/payments`                      | ADMIN    |
| `fetchMyPayments` / MyPayment                   | GET    | `/payments/my-payments`          | TENANT   |
| `fetchMyPropertyPayments` / PaymentOnMyProperty | GET    | `/payments/my-property-payments` | LANDLORD |

---

## Reviews (`reviewStore.ts`)

| Store action / component                           | Method | Endpoint                            | Role     |
| -------------------------------------------------- | ------ | ----------------------------------- | -------- |
| `fetchAllReviews` / ManageAllReviews               | GET    | `/reviews`                          | ADMIN    |
| `fetchReviewsToMyProperties` / ReviewsToMyproperty | GET    | `/reviews/reviews-to-my-properties` | LANDLORD |
| `fetchMyReviews` / MyGivenReviews                  | GET    | `/reviews/my-reviews`               | TENANT   |
| `createReview`                                     | POST   | `/reviews`                          | TENANT   |
| `updateReviewStatus` / ManageAllReviews            | PUT    | `/reviews/status/:id`               | ADMIN    |
| `deleteReview`                                     | DELETE | `/reviews/:id`                      | TENANT   |

---

## Stripe / Checkout pages

| Frontend                                   | Backend interaction                                                                                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checkout/success`, `checkout/cancel/[id]` | UI only — state is driven by Stripe webhooks (`POST /webhook/stripe`) which update `RentalRequest` → `COMPLETED` and create/sync `Rental` + `Payment` rows. |
| `subscribeToRentalRequest`                 | Returns Stripe Checkout URL; tenant is redirected.                                                                                                          |

---

## Quick role → dashboard map

| Role         | Main dashboard components                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **ADMIN**    | ManageCategory, ManageAmenity, GetAdminProperties, AllRentalRequest, AllRentalInfo, AllPayments, ManageAllReviews, ManageUsers       |
| **LANDLORD** | ManageAmenity, AddProperty / ManageProperty, RentalRequestToMyProperties, MyRentedProperty, PaymentOnMyProperty, ReviewsToMyproperty |
| **TENANT**   | MySentRentalRequest, MyRentals, MyPayment, MyGivenReviews + public property browse / RequestToRentButton                             |
