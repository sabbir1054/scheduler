import { Booking } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import {
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

export const BookingServices = {
  createNewBooking,
};
