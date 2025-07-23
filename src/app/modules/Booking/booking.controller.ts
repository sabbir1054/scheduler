import { Booking } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookingFilterableFields } from './booking.constant';
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
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookingFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await BookingServices.getAllBooking(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking list fetched successfully !!',
    data: result,
  });
});

export const BookingController = {
  createNewBooking,
  getAllBooking,
};
