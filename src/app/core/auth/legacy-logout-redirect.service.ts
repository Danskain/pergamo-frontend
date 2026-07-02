import { Injectable } from '@angular/core';

import { resolveLegacyLogoutUrl } from './runtime-auth-config';

@Injectable({ providedIn: 'root' })
export class LegacyLogoutRedirectService {
  private redirecting = false;

  redirect(): void {
    if (this.redirecting || typeof window === 'undefined') {
      return;
    }

    this.redirecting = true;
    window.location.assign(resolveLegacyLogoutUrl());
  }
}
