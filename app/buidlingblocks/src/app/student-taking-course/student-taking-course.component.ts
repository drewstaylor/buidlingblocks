import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-student-taking-course',
  templateUrl: './student-taking-course.component.html',
  styleUrls: ['./student-taking-course.component.css']
})
export class StudentTakingCourseComponent implements OnInit {

  public courseData: any;
  public courseIndex;
  public courseAddress;

  private routerContext: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private contractService: ContractService
  ) {
    this.authService.login(false);

    this.routerContext = this.route.snapshot.url;
    this.courseIndex = this.routerContext[2].path;
  }

  async ngOnInit() {
    this.courseAddress = await this.contractService.getCourse(this.courseIndex);
    console.log('courseAddress', this.courseAddress);
    this.courseData = await this.contractService.getCourseObject(this.courseAddress);
    console.log('courseData', this.courseData);
  }

}
