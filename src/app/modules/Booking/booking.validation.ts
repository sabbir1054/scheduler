import z from 'zod';
import { RESOURCE_TYPE } from './booking.constant';

const createBookingValidation = z.object({
  resource: z.enum([...RESOURCE_TYPE] as [string, ...string[]], {
    required_error: 'Resource type is required',
  }),
  start: z
    .string({ required_error: 'Start time is required' })
    .refine(value => !isNaN(Date.parse(value)), {
      message: 'Start time must be a valid date',
    }),
  end: z
    .string({ required_error: 'End time is required' })
    .refine(value => !isNaN(Date.parse(value)), {
      message: 'End time must be a valid date',
    }),
  requestedBy: z.string({ required_error: 'Requested By is required' }),
});

const updateBookingValidation = z.object({
  resource: z.enum([...RESOURCE_TYPE] as [string, ...string[]]).optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  requestedBy: z.string().optional(),
});

export const BookingZodValidation = {
  createBookingValidation,
  updateBookingValidation,
};
