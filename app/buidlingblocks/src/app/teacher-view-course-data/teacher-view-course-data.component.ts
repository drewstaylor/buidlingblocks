import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { ChildContractService } from '../services/child-contract.service';

declare let window: any;

@Component({
  selector: 'app-teacher-view-course-data',
  templateUrl: './teacher-view-course-data.component.html',
  styleUrls: ['./teacher-view-course-data.component.css']
})
export class TeacherViewCourseDataComponent implements OnInit {

  public courseData: any = {
    name: null,
    ageGroup: null,
    courseType: null,
    courseAddress: null,
    ipfsHash: null
  };

  public courseMaterial: any = {
    steps: null,
    exams: null,
    answers: null,
    studentAnswers: null
  };

  public courseAddress;
  public ipfs;

  private routerContext: Array<any> = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private courseContractService: ChildContractService,
    private changeDetector: ChangeDetectorRef
  ) { 
    this.authService.login(false);
    this.routerContext = this.route.snapshot.url;
    this.courseAddress = this.routerContext[2].path;
  }

  async ngOnInit() {
    console.log('CA =>', this.courseAddress);
    this.loadCourse(this.courseAddress);
  }

  public async loadCourse (courseAddress: string) {
    // Reset courseData
    
    let courseData = await this.courseContractService.getCourseData(courseAddress);
    console.log('courseData', [courseAddress, courseData]);
    this.courseData.name = courseData[1];
    this.courseData.ageGroup = courseData[3];
    this.courseData.courseType = courseData[2];
    this.courseData.ipfsHash = courseData[0];
    this.courseData.courseAddress = this.courseAddress;
    
  }
}
