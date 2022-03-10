import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingsTabComponent } from './recordings-tab.component';

describe('RecordingsTabComponent', () => {
  let component: RecordingsTabComponent;
  let fixture: ComponentFixture<RecordingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordingsTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
