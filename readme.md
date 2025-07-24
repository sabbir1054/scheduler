### Scheduler Backend

Resource Booking System

A **full-stack resource booking application** designed to manage shared resources such as meeting rooms, projectors, or laptops. The system prevents overlapping bookings by applying a 10-minute buffer and includes features like conflict detection, status tags (Upcoming, Ongoing, Past), and availability checks.

---

#### Frontend Live Link:

#### Backend Live Link:

#### Backend Repository Link: https://github.com/sabbir1054/scheduler

#### Frontend Repository Link: https://github.com/sabbir1054/scheduler_frontend

## 🚀 Features

- **Booking Management**

  - Book resources with fields: **Resource, Start Time, End Time, Requested By**.
  - Minimum booking duration of **15 minutes** and maximum of **2 hours**.
  - **10-minute buffer time** applied before and after bookings.
  - Create, update, and cancel bookings.

- **Conflict Detection**

  - Prevents overlapping bookings or bookings that violate buffer times.

- **Availability Check**

  - Provides available time slots for a specific resource on a given date.

- **Booking Dashboard**
  - Lists all bookings grouped by resource.
  - Displays status tags: **Upcoming**, **Ongoing**, and **Past**.
  - Filtering by resource, date, and booking status.

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript.
- **Backend:** Express.js (TypeScript), Prisma ORM.
- **Database:** SQLite (default), easily switchable to PostgreSQL/MySQL.
- **Validation:** Zod for request payload validation.

---

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/resource-booking-system.git
   cd resource-booking-system
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Migrate database:**

   ```bash
   npx prisma migrate dev
   ```

4. **Run the server:**
   ```bash
   yarn run dev
   ```

---

## 🔑 API Endpoints

### **Booking APIs**

- **POST** `/api/bookings` – Create a new booking (with conflict checks).
- **GET** `/api/bookings` – Get all bookings (supports filtering by `resource`, `date`, and `status`).
- **GET** `/api/bookings/grouped` – List bookings grouped by resource.
- **PUT** `/api/bookings/:id` – Update an existing booking (with validation and conflict detection).
- **DELETE** `/api/bookings/:id` – Cancel a booking.
- **GET** `/api/bookings/available-slots` – Get available time slots for a resource on a given date.

---

## 📂 Project Structure

```
src/
  └── app/
      └── modules/
          └── booking/
              ├── booking.service.ts
              ├── booking.controller.ts
              ├── booking.route.ts
              ├── booking.helper.ts
              ├── booking.constant.ts
              ├── booking.validation.ts
              └── bookingAvailability.helper.ts
```

---
