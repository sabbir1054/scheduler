import { Booking } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingServices } from './booking.service';

const createNewBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.createNewBooking(req.body);
  sendResponse<Booking>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking confirmed successfully.',
    data: result,
  });
});

export const BookingController = {
  createNewBooking,
};
