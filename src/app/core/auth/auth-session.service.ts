import { Injectable, signal } from '@angular/core';

export interface PergamoAuthMessage {
  type: 'PERGAMO_AUTH';
  access_token: string;
  token_type?: string;
  expires_in?: number | null;
}

interface StoredAuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number | null;
  receivedAt: string;
}

const AUTH_STORAGE_KEY = 'pergamo.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly sessionState = signal<StoredAuthSession | null>(this.restoreSession());
  private readonly awaitingExternalAuthState = signal(false);

  readonly session = this.sessionState.asReadonly();
  readonly awaitingExternalAuth = this.awaitingExternalAuthState.asReadonly();

  saveFromMessage(message: PergamoAuthMessage): void {
    const normalizedSession: StoredAuthSession = {
      accessToken: message.access_token,
      tokenType: message.token_type?.trim() || 'Bearer',
      expiresIn: typeof message.expires_in === 'number' ? message.expires_in : null,
      receivedAt: new Date().toISOString()
    };

    this.sessionState.set(normalizedSession);
    this.awaitingExternalAuthState.set(false);
    this.persistSession(normalizedSession);
  }

  getAuthorizationHeader(): string | null {
    const session = this.getValidSession();

    if (!session?.accessToken) {
      return null;
    }

    return `${session.tokenType} ${session.accessToken}`;
  }

  hasValidSession(): boolean {
    return this.getValidSession() !== null;
  }

  isAwaitingExternalAuth(): boolean {
    return this.awaitingExternalAuthState();
  }

  beginExternalAuthHandshake(): void {
    this.awaitingExternalAuthState.set(true);
  }

  finishExternalAuthHandshake(): void {
    this.awaitingExternalAuthState.set(false);
  }

  clearSession(): void {
    this.sessionState.set(null);
    this.awaitingExternalAuthState.set(false);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  isCurrentSessionExpired(): boolean {
    const session = this.sessionState();

    return session ? this.isExpired(session) : false;
  }

  private getValidSession(): StoredAuthSession | null {
    const session = this.sessionState();

    if (!session) {
      return null;
    }

    if (this.isExpired(session)) {
      this.clearSession();
      return null;
    }

    return session;
  }

  private restoreSession(): StoredAuthSession | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      const parsedValue = JSON.parse(rawValue) as Partial<StoredAuthSession>;

      if (!parsedValue.accessToken) {
        return null;
      }

      return {
        accessToken: parsedValue.accessToken,
        tokenType: parsedValue.tokenType?.trim() || 'Bearer',
        expiresIn:
          typeof parsedValue.expiresIn === 'number' ? parsedValue.expiresIn : null,
        receivedAt: parsedValue.receivedAt ?? new Date().toISOString()
      };
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }

  private persistSession(session: StoredAuthSession): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  private isExpired(session: StoredAuthSession): boolean {
    if (session.expiresIn === null || session.expiresIn <= 0) {
      return false;
    }

    const receivedAt = Date.parse(session.receivedAt);

    if (Number.isNaN(receivedAt)) {
      return false;
    }

    return Date.now() >= receivedAt + session.expiresIn * 1000;
  }
}
