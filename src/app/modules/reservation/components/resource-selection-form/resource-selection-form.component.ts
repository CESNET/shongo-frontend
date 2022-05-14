import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ResourceService } from 'src/app/core/http/resource/resource.service';
import { ResourceType } from 'src/app/shared/models/enums/resource-type.enum';
import { Technology } from 'src/app/shared/models/enums/technology.enum';
import { Option } from 'src/app/shared/models/interfaces/option.interface';
import {
  PhysicalResource,
  Resource,
} from 'src/app/shared/models/rest-api/resource.interface';
import { physicalResourceConfig } from 'src/config/physical-resource.config';
import { virtualRoomResourceConfig } from 'src/config/virtual-room-resource.config';

@Component({
  selector: 'app-resource-selection-form',
  templateUrl: './resource-selection-form.component.html',
  styleUrls: ['./resource-selection-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceSelectionFormComponent {
  /**
   * Emits selected resource.
   */
  @Output() resourceChange = new EventEmitter<Resource | null>();

  resourceOpts: Option[] = [];

  readonly form = new FormGroup({
    type: new FormControl(),
    resource: new FormControl(),
  });
  readonly resourceFilterCtrl = new FormControl();
  readonly resourceTypes: Option[];

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
   * Handles resource type change.
   *
   * @param typeOrTag Resource type or tag.
   */
  handleResourceTypeChange(typeOrTag: string): void {
    this.emitSelectedResource(null);
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

    if (typeOrTag === ResourceType.VIRTUAL_ROOM) {
      this.resourceOpts = resources
        .map((res) => ({
          value: res,
          displayName: virtualRoomResourceConfig.technologyNameMap.get(
            res.technology as Technology
          ),
        }))
        .filter((opt) => opt.displayName) as Option[];
    } else {
      this.resourceOpts = resources
        .map((res) => ({
          value: res,
          displayName: res.name,
        }))
        .filter((opt) => opt.displayName) as Option[];
    }
  }

  /**
   * Emits selected resource.
   *
   * @param resource Resource or null.
   */
  emitSelectedResource(resource: Resource | null): void {
    this.resourceChange.emit(resource);
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
