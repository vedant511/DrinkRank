import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleMemberComponent } from './console-member.component';

describe('ConsoleMemberComponent', () => {
  let component: ConsoleMemberComponent;
  let fixture: ComponentFixture<ConsoleMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
