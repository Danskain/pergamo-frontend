import { Injectable, NgZone, inject } from '@angular/core';

import { AuthSessionService, PergamoAuthMessage } from './auth-session.service';
import { LegacyLogoutRedirectService } from './legacy-logout-redirect.service';
import { resolveLegacyAppOrigins } from './runtime-auth-config';

@Injectable({ providedIn: 'root' })
export class LegacyAuthBridgeService {
  private readonly authSession = inject(AuthSessionService);
  private readonly legacyLogoutRedirect = inject(LegacyLogoutRedirectService);
  private readonly ngZone = inject(NgZone);
  private readonly allowedOrigins = new Set(resolveLegacyAppOrigins());
  private readonly handshakeTimeoutMs = 1500;

  private initialized = false;
  private initializationPromise: Promise<void> | null = null;
  private finishInitialization: (() => void) | null = null;

  initialize(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (!this.initialized) {
      window.addEventListener('message', this.handleMessage);
      this.initialized = true;
    }

    this.authSession.clearSession();
    this.authSession.beginExternalAuthHandshake();

    this.initializationPromise = new Promise<void>((resolve) => {
      this.finishInitialization = () => {
        this.authSession.finishExternalAuthHandshake();
        this.finishInitialization = null;
        resolve();
      };

      window.setTimeout(() => {
        if (this.authSession.hasValidSession()) {
          this.finishInitialization?.();
          return;
        }

        this.authSession.clearSession();
        this.finishInitialization?.();
        this.legacyLogoutRedirect.redirect();
      }, this.handshakeTimeoutMs);
    });

    return this.initializationPromise;
  }

  private readonly handleMessage = (event: MessageEvent<unknown>): void => {
    console.log('TOKEN RECIBIDO:', (event.data as { access_token?: string })?.access_token);
    if (!this.allowedOrigins.has(event.origin)) {
      return;
    }

    if (!this.isPergamoAuthMessage(event.data)) {
      return;
    }

    const authMessage = event.data;

    this.ngZone.run(() => {
      this.authSession.saveFromMessage(authMessage);
      this.finishInitialization?.();
    });
  };

  private isPergamoAuthMessage(value: unknown): value is PergamoAuthMessage {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<PergamoAuthMessage>;

    return candidate.type === 'PERGAMO_AUTH' && typeof candidate.access_token === 'string';
  }
}
