type ConfigKey = 'PORT' | 'OPENAPI_SPECS_DIRECTORY' | 'OPENAPI_SPECS_SOURCE_DIRECTORY';

export function getConfig(key: ConfigKey): string | undefined {
  return process.env[key];
}
