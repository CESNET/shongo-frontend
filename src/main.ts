import { enableProdMode, InjectionToken } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Preloader } from './preloader';

if (environment.production) {
  enableProdMode();
}

export const PRELOADER = new InjectionToken<Preloader>('PRELOADER');
const preloaderEl = document.querySelector<HTMLElement>('#preloader');
const preloaderInstance = new Preloader(preloaderEl!);

const preloaderProvider = {
  provide: PRELOADER,
  useValue: preloaderInstance,
};

platformBrowserDynamic([preloaderProvider])
  .bootstrapModule(AppModule)
  .then(() => {
    preloaderInstance.destroy();
  })
  .catch((err: Error) => {
    console.error(err);
  });
