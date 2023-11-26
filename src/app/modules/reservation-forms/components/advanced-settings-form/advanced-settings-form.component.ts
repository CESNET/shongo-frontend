import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormRecord } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { TagType } from '@app/shared/models/enums/tag-type.enum';
import { NotifyEmailTag, Tag } from '@app/shared/models/rest-api/tag.interface';

type NotifyEmailControl = FormControl<string[] | null>;

interface SettingsForm {
  notifyEmails: FormRecord<NotifyEmailControl>;
}

@Component({
  selector: 'app-advanced-settings-form',
  templateUrl: './advanced-settings-form.component.html',
  styleUrls: ['./advanced-settings-form.component.scss'],
})
export class AdvancedSettingsFormComponent implements OnInit {
  @Input() tags: Tag[] = [];

  readonly settingsForm = new FormGroup<SettingsForm>({
    notifyEmails: new FormRecord<NotifyEmailControl>({}),
  });
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  notifyEmailTags: NotifyEmailTag[] = [];

  ngOnInit(): void {
    this.notifyEmailTags = this._getNotifyEmailTags();
    this._createFormControls();
  }

  removeEmail(tagId: string, email: string): void {
    const tagControl = this.settingsForm.controls.notifyEmails.get(tagId)!;
    const emails = tagControl.value;
    const index = emails.indexOf(email);

    if (index > -1) {
      emails.splice(index, 1);
    }

    tagControl.setValue(emails);
  }

  addEmail(tagId: string, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (!value) {
      return;
    }

    const tagControl = this.settingsForm.controls.notifyEmails.get(tagId)!;
    const emails = tagControl.value;

    if (emails.indexOf(value) === -1) {
      emails.push(value);
    }

    tagControl.setValue(emails);
    event.chipInput!.clear();
  }

  editEmail(tagId: string, oldValue: string, event: MatChipEditedEvent): void {
    const newValue = event.value.trim();

    if (!newValue) {
      this.removeEmail(tagId, event.value);
      return;
    }

    const tagControl = this.settingsForm.controls.notifyEmails.get(tagId)!;
    const emails = tagControl.value;

    const index = emails.indexOf(oldValue);
    if (index !== -1) {
      emails[index] = newValue;
    }

    tagControl.setValue(emails);
  }

  private _getNotifyEmailTags(): NotifyEmailTag[] {
    return this.tags.filter(
      (tag) => tag.type === TagType.NOTIFY_EMAIL
    ) as NotifyEmailTag[];
  }

  private _createFormControls(): void {
    this.notifyEmailTags.forEach((tag) =>
      this.settingsForm.controls.notifyEmails.addControl(
        tag.id,
        new FormControl<string[]>(tag.data)
      )
    );
  }
}
