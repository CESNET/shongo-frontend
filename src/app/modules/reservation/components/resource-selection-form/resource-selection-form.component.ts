import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TagType } from '@app/shared/models/enums/tag-type.enum';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';
import { physicalResourceConfig } from 'src/config/physical-resource.config';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';

type ResourceOption = Option<Resource>;
type TypeOption = Option<string>;

interface ResourceSelectionForm {
  type: FormControl<string | null>;
  resource: FormControl<Resource | null>;
  displayedResources: FormControl<Resource[]>;
}

@Component({
  selector: 'app-resource-selection-form',
  templateUrl: './resource-selection-form.component.html',
  styleUrls: ['./resource-selection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceSelectionFormComponent implements OnInit {
  /**
   * Emits selected resource.
   */
  @Output() resourceChange = new EventEmitter<Resource | null>();

  /**
   * Emits all resources that should be displayed in the calendar (including selected resource for reservation).
   */
  @Output() displayedResourcesChange = new EventEmitter<Resource[]>();

  resourceOpts: ResourceOption[] = [];

  readonly form = new FormGroup<ResourceSelectionForm>({
    type: new FormControl<string | null>(null),
    resource: new FormControl<Resource | null>(null),
    displayedResources: new FormControl<Resource[]>([], { nonNullable: true }),
  });
  readonly resourceFilterCtrl = new FormControl<string | null>(null);
  readonly resourceTypes: TypeOption[];

  constructor(
    private _resourceService: ResourceService,
    private _destroyRef: DestroyRef
  ) {
    this.resourceTypes = this._getResourceTypeOpts();
  }

  /**
   * Returns resources filtered based on selection filter.
   */
  get filteredResourceOpts(): ResourceOption[] {
    const filter = this.resourceFilterCtrl.value;

    if (!filter) {
      return this.resourceOpts;
    }
    return this.resourceOpts.filter((opt) => opt.displayName.includes(filter));
  }

  /**
   * Returns resource that is selected for reservation.
   */
  get selectedResource(): Resource | null {
    return this.form.controls.resource.value;
  }

  ngOnInit(): void {
    this.form.controls.displayedResources.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((resources) => this.displayedResourcesChange.emit(resources));
  }

  /**
   * Handles resource type change.
   *
   * @param typeOrTag Resource type or tag.
   */
  handleResourceTypeChange(typeOrTag: string): void {
    this.form.controls.resource.reset();
    this.form.controls.displayedResources.setValue([]);
    this.resourceOpts = this.createResourceOpts(typeOrTag);
  }

  /**
   * Creates resource selection ResourceOptions based on
   * resource type or tag.
   *
   * @param typeOrTag Resource type or tag.
   */
  createResourceOpts(typeOrTag: string): Option<Resource>[] {
    const resources = this._getResources(typeOrTag);

    return resources
      .map((res) => ({
        value: res,
        displayName: this.getResourceDisplayName(res),
      }))
      .filter((opt) => opt.displayName) as ResourceOption[];
  }

  /**
   * Handles resource selection.
   *
   * @param resource Selected resource for reservation.
   */
  onResourceSelect(resource: Resource | null): void {
    const displayedResourcesCtrl = this.form.controls.displayedResources;
    displayedResourcesCtrl.setValue(resource ? [resource] : []);
    this.resourceChange.emit(resource);
  }

  /**
   * Emits all resources that should be displayed in the calendar.
   *
   * @param resources Selected resources.
   */
  emitDisplayedResources(resources: Resource[]): void {
    this.displayedResourcesChange.emit(resources);
  }

  /**
   * Returns a display name of the resource.
   */
  getResourceDisplayName(resource: Resource): string {
    if (resource.type === ResourceType.VIRTUAL_ROOM) {
      const technologyName = virtualRoomResourceConfig.technologyNameMap.get(
        resource.technology as Technology
      );

      return technologyName ?? resource.name;
    }
    return resource.name;
  }

  /**
   * Gets resources from resource service filtered by type or tag.
   *
   * @param typeOrTag Resource type or tag.
   * @returns Array of resources.
   */
  private _getResources(typeOrTag: string): Resource[] {
    if (!this._resourceService.resources) {
      return [];
    } else if (typeOrTag === ResourceType.VIRTUAL_ROOM) {
      return this._resourceService.resources.filter(
        ({ type }) => type === typeOrTag
      );
    } else {
      return this._resourceService.resources.filter(({ tags }) =>
        tags
          ?.filter(({ type }) => type === TagType.DEFAULT)
          .map(({ name }) => name)
          ?.includes(typeOrTag)
      );
    }
  }

  /**
   * Gets resource type options.
   *
   * @returns Array of TypeOption.
   */
  private _getResourceTypeOpts(): TypeOption[] {
    const physicalResourceTags =
      this._resourceService.getPhysicalResourceTags();

    const tags = physicalResourceTags
      .map(
        (tag) =>
          ({
            value: tag,
            displayName: physicalResourceConfig.tagNameMap.get(tag),
          } as TypeOption)
      )
      .filter((opt) => opt.displayName);

    tags.push({
      value: ResourceType.VIRTUAL_ROOM,
      displayName: $localize`Virtual room`,
    });

    return tags;
  }
}
