import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTakingCourseComponent } from './student-taking-course.component';

describe('StudentTakingCourseComponent', () => {
  let component: StudentTakingCourseComponent;
  let fixture: ComponentFixture<StudentTakingCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTakingCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTakingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
