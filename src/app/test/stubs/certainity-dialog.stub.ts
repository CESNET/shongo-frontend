import { of } from 'rxjs';

export class CertainityDialogStub {
  trueAfterClosed = true;

  open(): { afterClosed: any } {
    return {
      afterClosed: () => of(this.trueAfterClosed),
    };
  }
}
