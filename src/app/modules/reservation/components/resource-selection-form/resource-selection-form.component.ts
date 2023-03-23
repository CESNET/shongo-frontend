import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subject, takeUntil } from 'rxjs';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import { Resource } from 'src/app/shared/models/rest-api/resource.interface';
import { physicalResourceConfig } from 'src/config/physical-resource.config';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';

@Component({
  selector: 'app-resource-selection-form',
  templateUrl: './resource-selection-form.component.html',
  styleUrls: ['./resource-selection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceSelectionFormComponent implements OnInit, OnDestroy {
  /**
   * Emits selected resource.
   */
  @Output() resourceChange = new EventEmitter<Resource | null>();

  /**
   * Emits all resources that should be displayed in the calendar (including selected resource for reservation).
   */
  @Output() displayedResourcesChange = new EventEmitter<Resource[]>();

  resourceOpts: Option[] = [];

  readonly form = new UntypedFormGroup({
    type: new UntypedFormControl(),
    resource: new UntypedFormControl(),
    displayedResources: new UntypedFormControl([]),
    showMore: new UntypedFormControl(false),
  });
  readonly resourceFilterCtrl = new UntypedFormControl();
  readonly resourceTypes: Option[];

  private readonly _destroy$ = new Subject<void>();

  constructor(private _resourceService: ResourceService) {
    this.resourceTypes = this._getResourceTypeOpts();
  }

  /**
   * Returns resources filtered based on selection filter.
   */
  get filteredResourceOpts(): Option[] {
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
    return this.form.get('resource')!.value;
  }

  get showMore(): boolean {
    return this.form.get('showMore')!.value;
  }

  ngOnInit(): void {
    this.form
      .get('displayedResources')!
      .valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe((resources) => this.displayedResourcesChange.emit(resources));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Handles resource type change.
   *
   * @param typeOrTag Resource type or tag.
   */
  handleResourceTypeChange(typeOrTag: string): void {
    this.form.get('resource')!.reset();
    this.form.get('displayedResources')!.setValue([]);
    this.createResourceOpts(typeOrTag);
  }

  /**
   * Creates resource selection options based on
   * resource type or tag.
   *
   * @param typeOrTag Resource type or tag.
   */
  createResourceOpts(typeOrTag: string): void {
    const resources = this._getResources(typeOrTag);

    this.resourceOpts = resources
      .map((res) => ({
        value: res,
        displayName: this.getResourceDisplayName(res),
      }))
      .filter((opt) => opt.displayName) as Option[];
  }

  /**
   * Handles resource selection.
   *
   * @param resource Selected resource for reservation.
   */
  onResourceSelect(resource: Resource | null): void {
    const displayedResourcesCtrl = this.form.get('displayedResources')!;

    if (resource) {
      displayedResourcesCtrl.setValue([resource]);
    } else {
      displayedResourcesCtrl.setValue([]);
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
      return (
        virtualRoomResourceConfig.technologyNameMap.get(
          resource.technology as Technology
        ) ?? resource.name
      );
    }
    return resource.name;
  }

  onMoreResourcesChange({ checked }: MatSlideToggleChange): void {
    if (!checked) {
      this.form
        .get('displayedResources')!
        .setValue(this.selectedResource ? [this.selectedResource] : []);
    }
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
        (res) => res.type === typeOrTag
      );
    } else {
      return this._resourceService.resources.filter((res) =>
        res.tags?.includes(typeOrTag)
      );
    }
  }

  /**
   * Gets resource type options.
   *
   * @returns Array of options.
   */
  private _getResourceTypeOpts(): Option[] {
    const physicalResourceTags =
      this._resourceService.getPhysicalResourceTags();

    const tags = physicalResourceTags
      .map(
        (tag) =>
          ({
            value: tag,
            displayName: physicalResourceConfig.tagNameMap.get(tag),
          } as Option)
      )
      .filter((opt) => opt.displayName);

    tags.push({
      value: ResourceType.VIRTUAL_ROOM,
      displayName: $localize`Virtual room`,
    });

    return tags;
  }
}
