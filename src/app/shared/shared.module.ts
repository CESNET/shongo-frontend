import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AccountMenuComponent } from './components/account-menu/account-menu.component';
import { AlertComponent } from './components/alert/alert.component';
import { CertainityCheckComponent } from './components/certainity-check/certainity-check.component';
import { LoadingTextComponent } from './components/loading-text/loading-text.component';
import { RequestConfirmationDialogComponent } from './components/request-confirmation-dialog/request-confirmation-dialog.component';
import { SessionEndedDialogComponent } from './components/session-ended-dialog/session-ended-dialog.component';
import { SnackbarAlertComponent } from './components/snackbar-alert/snackbar-alert.component';
import { StateChipComponent } from './components/state-chip/state-chip.component';
import { StateHelpComponent } from './components/state-help/state-help.component';
import { ReservationRequestStateHelpComponent } from './components/state-help/wrapper-components/reservation-request-state-help.component';
import { RoomStateHelpComponent } from './components/state-help/wrapper-components/room-state-help.component';
import { ComponentHostDirective } from './directives/component-host.directive';
import { GroupSearchDirective } from './directives/group-search/group-search.directive';
import { TimezoneSearchDirective } from './directives/timezone-search/timezone-search.directive';
import { UserSearchDirective } from './directives/user-search/user-search.directive';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { ShortStringPipe } from './pipes/short-string.pipe';

@NgModule({
  declarations: [
    ShortStringPipe,
    CertainityCheckComponent,
    StateChipComponent,
    AlertComponent,
    UserSearchDirective,
    GroupSearchDirective,
    TimezoneSearchDirective,
    SessionEndedDialogComponent,
    MomentDatePipe,
    AccountMenuComponent,
    ComponentHostDirective,
    SnackbarAlertComponent,
    RequestConfirmationDialogComponent,
    LoadingTextComponent,
    RoomStateHelpComponent,
    ReservationRequestStateHelpComponent,
    StateHelpComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTableModule,
    MatDividerModule,
    MatDialogModule,
    MatMenuModule,
    FlexLayoutModule,
    MatSnackBarModule,
  ],
  exports: [
    ShortStringPipe,
    MomentDatePipe,
    CertainityCheckComponent,
    StateChipComponent,
    AlertComponent,
    UserSearchDirective,
    GroupSearchDirective,
    TimezoneSearchDirective,
    AccountMenuComponent,
    ComponentHostDirective,
    LoadingTextComponent,
    RoomStateHelpComponent,
    ReservationRequestStateHelpComponent,
  ],
  providers: [MomentDatePipe],
})
export class SharedModule {}
