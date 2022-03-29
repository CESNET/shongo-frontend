export class RequestNotEditableError extends Error {
  constructor() {
    super($localize`Reservation request is not editable.`);
    this.name = 'RequestNotEditableError';
  }
}
