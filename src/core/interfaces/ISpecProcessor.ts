import type { OpenAPIV3 } from 'openapi-types';

/**
 * Process OpenAPI specifications into a dereferenced version.
 * Can optionally validate the spec and remove unused components.
 */
export interface ISpecProcessor {
  /**
   * Process an OpenAPI document by dereferencing and transforming it
   * @param spec The OpenAPI document to process
   * @returns A processed version of the OpenAPI document
   */
  process(spec: OpenAPIV3.Document): Promise<OpenAPIV3.Document>;
}
