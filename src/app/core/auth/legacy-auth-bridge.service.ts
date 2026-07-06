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
    // #region debug-point E:bridge-initialize
    fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'topbar-token-sync',
        runId: 'pre-fix',
        hypothesisId: 'E',
        location: 'legacy-auth-bridge.service.ts:33',
        msg: '[DEBUG] bridge initialize started',
        data: {
          allowedOrigins: Array.from(this.allowedOrigins),
          href: window.location.href
        },
        ts: Date.now()
      })
    }).catch(() => {});
    // #endregion

    this.initializationPromise = new Promise<void>((resolve) => {
      this.finishInitialization = () => {
        this.authSession.finishExternalAuthHandshake();
        // #region debug-point E:bridge-finish
        fetch('http://127.0.0.1:7777/event', {
          method: 'POST',
          body: JSON.stringify({
            sessionId: 'topbar-token-sync',
            runId: 'pre-fix',
            hypothesisId: 'E',
            location: 'legacy-auth-bridge.service.ts:41',
            msg: '[DEBUG] bridge initialization finished',
            data: {
              hasValidSession: this.authSession.hasValidSession()
            },
            ts: Date.now()
          })
        }).catch(() => {});
        // #endregion
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
    // #region debug-point A:bridge-message
    fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'topbar-token-sync',
        runId: 'pre-fix',
        hypothesisId: 'A',
        location: 'legacy-auth-bridge.service.ts:81',
        msg: '[DEBUG] bridge message received',
        data: {
          origin: event.origin,
          hasAccessToken:
            typeof (event.data as { access_token?: unknown })?.access_token === 'string',
          type: (event.data as { type?: unknown })?.type ?? null
        },
        ts: Date.now()
      })
    }).catch(() => {});
    // #endregion
    if (!this.allowedOrigins.has(event.origin)) {
      return;
    }

    if (!this.isPergamoAuthMessage(event.data)) {
      return;
    }

    const authMessage = event.data;

    this.ngZone.run(() => {
      this.authSession.saveFromMessage(authMessage);
      // #region debug-point A:bridge-message-accepted
      fetch('http://127.0.0.1:7777/event', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'topbar-token-sync',
          runId: 'pre-fix',
          hypothesisId: 'A',
          location: 'legacy-auth-bridge.service.ts:107',
          msg: '[DEBUG] bridge message accepted',
          data: {
            origin: event.origin
          },
          ts: Date.now()
        })
      }).catch(() => {});
      // #endregion
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
