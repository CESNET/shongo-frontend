import { ResourceService } from './resource.service';

export function resourceInitializerFactory(
  resourceService: ResourceService
): () => Promise<void> {
  return () => resourceService.loadResources();
}
