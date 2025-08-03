import express from 'express';
import { BookingRoutes } from '../modules/Booking/booking.route';
import { AuthRouter } from '../modules/auth/auth.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/booking',
    route: BookingRoutes,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
