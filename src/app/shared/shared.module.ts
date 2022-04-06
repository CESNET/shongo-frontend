import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './components/data-table/data-table.component';
import { MatTableResponsiveDirective } from './directives/mat-table-responsive/mat-table-responsive.directive';
import { ShortStringPipe } from './pipes/short-string.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CertainityCheckComponent } from './components/certainity-check/certainity-check.component';
import { StateChipComponent } from './components/state-chip/state-chip.component';
import { ReservationRequestStateColumnComponent } from './components/data-table/column-components/state-chip-column/components/reservation-request-state-column.component';
import { RoomStateColumnComponent } from './components/data-table/column-components/state-chip-column/components/room-state-column.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AlertComponent } from './components/alert/alert.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
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

@NgModule({
  declarations: [
    DataTableComponent,
    MatTableResponsiveDirective,
    ShortStringPipe,
    CertainityCheckComponent,
    StateChipComponent,
    ReservationRequestStateColumnComponent,
    RoomStateColumnComponent,
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
    MatPaginatorModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTableModule,
    MatDividerModule,
    MatDialogModule,
    MatSortModule,
    MatMenuModule,
    FlexLayoutModule,
    MatSnackBarModule,
  ],
  exports: [
    DataTableComponent,
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
  ],
  providers: [MomentDatePipe],
})
export class SharedModule {}
