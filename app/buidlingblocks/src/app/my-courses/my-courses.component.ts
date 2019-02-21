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

  public courses: Array<any> = [];
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
    let courses = await this.contractService.getCoursesByTeacher(window.userAccount);
    for (let i = 0; i < courses.length; i++) {
      let course = await this.loadCourse(courses[i]);
      this.courses.push({
        address: courses[i],
        title: course[1],
        ageGroup: course[3],
        courseType: course[2],
        ipfsHash: course[0]
      });
    }
    console.log('this.courses =>', this.courses);
  }

  public async loadCourse (courseAddress: string) {
    let courseData = await this.courseContractService.getCourseData(courseAddress);
    return courseData;
  }

}
