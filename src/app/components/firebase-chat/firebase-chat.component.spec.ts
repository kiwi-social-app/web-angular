import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseChatComponent } from './firebase-chat.component';

describe('FirebaseChatComponent', () => {
  let component: FirebaseChatComponent;
  let fixture: ComponentFixture<FirebaseChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirebaseChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
