import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CertainityCheckComponent } from './components/certainity-check/certainity-check.component';
import { StateChipComponent } from './components/state-chip/state-chip.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AlertComponent } from './components/alert/alert.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { UserSearchDirective } from './directives/user-search/user-search.directive';
import { GroupSearchDirective } from './directives/group-search/group-search.directive';
import { SessionEndedDialogComponent } from './components/session-ended-dialog/session-ended-dialog.component';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { AccountMenuComponent } from './components/account-menu/account-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TimezoneSearchDirective } from './directives/timezone-search/timezone-search.directive';
import { ComponentHostDirective } from './directives/component-host.directive';
import { SnackbarAlertComponent } from './components/snackbar-alert/snackbar-alert.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestConfirmationDialogComponent } from './components/request-confirmation-dialog/request-confirmation-dialog.component';
import { LoadingTextComponent } from './components/loading-text/loading-text.component';
import { StateHelpComponent } from './components/state-help/state-help.component';
import { RoomStateHelpComponent } from './components/state-help/wrapper-components/room-state-help.component';
import { ReservationRequestStateHelpComponent } from './components/state-help/wrapper-components/reservation-request-state-help.component';

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
