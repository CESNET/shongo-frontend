export enum ExecutableState {
  /**
   * Executable has not been started yet.
   */
  NOT_STARTED = 'NOT_STARTED',

  /**
   * Executable is already started.
   */
  STARTED = 'STARTED',

  /**
   * Executable failed to start.
   */
  STARTING_FAILED = 'STARTING_FAILED',

  /**
   * Executable has been already stopped.
   */
  STOPPED = 'STOPPED',

  /**
   * Executable failed to stop.
   */
  STOPPING_FAILED = 'STOPPING_FAILED',
}
