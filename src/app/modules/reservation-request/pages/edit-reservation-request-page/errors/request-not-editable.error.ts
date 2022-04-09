export class RequestNotEditableError extends Error {
  constructor() {
    super($localize`:error message:Reservation request is not editable.`);
    this.name = 'RequestNotEditableError';
  }
}
