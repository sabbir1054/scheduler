import { Booking } from '@prisma/client';
import httpStatus from 'http-status';
import {
  BUFFER_MINUTES,
  MAX_DURATION_MINUTES,
  MIN_DURATION_MINUTES,
} from '../app/modules/Booking/booking.constant';
import ApiError from '../errors/ApiError';
import prisma from '../shared/prisma';

export const validateBookingTime = (start: Date, end: Date) => {
  if (end <= start) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'End time must be after start time.',
    );
  }
};

export const validateDuration = (start: Date, end: Date): number => {
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

  return durationMinutes;
};

export const checkBookingConflict = async (
  resource: Booking['resource'],
  start: Date,
  end: Date,
  excludeBookingId?: string,
): Promise<void> => {
  const bufferStart = new Date(start.getTime() - BUFFER_MINUTES * 60 * 1000);
  const bufferEnd = new Date(end.getTime() + BUFFER_MINUTES * 60 * 1000);

  const conflict = await prisma.booking.findFirst({
    where: {
      resource,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
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
};
