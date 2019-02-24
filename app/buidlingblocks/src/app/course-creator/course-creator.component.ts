import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';
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
  readonly AGE_GROUPS = ['preschool', 'elemntary', 'secondary'];

  // Form elements
  @ViewChild('courseForm') courseForm: NgForm;
  
  public readonly ANSWER_TYPE_MULTIPLE_CHOICE: number = 0;
  public readonly ANSWER_TYPE_TRUE_FALSE: number = 1;
  public readonly ANSWER_TYPE_MATH: number = 2;
  public readonly AGE_GROUP_PRESCHOOL: number = 0;
  public readonly AGE_GROUP_ELEMENTARY: number = 1;
  public readonly AGE_GROUP_SECONDARY: number = 2;
  public readonly COURSE_TYPE_MATH: number = 0;
  public readonly COURSE_TYPE_READING: number = 1;
  public readonly COURSE_TYPE_SCIENCE: number = 2;

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
    private hasherService: HasherService,
    private router: Router
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

  /**
   * Utility function to dynamically resize the number of form fields for a course creation
   * form. Takes the resize number and form context as arguments
   * @param n {Number}: A give number n will be set as the new total on the target context
   * @param context {String}: The form element to be resized
   * @param index {Number}: If parsing a single value inside an array, use this index to target the single array value
   */
  arrayMaker(n: number, context: string, index: number): void {
    switch (context) {
      case 'examQuestions':
        switch (n < this.courseContent.answers.length) {
          // Remove elements from the array
          case true:
            this.courseContent.answers = this.courseContent.answers.slice(0, n);
            break;
          // Add elements to the array without overwriting
          // any currently declared values
          default:
            this.courseContent.answers = (this.courseContent.answers.length) ? this.courseContent.answers : [];
            for (let i = 0; i < n; i++) {
              if (!this.courseContent.answers[i])
                this.courseContent.answers.push({type: -1, value: null, choices: null});
            }
        }
        break;
      case 'multipleChoiceOptions':
        // If null array (length undefined)
        if (!this.courseContent.answers[index].choices)
          this.courseContent.answers[index].choices = [];

        switch (n < this.courseContent.answers[index].choices.length) {
          // Remove elements from the array
          case true:
            this.courseContent.answers[index].choices = this.courseContent.answers[index].choices.slice(0, n);
            break;
          // Add elements to the array without overwriting
          // any currently declared values
          default:
            this.courseContent.answers[index].choices = (this.courseContent.answers[index].choices) ? this.courseContent.answers[index].choices : [{isCorrect: false, value: null}];
            for (let i = 0; i < n; i++) {
              if (!this.courseContent.answers[index].choices[i])
                this.courseContent.answers[index].choices.push({isCorrect: false, value: null});
            }
        }
        break;
    }
  }

  /**
   * Sets the correct answer of a multiple choice question
   * @param question {Number}: The index of the target question to set the correct answer on
   * @param correctChoice {Number}: The index of the target multiple choice option to set as the correct answer for a given question
   */
  public setCorrectMultipleChoiceAnswer(question: number, correctChoice: string): void {
    this.courseContent.answers[question].choices[parseInt(correctChoice)].isCorrect = true;
  }

  /**
   * If selected answer type is True / False set -1 so the placeholder option is displayed
   * @param question {Number}: The index of the target question to initialize
   * @param selectedAnswerType: {String}: String format of answer type enum
   */
  public answerTypeSelected(question: number, selectedAnswerType: string) {
    if (parseInt(selectedAnswerType) === this.ANSWER_TYPE_TRUE_FALSE) {
      this.courseContent.answers[question].value = -1;
    }
  }

  public async submitCourse() {
    console.log('Submitting course...', this.courseContent);
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
    // Submit course
    let courseLaunch = await this.contractService.launchCourse(
      this.courseSubmission,
      this.courseContent.courseTitle,
      this.courseContent.courseType,
      this.courseContent.ageGroup,
      this.hashedAnswers
    );

    if (courseLaunch) {
      this.router.navigate(['/teacher/my-courses']);
    }
  } 


}
