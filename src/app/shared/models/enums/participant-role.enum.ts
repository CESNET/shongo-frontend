export enum ParticipantRole {
  /**
   * Represents a normal user who can join to a meeting.
   */
  PARTICIPANT = 'PARTICIPANT',
  /**
   * Represents a user who can join to a meeting and
   * who can configure basic settings to allow him to run a presentation.
   */
  PRESENTER = 'PRESENTER',
  /**
   * Represents a user who administrates the meeting and thus he can do all possible actions and configurations.
   */
  ADMINISTRATOR = 'ADMINISTRATOR',
}
