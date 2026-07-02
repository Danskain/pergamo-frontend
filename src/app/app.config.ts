import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule
} from '@nebular/theme';

import { LegacyAuthBridgeService } from './core/auth/legacy-auth-bridge.service';
import { authTokenInterceptor } from './core/auth/auth-token.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [LegacyAuthBridgeService],
      useFactory: (legacyAuthBridge: LegacyAuthBridgeService) => () => legacyAuthBridge.initialize()
    },
    importProvidersFrom(
      NbEvaIconsModule,
      NbThemeModule.forRoot({ name: 'default' }),
      NbToastrModule.forRoot(),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot()
    )
  ]
};
