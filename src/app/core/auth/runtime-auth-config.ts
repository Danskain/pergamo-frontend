type RuntimeEnvironment = {
  LEGACY_APP_ORIGIN?: string;
  LEGACY_APP_ORIGINS?: string | string[];
  LEGACY_LOGOUT_URL?: string;
  legacyAppOrigin?: string;
  legacyAppOrigins?: string | string[];
  legacyLogoutUrl?: string;
};

const DEFAULT_LEGACY_APP_ORIGIN = 'http://localhost:4200';
const DEFAULT_LEGACY_LOGOUT_URL = 'http://localhost:4200/auth/logout';

function normalizeOrigin(value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    return value.trim().replace(/\/+$/, '');
  }
}

function toOriginArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  const items = Array.isArray(value) ? value : value.split(',');

  return items.map((item) => normalizeOrigin(item)).filter(Boolean);
}

export function resolveLegacyAppOrigins(): string[] {
  const runtimeEnvironment = (globalThis as { __env?: RuntimeEnvironment }).__env;
  const configuredOrigins =
    runtimeEnvironment?.LEGACY_APP_ORIGINS ??
    runtimeEnvironment?.legacyAppOrigins ??
    runtimeEnvironment?.LEGACY_APP_ORIGIN ??
    runtimeEnvironment?.legacyAppOrigin ??
    DEFAULT_LEGACY_APP_ORIGIN;

  return toOriginArray(configuredOrigins);
}

export function resolveLegacyLogoutUrl(): string {
  const runtimeEnvironment = (globalThis as { __env?: RuntimeEnvironment }).__env;

  return (
    runtimeEnvironment?.LEGACY_LOGOUT_URL ??
    runtimeEnvironment?.legacyLogoutUrl ??
    DEFAULT_LEGACY_LOGOUT_URL
  );
}
