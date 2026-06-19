import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule
} from '@nebular/theme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      NbEvaIconsModule,
      NbThemeModule.forRoot({ name: 'default' }),
      NbToastrModule.forRoot(),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot()
    )
  ]
};
