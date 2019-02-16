import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule }   from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
import { Buffer } from 'buffer';

declare let window: any;

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
      {title: null, body: null, file: null}
    ],
    exams: [
      {file: null, totalQuestions: null}
    ],
    answers: []
  };

  file: any;

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
    this.courseContent.exams.push({file: null, totalQuestions: null});
  }

  public removeFile(): void {
    this.courseContent.exams.pop();
  }

  fileChangedCourseAsset(e, index) {
    console.log('fileChanged', [e,index]);
    const file = e.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader, index, 0);
  }

  fileChanged(e, index) {
    console.log('fileChanged', [e,index]);
    const file = e.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader, index, 1);
  }

  convertToBuffer = async(reader, index, context) => {
    const buffer = await Buffer.from(reader.result);
    await this.ipfsService.ipfs.add(buffer, (err, ipfsHash) => {
      console.log('ipfsHash =>', ipfsHash);
      if (context === 1) 
        this.courseContent.exams[index].file = ipfsHash;
      else if (context === 0)
        this.courseContent.steps[index].file = ipfsHash;
      // Debug
      console.log('courseContent =>', this.courseContent);
    });
  };

  arrayMaker(n: number): void {
    this.courseContent.answers = [];
    for (var i = 0; i < n; i++) {
      this.courseContent.answers.push({type: -1, value: null});
    }
  }

  public submitCourse(): void {
    console.log('Submitting course...', this.courseContent);
    // TODO: Submit course through service
    // IPFS upload plus blockchain transaction
  } 


}
