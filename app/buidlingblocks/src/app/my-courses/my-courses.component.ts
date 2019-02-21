import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { ChildContractService } from '../services/child-contract.service';

declare let window: any;

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {

  public courses: Array<string> = [];
  public teacher: string;

  constructor(
    private authService: AuthService,
    private contractService: ContractService,
    private courseContractService: ChildContractService
  ) { 
    // ...
  }

  ngOnInit() {
    // Check login state
    let authState = this.authService.loginAsPromise();
    let that = this;
    authState.then((data) => {
      // User address is ready
      that.loadCourses();
    });
  }

  public async loadCourses () {
    // Load courses list for requesting teacher
    this.courses = await this.contractService.getCoursesByTeacher(window.userAccount);
  }

  public async loadCourse (courseAddress: string) {
    let courseData = await this.courseContractService.getCourseData(courseAddress);
    return courseData;
  }

}
