import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// Components
import { EntryComponent } from './entry/entry.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SessionTypeComponent } from './session-type/session-type.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';

const routes: Routes = [
    {path: '', component: EntryComponent},
    {path: 'login', component: AuthenticationComponent},
    {path: 'choose-your-own-adventure', component: SessionTypeComponent},
    {path: 'teacher/dashboard', component: TeacherDashboardComponent},
    {path: 'student/dashboard', component: StudentDashboardComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})

export class AppRoutingModule { }