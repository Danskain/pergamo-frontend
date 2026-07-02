import { Injectable, inject } from '@angular/core';

import { AuthSessionService, PergamoAuthMessage } from './auth-session.service';
import { LegacyLogoutRedirectService } from './legacy-logout-redirect.service';
import { resolveLegacyAppOrigins } from './runtime-auth-config';

@Injectable({ providedIn: 'root' })
export class LegacyAuthBridgeService {
  private readonly authSession = inject(AuthSessionService);
  private readonly legacyLogoutRedirect = inject(LegacyLogoutRedirectService);
  private readonly allowedOrigins = new Set(resolveLegacyAppOrigins());
  private readonly handshakeTimeoutMs = 1500;

  private initialized = false;

  initialize(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    window.addEventListener('message', this.handleMessage);
    this.initialized = true;

    if (this.authSession.hasValidSession()) {
      return;
    }

    this.authSession.beginExternalAuthHandshake();

    window.setTimeout(() => {
      if (this.authSession.hasValidSession()) {
        this.authSession.finishExternalAuthHandshake();
        return;
      }

      this.authSession.clearSession();
      this.legacyLogoutRedirect.redirect();
    }, this.handshakeTimeoutMs);
  }

  private readonly handleMessage = (event: MessageEvent<unknown>): void => {
    if (!this.allowedOrigins.has(event.origin)) {
      return;
    }

    if (!this.isPergamoAuthMessage(event.data)) {
      return;
    }

    this.authSession.saveFromMessage(event.data);
  };

  private isPergamoAuthMessage(value: unknown): value is PergamoAuthMessage {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<PergamoAuthMessage>;

    return candidate.type === 'PERGAMO_AUTH' && typeof candidate.access_token === 'string';
  }
}
