import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormRecord } from '@angular/forms';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInputEvent,
} from '@angular/material/chips';
import { EMAIL_REGEX } from '@app/shared/models/constants/regex.const';
import { TagType } from '@app/shared/models/enums/tag-type.enum';
import { AuxData } from '@app/shared/models/rest-api/aux-data.interface';
import { NotifyEmailTag, Tag } from '@app/shared/models/rest-api/tag.interface';

type NotifyEmailGroup = FormGroup<{
  data: FormControl<string[] | null>;
  enabled: FormControl<boolean | null>;
}>;

interface SettingsForm {
  notifyEmails: FormRecord<NotifyEmailGroup>;
}

@Component({
  selector: 'app-advanced-settings-form',
  templateUrl: './advanced-settings-form.component.html',
  styleUrls: ['./advanced-settings-form.component.scss'],
})
export class AdvancedSettingsFormComponent implements OnInit {
  @ViewChild('tagInput', { static: true }) chipGrid!: MatChipGrid;
  @Input() tags: Tag[] = [];
  @Input() auxData: AuxData[] = [];

  readonly settingsForm = new FormGroup<SettingsForm>({
    notifyEmails: new FormRecord<NotifyEmailGroup>({}),
  });
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  notifyEmailTags: NotifyEmailTag[] = [];
  valid = true;

  ngOnInit(): void {
    this._createFormControls();
  }

  removeEmail(tagId: string, email: string): void {
    const tagControl = this.getNotifyEmailsControl(tagId)!.controls.data;
    const emails = tagControl.value ?? [];
    const index = emails.indexOf(email);

    if (index > -1) {
      emails.splice(index, 1);
    }

    tagControl.setValue(emails);
  }

  addEmail(
    tagId: string,
    event: MatChipInputEvent,
    chipGrid: MatChipGrid
  ): void {
    const value = (event.value || '').trim();

    if (!value) {
      return;
    } else if (!EMAIL_REGEX.test(value)) {
      chipGrid.errorState = true;
      return;
    }
    chipGrid.errorState = false;

    const tagControl = this.getNotifyEmailsControl(tagId)!.controls.data;
    const emails = tagControl.value ?? [];

    if (emails.indexOf(value) === -1) {
      emails.push(value);
    }

    tagControl.setValue(emails);
    event.chipInput!.clear();
  }

  editEmail(
    tagId: string,
    oldValue: string,
    event: MatChipEditedEvent,
    chipGrid: MatChipGrid
  ): void {
    const newValue = event.value.trim();

    if (!newValue) {
      this.removeEmail(tagId, event.value);
      return;
    } else if (!EMAIL_REGEX.test(newValue)) {
      chipGrid.errorState = true;
      return;
    }
    chipGrid.errorState = false;

    const tagControl = this.settingsForm.controls.notifyEmails.get(tagId)!;
    const emails = tagControl.value;

    const index = emails.indexOf(oldValue);
    if (index !== -1) {
      emails[index] = newValue;
    }

    tagControl.setValue(emails);
  }

  getFormValue(): AuxData[] {
    const notifyEmails = this.settingsForm.controls.notifyEmails.value;

    return this.tags
      .filter((tag) => tag.type === TagType.NOTIFY_EMAIL)
      .map(({ name, id }) => {
        const notifyEmail = notifyEmails[id];

        return {
          tagName: name,
          enabled: !!notifyEmail?.enabled,
          data: notifyEmail?.data ?? [],
        };
      });
  }

  isDefaultEmail(email: string, tag: NotifyEmailTag): boolean {
    return tag.data.includes(email);
  }

  getNotifyEmailsControl(tagId: string): NotifyEmailGroup {
    return this.settingsForm.controls.notifyEmails.get(
      tagId
    )! as NotifyEmailGroup;
  }

  private _getNotifyEmailTags(tags: Tag[]): NotifyEmailTag[] {
    return tags.filter(
      (tag) => tag.type === TagType.NOTIFY_EMAIL
    ) as NotifyEmailTag[];
  }

  private _createFormControls(): void {
    this.notifyEmailTags = this._getNotifyEmailTags(this.tags);
    const auxData = this.auxData.filter((tag) =>
      this.notifyEmailTags.find(
        (notifyEmailTag) => notifyEmailTag.name === tag.tagName
      )
    );

    this._createNotifyEmailControls(this.notifyEmailTags, auxData);
  }

  private _createNotifyEmailControls(
    tags: NotifyEmailTag[],
    auxData: AuxData[]
  ): void {
    tags.forEach((tag) => {
      const resourceTag = auxData.find((auxTag) => auxTag.tagName === tag.name);
      const data = (resourceTag?.data ?? []) as string[];
      const enabled = resourceTag?.enabled ?? false;

      this.settingsForm.controls.notifyEmails.addControl(
        tag.id,
        new FormGroup({
          data: new FormControl<string[] | null>(data),
          enabled: new FormControl<boolean>(enabled),
        })
      );
    });
  }
}
