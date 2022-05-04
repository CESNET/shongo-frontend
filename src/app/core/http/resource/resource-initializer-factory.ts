import { ResourceService } from './resource.service';

/**
 * Initializer factory for resource service. Makes sure available resources are loaded before app bootstrap.
 *
 * @param resourceService Resource service.
 * @returns Promise which resolves when resources get loaded.
 */
export function resourceInitializerFactory(
  resourceService: ResourceService
): () => Promise<void> {
  return () => resourceService.loadResources();
}
