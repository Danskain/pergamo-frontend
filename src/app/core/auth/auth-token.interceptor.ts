import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthSessionService } from './auth-session.service';
import { LegacyLogoutRedirectService } from './legacy-logout-redirect.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authSession = inject(AuthSessionService);
  const legacyLogoutRedirect = inject(LegacyLogoutRedirectService);
  const authorizationHeader = authSession.getAuthorizationHeader();

  if (!authorizationHeader) {
    if (!authSession.isAwaitingExternalAuth()) {
      authSession.clearSession();
      legacyLogoutRedirect.redirect();
    }

    return next(request).pipe(
      catchError((error: unknown) => {
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 403)
        ) {
          authSession.clearSession();
          legacyLogoutRedirect.redirect();
        }

        return throwError(() => error);
      })
    );
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: authorizationHeader
      }
    })
  ).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        (error.status === 401 || error.status === 403)
      ) {
        authSession.clearSession();
        legacyLogoutRedirect.redirect();
      }

      return throwError(() => error);
    })
  );
};
