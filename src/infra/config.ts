type ConfigKey = 'PORT' | 'OPENAPI_SPECS_DIRECTORY';

export function getConfig(key: ConfigKey): string | undefined {
  return process.env[key];
}
