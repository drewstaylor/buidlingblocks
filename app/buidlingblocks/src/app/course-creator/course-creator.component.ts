import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule }   from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
import { HasherService } from '../services/hasher.service';
import { Buffer } from 'buffer';

declare let window: any;

@Component({
  selector: 'app-course-creator',
  templateUrl: './course-creator.component.html',
  styleUrls: ['./course-creator.component.css']
})
export class CourseCreatorComponent implements OnInit {
  /**
   * AGE GROUPS ENUM:
   * 0 = Preschool
   * 1 = Elementary
   * 2 = Secondary
   */
  readonly AGE_GROUPS = ['preschool', 'elemntary', 'secondary'];

  // Form elements
	@ViewChild('courseForm') courseForm: NgForm;

  public courseContent = {
    courseTitle: null,
    courseType: -1,
    steps: [
      {title: null, body: null, file: null}
    ],
    exams: [
      {file: null, totalQuestions: null}
    ],
    answers: [],
    ageGroup: -1
  };

  file: any;

  private courseSubmission: string;
  private hashedAnswers: Array<string>;

  constructor(
    private authService: AuthService,
    private contractService: ContractService,
    private ipfsService: IpfsService,
    private hasherService: HasherService
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
    this.courseContent.steps.push({title: null, body: null, file: null});
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
        this.courseContent.exams[index].file = ipfsHash[0].hash;
      else if (context === 0)
        this.courseContent.steps[index].file = ipfsHash[0].hash;
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

  public async submitCourse() {
    console.log('Submitting course...', this.courseContent);
    
    // TODO: Submit course to Ethereum network through contract service
    
    // Send a JSON Stringified version of courseContent to IPFS
    let jsonData = JSON.stringify(this.courseContent);
    const buffer = Buffer.from(jsonData);

    const ipfsHash = await this.ipfsService.ipfs.add(buffer);
    console.log('ipfsHash =>', ipfsHash);
    this.courseSubmission = ipfsHash[0].hash;

    let answersRaw = this.courseContent.answers;
    // Hash answer results one x one
    this.hashedAnswers = [];
    for (var i = 0; i < answersRaw.length; i++) {
      // Hash a toLowerCase() version of the answer
      // to promote consistency of test answers
      let answerRaw = answersRaw[i].value.toLowerCase();
      let answerHashed = this.hasherService.hash(answerRaw)
      this.hashedAnswers.push(answerHashed);
    }
    console.log('Array of Hashed Correct Answers', this.hashedAnswers);

    await this.contractService.launchCourse(this.courseSubmission, this.hashedAnswers);
  } 


}
