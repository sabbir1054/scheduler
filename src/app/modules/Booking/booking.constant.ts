export const BUFFER_MINUTES = 10;
export const MIN_DURATION_MINUTES = 15;
export const MAX_DURATION_MINUTES = 120;
export const RESOURCE_TYPE = [
  'MEETING_ROOM_A',
  'MEETING_ROOM_B',
  'CONFERENCE_HALL',
  'PROJECTOR',
  'LAPTOP',
];

export const bookingSearchableFields: string[] = ['requestedBy'];

export const bookingFilterableFields: string[] = [
  'searchTerm',
  'resource',
  'date',
  'status',
];
