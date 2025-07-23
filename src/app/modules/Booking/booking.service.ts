import { Booking } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { getBookingStatus } from '../../../helpers/bookingStatus';
import {
  checkBookingConflict,
  validateBookingTime,
  validateDuration,
} from '../../../helpers/bookingTimeValidator';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import { bookingSearchableFields } from './booking.constant';

const createNewBooking = async (payload: Booking): Promise<Booking> => {
  const start = new Date(payload.start);
  const end = new Date(payload.end);

  //* Validate start/end time
  validateBookingTime(start, end);

  //* validate duration
  const durationMinutes = validateDuration(start, end);

  //* check conflicts
  await checkBookingConflict(payload.resource, start, end);

  const result = await prisma.booking.create({
    data: { ...payload, durationMinutes: durationMinutes },
  });
  return result;
};

const getAllBooking = async (
  filters: any,
  options: IPaginationOptions,
): Promise<IGenericResponse<Booking[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, resource, date, status } = filters;

  const andConditions: any[] = [];

  // Search by requestedBy
  if (searchTerm) {
    andConditions.push({
      OR: bookingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Filter by resource if provided
  if (resource) {
    andConditions.push({
      resource: resource,
    });
  }

  // Filter by specific date if provided
  if (date) {
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    andConditions.push({
      start: { gte: startOfDay },
    });
    andConditions.push({
      end: { lte: endOfDay },
    });
  }

  //filtered based on status
  if (status) {
    if (status === 'upcoming') {
      andConditions.push({ start: { gt: new Date() } });
    }
    if (status === 'past') {
      andConditions.push({ end: { lt: new Date() } });
    }
    if (status === 'ongoing') {
      andConditions.push({
        start: { lte: new Date() },
        end: { gte: new Date() },
      });
    }
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      status === 'past'
        ? { end: 'desc' }
        : options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { start: 'asc' },
  });

  const total = await prisma.booking.count({
    where: whereConditions,
  });

  // Add status tags (Upcoming, Ongoing, Past)
  const bookingsWithStatus = result.map(booking => ({
    ...booking,
    status: getBookingStatus(booking.start, booking.end),
  }));

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: bookingsWithStatus,
  };
};
const cancelBooking = async (id: string): Promise<Booking> => {
  const isBookingExist = await prisma.booking.findUnique({ where: { id } });
  if (!isBookingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found.');
  }

  const result = await prisma.booking.delete({ where: { id } });
  return result;
};

const updateBooking = async (
  id: string,
  payload: Partial<Booking>,
): Promise<Booking> => {
  const existingBooking = await prisma.booking.findUnique({ where: { id } });
  if (!existingBooking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found.');
  }

  const start = payload.start ? new Date(payload.start) : existingBooking.start;
  const end = payload.end ? new Date(payload.end) : existingBooking.end;
  const resource = payload.resource
    ? payload.resource
    : existingBooking.resource;

  //* Validate start/end time
  validateBookingTime(start, end);

  //* validate duration
  const durationMinutes = validateDuration(start, end);

  //* check conflicts
  await checkBookingConflict(resource, start, end);

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      ...payload,
      start,
      end,
      durationMinutes,
    },
  });

  return updatedBooking;
};

export const BookingServices = {
  createNewBooking,
  getAllBooking,
  cancelBooking,
  updateBooking,
};
