import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { EntryComponent } from './entry/entry.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SessionTypeComponent } from './session-type/session-type.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourseCreatorComponent } from './course-creator/course-creator.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';
import { StudentTakingCourseComponent } from './student-taking-course/student-taking-course.component';

@NgModule({
  declarations: [
    AppComponent,
    EntryComponent,
    AuthenticationComponent,
    SessionTypeComponent,
    TeacherDashboardComponent,
    StudentDashboardComponent,
    CourseCreatorComponent,
    MyCoursesComponent,
    StudentCoursesComponent,
    StudentTakingCourseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
