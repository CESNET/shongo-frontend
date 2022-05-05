// Lengths
// -------

/**
 * Maximal length of room name.
 */
export const ROOM_NAME_MAXLENGTH = 100;

/**
 * Maximal length of room description.
 */
export const ROOM_DESCRIPTION_MAXLENGTH = 200;

/**
 * Maximal length of room PIN number.
 */
export const PIN_MINLENGTH = 4;

// Regex
// -------

/**
 * Regex patter for room name.
 */
export const ROOM_NAME_PATTERN = /^[a-z0-9\-\_]+$/i;

/**
 * Regex pattern for room PIN number.
 */
export const PIN_PATTERN = /^[0-9]+$/;
