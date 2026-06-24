type RuntimeEnvironment = {
  API_BASE_URL?: string;
  apiBaseUrl?: string;
};

const DEFAULT_API_BASE_URL = 'http://localhost:8000/api/v1';

function normalizeApiBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export function resolveApiBaseUrl(): string {
  const runtimeEnvironment = (globalThis as { __env?: RuntimeEnvironment }).__env;
  const configuredApiBaseUrl =
    runtimeEnvironment?.API_BASE_URL ?? runtimeEnvironment?.apiBaseUrl ?? DEFAULT_API_BASE_URL;

  return normalizeApiBaseUrl(configuredApiBaseUrl);
}
