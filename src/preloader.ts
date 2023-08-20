export class Preloader {
  constructor(private _preloaderElement: HTMLElement) {}

  destroy(): void {
    this._preloaderElement.classList.add('loaded');

    setTimeout(() => {
      this._preloaderElement.remove();
    }, 300);
  }
}
