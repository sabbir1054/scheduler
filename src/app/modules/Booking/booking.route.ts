import express from 'express';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post('/', BookingController.createNewBooking);
router.get('/', BookingController.getAllBooking);
export const BookingRoutes = router;
