export type IGetBookingFilters = {
  resource?: string;
  date?: string;
};
export type IBookingStatus = 'Upcoming' | 'Ongoing' | 'Past';

export type IResourceType =
  | 'MEETING_ROOM_A'
  | 'MEETING_ROOM_B'
  | 'CONFERENCE_HALL'
  | 'PROJECTOR'
  | 'LAPTOP';
