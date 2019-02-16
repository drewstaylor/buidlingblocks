import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule }   from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';

@Component({
  selector: 'app-course-creator',
  templateUrl: './course-creator.component.html',
  styleUrls: ['./course-creator.component.css']
})
export class CourseCreatorComponent implements OnInit {

  // Form elements
	@ViewChild('courseForm') courseForm: NgForm;

  public courseContent = {
    steps: [
      {title: null, body: null}
    ],
    exams: new Array(1)
  };

  constructor(
    private authService: AuthService,
    private contractService: ContractService,
    private ipfsService: IpfsService
  ) {
    this.authService.login(false);
  }

  ngOnInit() {
    // Connect to contract
    this.contractService.bootstrap();
    this.ipfsService.bootstrap();
    console.log('ipfs =>', this.ipfsService.ipfs);
  }

  public addStep(): void {
    this.courseContent.steps.push({title: null, body: null});
  }

  public removeStep(): void {
    this.courseContent.steps.pop();
  }

  public addFile(): void {
    this.courseContent.exams.push(null);
  }

  public removeFile(): void {
    this.courseContent.exams.pop();
  }

  public submitCourse(): void {
    console.log('Submitting course', this.courseContent);
    // TODO: Submit course through service
    // IPFS upload plus blockchain transaction
  } 


}
