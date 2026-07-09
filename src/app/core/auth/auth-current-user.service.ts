import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { resolveApiBaseUrl } from '../../features/contabilidad/infrastructure/api-base-url';
import { AuthSessionService, AuthUserProfile } from './auth-session.service';

interface ApiMeRole {
  id: number;
  name?: string | null;
}

interface ApiMeUser {
  id?: number;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  roles?: ApiMeRole[] | null;
}

interface ApiMeResponse {
  success?: boolean;
  message?: string;
  data?: ApiMeUser | null;
}

@Injectable({ providedIn: 'root' })
export class AuthCurrentUserService {
  private readonly http = inject(HttpClient);
  private readonly authSession = inject(AuthSessionService);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  private readonly profileState = signal<AuthUserProfile | null>(null);
  private readonly loadedTokenState = signal<string | null>(null);
  private activeRequest: Subscription | null = null;

  readonly userProfile = computed(
    () => this.profileState() ?? this.authSession.userProfile()
  );

  constructor() {
    effect(() => {
      const accessToken = this.authSession.getAccessToken();

      if (!accessToken) {
        this.cancelActiveRequest();
        this.profileState.set(null);
        this.loadedTokenState.set(null);
        return;
      }

      if (this.loadedTokenState() === accessToken) {
        return;
      }

      this.loadCurrentUser(accessToken);
    });
  }

  refreshCurrentUser(force = false): void {
    const accessToken = this.authSession.getAccessToken();

    if (!accessToken) {
      return;
    }

    if (!force && this.loadedTokenState() === accessToken) {
      return;
    }

    this.loadCurrentUser(accessToken);
  }

  private loadCurrentUser(accessToken: string): void {
    this.cancelActiveRequest();

    this.activeRequest = this.http
      .get<ApiMeResponse>(`${this.apiBaseUrl}/auth/me`)
      .subscribe({
        next: (response) => {
          if (this.authSession.getAccessToken() !== accessToken) {
            return;
          }

          const userProfile = this.mapUserProfile(response.data);

          this.profileState.set(userProfile);
          this.loadedTokenState.set(accessToken);
          this.authSession.updateUserProfile(userProfile);
        },
        error: () => {
          if (this.authSession.getAccessToken() !== accessToken) {
            return;
          }

          this.profileState.set(null);
          this.loadedTokenState.set(null);
        }
      });
  }

  private mapUserProfile(user: ApiMeUser | null | undefined): AuthUserProfile {
    const firstName = user?.firstname?.trim() ?? '';
    const lastName = user?.lastname?.trim() ?? '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Usuario';
    const primaryRole = user?.roles?.[0]?.name?.trim() || 'Perfil activo';

    return {
      userId: typeof user?.id === 'number' ? user.id : null,
      username: user?.username?.trim() || null,
      fullName,
      role: primaryRole,
      companyId: null
    };
  }

  private cancelActiveRequest(): void {
    this.activeRequest?.unsubscribe();
    this.activeRequest = null;
  }
}
