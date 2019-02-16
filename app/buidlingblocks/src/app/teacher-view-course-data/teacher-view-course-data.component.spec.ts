import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherViewCourseDataComponent } from './teacher-view-course-data.component';

describe('TeacherViewCourseDataComponent', () => {
  let component: TeacherViewCourseDataComponent;
  let fixture: ComponentFixture<TeacherViewCourseDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherViewCourseDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherViewCourseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
