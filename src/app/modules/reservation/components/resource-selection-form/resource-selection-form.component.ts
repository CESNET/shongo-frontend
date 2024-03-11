import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
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

interface DisplayedResourceTypeForm {
  [key: string]: FormControl<boolean>;
}

interface DisplayedResourcesForm {
  [key: string]: FormGroup<DisplayedResourceTypeForm>;
}

interface ResourceSelectionForm {
  type: FormControl<string | null>;
  resource: FormControl<Resource | null>;
  displayedResources: FormGroup<DisplayedResourcesForm>;
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

  /**
   * Restricts resources to be displayed based on type.
   */
  @Input() restrictToType?: ResourceType;

  resourceOpts: ResourceOption[] = [];
  resourceTypes: TypeOption[] = [];
  form!: FormGroup<ResourceSelectionForm>;

  readonly resourceFilterCtrl = new FormControl<string | null>(null);

  private _prevSelectedResourceCtrl?: FormControl<boolean>;

  constructor(
    private _resourceService: ResourceService,
    private _destroyRef: DestroyRef
  ) {}

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
    this.resourceTypes = this._getResourceTypeOpts();

    this.form = new FormGroup<ResourceSelectionForm>({
      type: new FormControl<string | null>(null),
      resource: new FormControl<Resource | null>(null),
      displayedResources: this.createDisplayedResourcesFormGroup(
        this.resourceTypes.map((opt) => opt.value)
      ),
    });

    this.form.controls.displayedResources.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() =>
        this.displayedResourcesChange.emit(this.getDisplayedResources())
      );
  }

  /**
   * Handles resource type change.
   *
   * @param typeOrTag Resource type or tag.
   */
  handleResourceTypeChange(typeOrTag: string): void {
    this.form.controls.resource.reset();
    this.form.controls.displayedResources.enable();
    this.resourceOpts = this.createResourceOpts(typeOrTag);
    this._clearPrevControl();
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
    displayedResourcesCtrl.enable({ emitEvent: false });
    this._clearPrevControl();

    if (resource) {
      const type = this.form.value.type!;
      const resourceGroup = displayedResourcesCtrl.get(
        type
      ) as FormGroup<DisplayedResourceTypeForm>;

      if (resourceGroup) {
        const resourceCtrl = resourceGroup.controls[resource.id];
        this._prevSelectedResourceCtrl = resourceCtrl;

        resourceCtrl?.disable({ emitEvent: false });
        resourceCtrl?.setValue(true);
      }
    } else {
      displayedResourcesCtrl.reset();
    }

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

  createDisplayedResourcesFormGroup(
    types: string[]
  ): FormGroup<DisplayedResourcesForm> {
    const formGroup = new FormGroup<DisplayedResourcesForm>({});

    types.forEach((type) => {
      const typeFormGroup = new FormGroup({});
      const resourceOpts = this.createResourceOpts(type);

      resourceOpts.forEach((opt) => {
        typeFormGroup.addControl(
          opt.value.id,
          new FormControl<boolean>(false, { nonNullable: true })
        );
      });

      formGroup.addControl(type, typeFormGroup);
    });

    return formGroup;
  }

  getDisplayedResources(): Resource[] {
    const formValue = this.form.controls.displayedResources.getRawValue();
    const displayedResources: Resource[] = [];

    Object.entries(formValue).forEach(([type, resourceGroup]) => {
      const resourcesByType = this._getResources(type);

      Object.entries(resourceGroup!).forEach(([id, displayed]) => {
        const resource = resourcesByType.find((res) => res.id === id);

        if (displayed && resource) {
          displayedResources.push(resource);
        }
      });
    });

    return displayedResources;
  }

  private _clearPrevControl(): void {
    this._prevSelectedResourceCtrl?.setValue(false, { emitEvent: false });
    this._prevSelectedResourceCtrl = undefined;
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
      return this._resourceService.getVirtualRoomResources();
    } else {
      return this._resourceService.getPhysicalResources().filter(({ tags }) => {
        const tagNames = tags
          ?.filter(({ type }) => type === TagType.DEFAULT)
          .map(({ name }) => name);

        if (typeOrTag === ResourceType.OTHER) {
          return !tagNames?.some((name) =>
            physicalResourceConfig.tagNameMap.has(name)
          );
        }

        return tagNames?.includes(typeOrTag);
      });
    }
  }

  /**
   * Gets resource type options.
   *
   * @returns Array of TypeOption.
   */
  private _getResourceTypeOpts(): TypeOption[] {
    const tags = this._getPhysicalResourceOpts();

    if (this._shouldShowResourceType(ResourceType.VIRTUAL_ROOM)) {
      tags.push({
        value: ResourceType.VIRTUAL_ROOM,
        displayName: $localize`Virtual room`,
      });
    }
    if (this._shouldShowResourceType(ResourceType.OTHER)) {
      tags.push({
        value: ResourceType.OTHER,
        displayName: $localize`Other`,
      });
    }

    return tags;
  }

  private _getPhysicalResourceOpts(): TypeOption[] {
    if (this._isTypeRestricted(ResourceType.PHYSICAL_RESOURCE)) {
      return [];
    }

    const physicalResourceTags =
      this._resourceService.getPhysicalResourceTags();

    return physicalResourceTags
      .map(
        (tag) =>
          ({
            value: tag,
            displayName: physicalResourceConfig.tagNameMap.get(tag),
          } as TypeOption)
      )
      .filter((opt) => opt.displayName);
  }

  private _shouldShowResourceType(type: ResourceType): boolean {
    const hasResources = !!this._getResources(type).length;
    const isRestricted = this._isTypeRestricted(type);

    return hasResources && !isRestricted;
  }

  private _isTypeRestricted(type: ResourceType): boolean {
    return this.restrictToType !== undefined && type !== this.restrictToType;
  }
}
