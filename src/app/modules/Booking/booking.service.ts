import { Booking } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { getBookingStatus } from '../../../helpers/bookingStatus';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import {
  bookingSearchableFields,
  BUFFER_MINUTES,
  MAX_DURATION_MINUTES,
  MIN_DURATION_MINUTES,
} from './booking.constant';

const createNewBooking = async (payload: Booking): Promise<Booking> => {
  const start = new Date(payload.start);
  const end = new Date(payload.end);

  //* Validate start/end time
  if (end <= start) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'End time must be after start time.',
    );
  }

  //* validate duration
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  if (durationMinutes < MIN_DURATION_MINUTES) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Booking duration must be at least ${MIN_DURATION_MINUTES} minutes.`,
    );
  }
  if (durationMinutes > MAX_DURATION_MINUTES) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Booking duration cannot exceed ${MAX_DURATION_MINUTES} minutes.`,
    );
  }

  //* Add buffer time to check conflicts
  const bufferStart = new Date(start.getTime() - BUFFER_MINUTES * 60 * 1000);
  const bufferEnd = new Date(end.getTime() + BUFFER_MINUTES * 60 * 1000);

  const conflict = await prisma.booking.findFirst({
    where: {
      resource: payload.resource,
      OR: [
        {
          start: { lt: bufferEnd },
          end: { gt: bufferStart },
        },
      ],
    },
  });

  if (conflict) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Booking conflicts with another booking (including buffer time).',
    );
  }

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

export const BookingServices = {
  createNewBooking,
  getAllBooking,
  cancelBooking,
};
