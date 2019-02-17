import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// Components
import { EntryComponent } from './entry/entry.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SessionTypeComponent } from './session-type/session-type.component';
// Teacher Components
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { CourseCreatorComponent } from './course-creator/course-creator.component';
import { TeacherViewCourseDataComponent } from './teacher-view-course-data/teacher-view-course-data.component';
// Student Components
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { StudentTakingCourseComponent } from './student-taking-course/student-taking-course.component';
import { Http } from '@angular/http';

const routes: Routes = [
    {path: '', component: EntryComponent},
    {path: 'login', component: AuthenticationComponent},
    {path: 'logout', component: AuthenticationComponent},
    {path: 'choose-your-own-adventure', component: SessionTypeComponent},
    // Teacher Routes
    {path: 'teacher/dashboard', component: TeacherDashboardComponent},
    {path: 'teacher/my-courses', component: MyCoursesComponent},
    {path: 'teacher/course/:id', component: TeacherViewCourseDataComponent},
    {path: 'teacher/new-course', component: CourseCreatorComponent},
    // Student Routes
    {path: 'student/dashboard', component: StudentDashboardComponent},
    {path: 'student/my-grades', component: StudentCoursesComponent},
    {path: 'student/browse', component: CoursesListComponent},
    {path: 'student/course/:id', component: StudentTakingCourseComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [Http]
})

export class AppRoutingModule { }