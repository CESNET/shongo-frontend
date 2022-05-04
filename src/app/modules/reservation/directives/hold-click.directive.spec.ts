import { ElementRef } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HoldClickDirective } from './hold-click.directive';

class MockElementRef implements ElementRef {
  nativeElement = {};
}

describe('HoldClickDirective', () => {
  it('should create an instance', () => {
    const directive = new HoldClickDirective(new MockElementRef());
    expect(directive).toBeTruthy();
  });
});
