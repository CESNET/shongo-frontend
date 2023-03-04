import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReservationFormsModule } from '../reservation-forms/reservation-forms.module';
import { ShongoTableModule } from '../shongo-table/shongo-table.module';
import { CapacityReservationsTabComponent } from './components/capacity-reservations-tab/capacity-reservations-tab.component';
import { ParticipantsTabComponent } from './components/participants-tab/participants-tab.component';
import { RecordingViewUrlColumnComponent } from './components/recording-view-url-column/recording-view-url-column.component';
import { RecordingsTabComponent } from './components/recordings-tab/recordings-tab.component';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { RuntimeManagementTabComponent } from './components/runtime-management-tab/runtime-management-tab.component';
import { SetDisplayNameDialogComponent } from './components/set-display-name-dialog/set-display-name-dialog.component';
import { SetMictophoneLevelDialogComponent } from './components/set-mictophone-level-dialog/set-mictophone-level-dialog.component';
import { UserRolesTabComponent } from './components/user-roles-tab/user-roles-tab.component';
import { UserSnapshotDialogComponent } from './components/user-snapshot-dialog/user-snapshot-dialog.component';
import { CreateParticipantPageComponent } from './pages/create-participant-page/create-participant-page.component';
import { CreateUserRolePageComponent } from './pages/create-user-role-page/create-user-role-page.component';
import { EditReservationRequestPageComponent } from './pages/edit-reservation-request-page/edit-reservation-request-page.component';
import { ReservationRequestDetailPageComponent } from './pages/reservation-request-detail-page/reservation-request-detail-page.component';
import { ReservationRequestRoutingModule } from './reservation-request-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReservationRequestRoutingModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSliderModule,
    ReservationFormsModule,
    MatDatepickerModule,
    ShongoTableModule,
    MatTooltipModule,
  ],
  declarations: [
    ReservationRequestDetailPageComponent,
    ReservationDetailComponent,
    CapacityReservationsTabComponent,
    UserRolesTabComponent,
    CreateUserRolePageComponent,
    ParticipantsTabComponent,
    CreateParticipantPageComponent,
    RuntimeManagementTabComponent,
    SetDisplayNameDialogComponent,
    SetMictophoneLevelDialogComponent,
    UserSnapshotDialogComponent,
    RecordingsTabComponent,
    RecordingViewUrlColumnComponent,
    EditReservationRequestPageComponent,
  ],
})
export class ReservationRequestModule {}
