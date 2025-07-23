import express from 'express';
import { BookingRoutes } from '../modules/Booking/booking.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/booking',
    route: BookingRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
