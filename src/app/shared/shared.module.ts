import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { InitialsPipe } from './pipes/initials.pipe';

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
    InitialsPipe,
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
