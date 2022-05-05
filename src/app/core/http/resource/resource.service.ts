import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { first, retry } from 'rxjs/operators';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';
import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import {
  PhysicalResource,
  Resource,
  VirtualRoomResource,
} from 'src/app/shared/models/rest-api/resource.interface';
import { physicalResourceConfig } from 'src/config/physical-resource.config';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';
import { ApiService } from '../api.service';

/**
 * Key under which resources get stored in local storage.
 */
const RESOURCES_LOCALSTORAGE_KEY = 'resources';

/**
 * Time to live of local storage entry.
 */
const RESOURCES_TTL = 60 * 60 * 1000;

/**
 * Retry count for fetching resources on startup.
 */
const RESOURCE_FETCH_RETRY_COUNT = 3;

/**
 * Structure for storing resources in local storage.
 * Uses timestamp to invalidate data after time to live passes.
 */
interface ResourcesStore {
  timestamp: number;
  resources: Resource[];
}

/**
 * Service for interaction with resources endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class ResourceService extends ApiService {
  resources?: Resource[];
  error: boolean = false;

  readonly loading$: Observable<boolean>;
  private _loading$ = new BehaviorSubject<boolean>(false);

  constructor(protected _http: HttpClient) {
    super(_http, Endpoint.RESOURCE, 'v1');

    this.loading$ = this._loading$.asObservable();
  }

  /**
   * Fetches capacity utilization.
   *
   * @param pageSize Number of items on a page.
   * @param pageIndex Page index.
   * @param sortedColumn Name of column to sort by.
   * @param sortDirection Sort direction.
   * @param filter Http parameters to filter results by.
   * @returns Observable of capacity utilization.
   */
  fetchCapacityUtilization(
    pageSize?: number,
    pageIndex?: number,
    sortedColumn?: string,
    sortDirection?: SortDirection,
    filter?: HttpParams
  ): Observable<ApiResponse<ResourceCapacityUtilization>> {
    return this.fetchTableItems(
      pageSize,
      pageIndex,
      sortedColumn,
      sortDirection,
      filter,
      `${this.endpointURL}/capacity_utilizations`
    );
  }

  /**
   * Fetches utilization of resource in a given interval.
   *
   * @param resourceId Resource ID.
   * @param intervalFrom Interval start.
   * @param intervalTo Interval end.
   * @returns Observable of resource's capacity utilization.
   */
  fetchResourceUtilization(
    resourceId: string,
    intervalFrom: string,
    intervalTo: string
  ): Observable<ResourceUtilizationDetail> {
    const detailUrl = `${this.endpointURL}/${resourceId}/capacity_utilizations`;

    const httpParams = new HttpParams()
      .set('resource', resourceId)
      .set('interval_from', intervalFrom)
      .set('interval_to', intervalTo);

    return this._http.get<ResourceUtilizationDetail>(detailUrl, {
      params: httpParams,
    });
  }

  /**
   * Gets all used physical resource tags based on available resources.
   * Filters out tags which are not supported by the frontend.
   * To configure physical resources edit physical resource configuration file.
   *
   * @returns Array of physical resource tags.
   */
  getPhysicalResourceTags(): string[] {
    if (!this.resources) {
      return [];
    }
    const tags = new Set(
      this.resources
        .filter((resource) => resource.type === ResourceType.PHYSICAL_RESOURCE)
        .reduce((acc: string[], curr: Resource) => {
          const supportedTags = (curr as PhysicalResource).tags.filter((tag) =>
            physicalResourceConfig.supportedTags.includes(tag)
          );
          acc.push(...supportedTags);
          return acc;
        }, [])
    );

    return Array.from(tags);
  }

  /**
   * Gets all used virtual room technologies based on available resources.
   * Filters out technologies which are not supported by the frontend.
   * To configure virtual room resources edit virtual room resource configuration file.
   *
   * @returns Array of virtual room technologies.
   */
  getVirtualRoomTechnologies(): Technology[] {
    if (!this.resources) {
      return [];
    }

    const tags = new Set(
      this.resources
        .filter(
          (resource) =>
            resource.type === ResourceType.VIRTUAL_ROOM &&
            virtualRoomResourceConfig.supportedTechnologies.includes(
              (resource as VirtualRoomResource).technology
            )
        )
        .map((resource) => resource.technology as Technology)
    );

    return Array.from(tags);
  }

  /**
   * Gets all virtual room resources from available resources.
   *
   * @returns Array of virtual room resources.
   */
  getVirtualRoomResources(): VirtualRoomResource[] {
    return this._getResourcesByType(
      ResourceType.VIRTUAL_ROOM
    ) as VirtualRoomResource[];
  }

  /**
   * Gets all physical resources from available resources.
   *
   * @returns Array of physical resources.
   */
  getPhysicalResources(): PhysicalResource[] {
    return this._getResourcesByType(
      ResourceType.PHYSICAL_RESOURCE
    ) as PhysicalResource[];
  }

  /**
   * Finds virtual room resource by technology.
   *
   * @param technology Virtual room technology.
   * @returns Virtual room resource or null.
   */
  findResourceByTechnology(technology: Technology): VirtualRoomResource | null {
    if (!this.resources) {
      return null;
    }

    return (
      (this.resources.find(
        (resource) => resource.technology === technology
      ) as VirtualRoomResource) ?? null
    );
  }

  /**
   * Finds resource by ID.
   *
   * @param id ID of resource.
   * @returns Resource or null.
   */
  findResourceById(id: string): Resource | null {
    if (!this.resources) {
      return null;
    }

    return this.resources.find((resource) => resource.id === id) ?? null;
  }

  /**
   * Loads resources into a public variable, either from local storage or from the backend.
   *
   * @returns Empty promise.
   */
  loadResources(): Promise<void> {
    const resources = this._getFromLocalStorage();

    if (resources) {
      this.resources = resources;
      return Promise.resolve();
    } else {
      return this._fetchResources();
    }
  }

  /**
   * Fetches available resources from the backend and stores them in a public variable.
   * If fetching fails, resources get loaded from local storage even if the timestamp exceeds time to live.
   *
   * @returns Empty promise.
   */
  private _fetchResources(): Promise<void> {
    this._loading$.next(true);

    return lastValueFrom(
      this._http
        .get<Resource[]>(this.endpointURL)
        .pipe(first(), retry(RESOURCE_FETCH_RETRY_COUNT))
    )
      .then((resources) => {
        this._loading$.next(false);
        this.resources = this._filterSupportedResources(resources);
        this._saveToLocalStorage(this.resources);
      })
      .catch((err) => {
        console.error(err);
        this._loading$.next(false);

        const resourcesInLocalStorage = this._getFromLocalStorage(true);

        if (resourcesInLocalStorage) {
          this.resources = resourcesInLocalStorage;
        } else {
          this.error = true;
        }
      });
  }

  /**
   * Gets resources from local storage.
   *
   * @param canExceedTtl Whether resources can be loaded even if the timestamp exceeds time to live.
   * @returns Array of resources or null.
   */
  private _getFromLocalStorage(canExceedTtl = false): Resource[] | null {
    const resourcesStoreString = localStorage.getItem(
      RESOURCES_LOCALSTORAGE_KEY
    );

    if (!resourcesStoreString) {
      return null;
    }

    const resourcesStore = JSON.parse(resourcesStoreString) as ResourcesStore;

    if (
      !canExceedTtl &&
      Date.now() - resourcesStore.timestamp > RESOURCES_TTL
    ) {
      return null;
    }

    return resourcesStore.resources;
  }

  /**
   * Saves fetched resources to local storage.
   *
   * @param resources Array of available resources.
   */
  private _saveToLocalStorage(resources: Resource[]): void {
    const timestamp = Date.now();
    const resourcesStore: ResourcesStore = { timestamp, resources };
    localStorage.setItem(
      RESOURCES_LOCALSTORAGE_KEY,
      JSON.stringify(resourcesStore)
    );
  }

  /**
   * Filters out resources which are unsupported in configuration.
   *
   * @param resources Available resources.
   * @returns Supported resources.
   */
  private _filterSupportedResources(resources: Resource[]): Resource[] {
    return resources.filter((res) => {
      if (res.type === ResourceType.PHYSICAL_RESOURCE) {
        return (res as PhysicalResource).tags.some((tag) =>
          physicalResourceConfig.supportedTags.includes(tag)
        );
      } else {
        return virtualRoomResourceConfig.supportedTechnologies.includes(
          (res as VirtualRoomResource).technology
        );
      }
    });
  }

  /**
   * Gets an array of resources with a given type.
   *
   * @param type Type of resource.
   * @returns Array of resources with a given type.
   */
  private _getResourcesByType(type: ResourceType): Resource[] {
    return this.resources
      ? this.resources.filter((resource) => resource.type === type)
      : [];
  }
}
