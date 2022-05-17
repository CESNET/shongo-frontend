import { Observable, of } from 'rxjs';

export class CertainityDialogStub {
  trueAfterClosed = true;

  open(): { afterClosed: () => Observable<boolean> } {
    return {
      afterClosed: () => of(this.trueAfterClosed),
    };
  }
}
