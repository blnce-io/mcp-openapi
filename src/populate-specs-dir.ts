import fs from 'fs/promises';
import { getConfig } from './infra/config';

export async function populateSpecsDirectory(): Promise<void> {
  const source = getConfig('OPENAPI_SPECS_SOURCE_DIRECTORY') ?? 'openapi-specs';
  const destination = getConfig('OPENAPI_SPECS_DIRECTORY') ?? 'openapi-specs';
  if (source !== destination) {
    await fs.cp(source, destination);
  }
}
