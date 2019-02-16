import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { EntryComponent } from './entry/entry.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SessionTypeComponent } from './session-type/session-type.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    EntryComponent,
    AuthenticationComponent,
    SessionTypeComponent,
    TeacherDashboardComponent,
    StudentDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
