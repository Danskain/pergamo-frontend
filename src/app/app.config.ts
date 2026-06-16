import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbMenuModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      NbEvaIconsModule,
      NbThemeModule.forRoot({ name: 'default' }),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot()
    )
  ]
};
