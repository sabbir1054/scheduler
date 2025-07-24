import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookingController } from './booking.controller';
import { BookingZodValidation } from './booking.validation';

const router = express.Router();
router.get('/available-slots', BookingController.getAvailableSlots);
router.post(
  '/',
  validateRequest(BookingZodValidation.createBookingValidation),
  BookingController.createNewBooking,
);
router.get('/', BookingController.getAllBooking);
router.get('/groupBy', BookingController.listBookingsGroupedByResource);
router.delete('/:id', BookingController.cancelBooking);
router.patch(
  '/:id',
  validateRequest(BookingZodValidation.updateBookingValidation),
  BookingController.updateBooking,
);

export const BookingRoutes = router;
