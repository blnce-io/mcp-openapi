type ConfigKey = 'PORT' | 'OPENAPI_SPECS_DIRECTORY' | 'LOG_ENABLED';

export function getConfig(key: ConfigKey): string | undefined {
  return process.env[key];
}
