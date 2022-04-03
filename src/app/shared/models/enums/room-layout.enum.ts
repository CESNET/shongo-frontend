export enum RoomLayout {
  /**
   * Other
   */
  OTHER = 'OTHER',

  /**
   * Only a single, fixed participant is displayed.
   */
  SPEAKER = 'SPEAKER',

  /**
   * A fixed participant is in the upper-left corner, other participants around.
   */
  SPEAKER_CORNER = 'SPEAKER_CORNER',

  /**
   * All participants are spread in a regular grid.
   */
  GRID = 'GRID',
}
