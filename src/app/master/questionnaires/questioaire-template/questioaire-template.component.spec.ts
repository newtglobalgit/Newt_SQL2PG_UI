import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestioaireTemplateComponent } from './questioaire-template.component';

describe('QuestioaireTemplateComponent', () => {
  let component: QuestioaireTemplateComponent;
  let fixture: ComponentFixture<QuestioaireTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestioaireTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestioaireTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
