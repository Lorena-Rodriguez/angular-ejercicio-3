import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosAuthComponent } from './usuarios-auth.component';

describe('UsuariosAuthComponent', () => {
  let component: UsuariosAuthComponent;
  let fixture: ComponentFixture<UsuariosAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuariosAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
