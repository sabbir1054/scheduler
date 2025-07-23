import { IBookingStatus } from '../app/modules/Booking/booking.interface';

export const getBookingStatus = (start: Date, end: Date): IBookingStatus => {
  const now = new Date();
  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Ongoing';
  return 'Past';
};
