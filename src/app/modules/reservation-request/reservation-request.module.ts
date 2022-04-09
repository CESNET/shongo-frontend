import { NgModule } from '@angular/core';
import { ReservationRequestDetailPageComponent } from './pages/reservation-request-detail-page/reservation-request-detail-page.component';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CapacityReservationsTabComponent } from './components/capacity-reservations-tab/capacity-reservations-tab.component';
import { UserRolesTabComponent } from './components/user-roles-tab/user-roles-tab.component';
import { CreateUserRolePageComponent } from './pages/create-user-role-page/create-user-role-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ParticipantsTabComponent } from './components/participants-tab/participants-tab.component';
import { CreateParticipantPageComponent } from './pages/create-participant-page/create-participant-page.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReservationRequestRoutingModule } from './reservation-request-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RuntimeManagementTabComponent } from './components/runtime-management-tab/runtime-management-tab.component';
import { SetDisplayNameDialogComponent } from './components/set-display-name-dialog/set-display-name-dialog.component';
import { SetMictophoneLevelDialogComponent } from './components/set-mictophone-level-dialog/set-mictophone-level-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { UserSnapshotDialogComponent } from './components/user-snapshot-dialog/user-snapshot-dialog.component';
import { RecordingsTabComponent } from './components/recordings-tab/recordings-tab.component';
import { RecordingViewUrlColumnComponent } from './components/recording-view-url-column/recording-view-url-column.component';
import { EditReservationRequestPageComponent } from './pages/edit-reservation-request-page/edit-reservation-request-page.component';
import { ReservationFormsModule } from '../reservation-forms/reservation-forms.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ShongoTableModule } from '../shongo-table/shongo-table.module';

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
