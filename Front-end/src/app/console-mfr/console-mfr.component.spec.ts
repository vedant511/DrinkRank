import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleMfrComponent } from './console-mfr.component';

describe('ConsoleMfrComponent', () => {
  let component: ConsoleMfrComponent;
  let fixture: ComponentFixture<ConsoleMfrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleMfrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleMfrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
