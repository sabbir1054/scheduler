import express from 'express';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post('/', BookingController.createNewBooking);
router.get('/', BookingController.getAllBooking);
router.delete('/:id', BookingController.cancelBooking);
export const BookingRoutes = router;
