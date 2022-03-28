import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, retry } from 'rxjs/operators';
import { Endpoint } from 'src/app/shared/models/enums/endpoint.enum';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { ApiResponse } from 'src/app/shared/models/rest-api/api-response.interface';
import { ResourceCapacityUtilization } from 'src/app/shared/models/rest-api/resource-capacity-utilization.interface';
import { ResourceUtilizationDetail } from 'src/app/shared/models/rest-api/resource-utilization-detail.interface';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';
import { ApiService } from '../api.service';

const RESOURCES_LOCALSTORAGE_KEY = 'resources';
const RESOURCES_TTL = 60 * 60 * 1000;
const RESOURCE_FETCH_RETRY_COUNT = 3;

interface ResourcesStore {
  timestamp: number;
  resources: Resource[];
}

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
    this._loadResources();
  }

  fetchCapacityUtilization(
    pageSize: number,
    pageIndex: number,
    sortedColumn: string,
    sortDirection: SortDirection,
    filter: HttpParams
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

  getPhysicalResourceTags(): string[] {
    if (!this.resources) {
      return [];
    }
    const tags = new Set(
      this.resources
        .filter((resource) => resource.type === ResourceType.PHYSICAL_RESOURCE)
        .map((resource) => resource.tag)
    );

    return Array.from(tags);
  }

  getVirtualRoomTechnologies(): Technology[] {
    if (!this.resources) {
      return [];
    }

    const tags = new Set(
      this.resources
        .filter((resource) => resource.type === ResourceType.VIRTUAL_ROOM)
        .map((resource) => resource.tag as Technology)
    );

    return Array.from(tags);
  }

  private _loadResources(): void {
    const resources = this._getFromLocalStorage();

    if (resources) {
      this.resources = resources;
    } else {
      this._fetchResources();
    }
  }

  private _fetchResources(): void {
    this._loading$.next(true);
    this._http
      .get<Resource[]>(this.endpointURL)
      .pipe(first(), retry(RESOURCE_FETCH_RETRY_COUNT))
      .subscribe({
        next: (resources) => {
          this._loading$.next(false);
          this.resources = resources;
          this._saveToLocalStorage(resources);
        },
        error: (err) => {
          console.error(err);
          this._loading$.next(false);

          const resourcesInLocalStorage = this._getFromLocalStorage();

          if (resourcesInLocalStorage) {
            this.resources = resourcesInLocalStorage;
          } else {
            this.error = true;
          }
        },
      });
  }

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
      resourcesStore.timestamp - Date.now() > RESOURCES_TTL
    ) {
      return null;
    }

    return resourcesStore.resources;
  }

  private _saveToLocalStorage(resources: Resource[]): void {
    const timestamp = Date.now();
    const resourcesStore: ResourcesStore = { timestamp, resources };
    localStorage.setItem(
      RESOURCES_LOCALSTORAGE_KEY,
      JSON.stringify(resourcesStore)
    );
  }
}
