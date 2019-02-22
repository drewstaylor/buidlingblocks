import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
import { HasherService } from '../services/hasher.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare let window: any;

@Component({
  selector: 'app-student-taking-course',
  templateUrl: './student-taking-course.component.html',
  styleUrls: ['./student-taking-course.component.css']
})
export class StudentTakingCourseComponent implements OnInit {

  public courseData: any = {
    name: null,
    ageGroup: null,
    courseType: null
  };

  public courseMaterial: any = {
    steps: null,
    exams: null,
    answers: null,
    studentAnswers: null,
    unverifiedTestScores: null,
    unsubmittedTestGrade: null
  };

  public resultsReadyToSubmit: boolean = false;

  public courseIndex;
  public courseAddress;
  public ipfs;

  private routerContext: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private contractService: ContractService,
    private ipfsService: IpfsService,
    private hasherService: HasherService,
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef
  ) {
    this.authService.login(false);
    this.routerContext = this.route.snapshot.url;
    this.courseIndex = this.routerContext[2].path;
  }

  async ngOnInit() {
    let fileHash = null;
    this.courseData = await this.contractService.getCourseData(this.courseIndex);
    this.courseData.safeFilename = this.getSafeFilename(this.courseData.name);
    
    console.log('courseData',this.courseData);

    // Load IPFS data
    let stream = this.ipfsService.readFileAsStream(this.courseData.ipfsHash);
    stream.on('data', (file) => {
      // write the file's path and contents to standard out
      if (file.type !== 'dir') {
        file.content.on('data', (data: any) => {
          this.courseMaterial = JSON.parse(data.toString());
          console.log('courseMaterial', this.courseMaterial);
          // Generate steps images
          for (var i = 0; i < this.courseMaterial.steps.length; i++) {
            fileHash = this.courseMaterial.steps[i].file;
            this.createImage(fileHash, i);
          }
          // Generate exam images
          for (var j = 0; j < this.courseMaterial.exams.length; j++) {
            fileHash = this.courseMaterial.exams[j].file;
            this.createPDF(fileHash, j);
          }
          // Generate student answer models
          this.courseMaterial.studentAnswers = new Array(this.courseMaterial.answers.length);
        })
        file.content.resume()
      }
    });
  }

  async createImage(ipfsHash: string, index: number) {
    let blob = null;
    let img = null;
    let url = null;
    const data = await this.ipfsService.cat(ipfsHash);
    // Declare blob
    blob = new window.Blob([data]);
    // Declare URL for data blob
    url = window.URL.createObjectURL(blob);
    // Create image / document blob
    img = new Image();
    img.src = url;
    window.setTimeout(() => {
      this.courseMaterial.steps[index].img = this.getSantizeUrl(img.src);
      this.changeDetector.detectChanges();
    }, 0);
  }

  async createPDF(ipfsHash: string, index: number) {
    let blob = null;
    let url = null;
    const pdf = await this.ipfsService.cat(ipfsHash);
    // Declare blob
    blob = new window.Blob([pdf], {type: "application/pdf"});
    // Declare URL for data blob
    url = window.URL.createObjectURL(blob);
    window.setTimeout(() => {
      this.courseMaterial.exams[index].file = this.getSantizeUrl(url);
      this.changeDetector.detectChanges();
    }, 0);
  }

  public checkTestResults(): void {
    console.log('courseMaterial', this.courseMaterial);
    // Get individual scores
    let unsubmittedTestScore = [];
    let correctAnswers = 0;
    // Compare Student answers with Teacher submitted answers
    for (var i = 0; i < this.courseMaterial.answers.length; i++) {
      if (this.courseMaterial.studentAnswers[i] == this.courseMaterial.answers[i].value) {
        unsubmittedTestScore[i] = 1;
        ++correctAnswers;
      } else {
        unsubmittedTestScore[i] = 0;
      }
    }
    this.courseMaterial.unverifiedTestScores = unsubmittedTestScore;
    // Get overall grade and metadata
    this.courseMaterial.unsubmittedTestGrade = this.toUnsubmittedGrade(unsubmittedTestScore.length, correctAnswers);;
    // Reset test form
    //this.courseMaterial.studentAnswers = new Array(this.courseMaterial.answers.length);
    // Scroll to test results
    setTimeout( () => {
      window.scrollTo({ 
        top: (window.scrollY + 400),
        behavior: "smooth" 
      });
    }, 0);
  }

  private getSafeFilename(filename: string) {
    let safeFilename = filename.replace(/[^\w\s]/gi, '');
    return safeFilename;
  }

  private getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * 100% A+ Pefect Score!
   * 90-100% A+	Superb!
   * 80-89% A	Excellent
   * 70-79%	B	Very good
   * 60-69%	C	Good
   * 50-59%	D	Average
   * 40-49%	F	Needs Work
   * 0-39%	F Fail
   * @param totalQuestions {Number}: Total number of questions being scored
   * @param totalCorrectAnswers {Number}: Total correct answers submitted
   */
  private toUnsubmittedGrade(totalQuestions: number, totalCorrectAnswers: number) {
    // Grade as percentage
    let result = (totalCorrectAnswers / totalQuestions) * 100;
    // Pass / Fail
    let passingGrade = (result > 49) ? true : false;
    // Assemble a letter grade and remark
    let grade = null;
    let remark = null;
    if (result === 100) {
      grade = "A++";
      remark = "Perfect Score!";
    } else if (this.numberInRange(result, 90, 99)) {
      grade = "A+";
      remark = "Superb!";
    } else if (this.numberInRange(result, 80, 89)) {
      grade = "A";
      remark = "Excellent!";
    } else if (this.numberInRange(result, 70, 79)) {
      grade = "B";
      remark = "Very Good";
    } else if (this.numberInRange(result, 60, 69)) {
      grade = "C";
      remark = "Good";
    } else if (this.numberInRange(result, 50, 59)) {
      grade = "D";
      remark = "Average";
    } else if (result < 50) {
      grade = "F";
      remark = "Fail";
    }
    // Build output
    let unsubmittedGrade = {
      result: result.toFixed(1),
      totalCorrectAnswers: totalCorrectAnswers,
      totalQuestions: totalQuestions,
      passingGrade: passingGrade,
      grade: grade,
      remark: remark
    };
    // Return unsubmittedGrade object
    return unsubmittedGrade;
  }

  /**
   * Helper function, determines whether a given number X is between a 
   * given minimum and maximum threshold
   * @param x {Number}: The number that is or isn't between min and max
   * @param min {Number}: The number that x is or isn't below
   * @param max {Number}: The number that x is or isn't above
   */
  private numberInRange(x: number, min: number, max: number): boolean {
    return x >= min && x <= max;
  }

}
