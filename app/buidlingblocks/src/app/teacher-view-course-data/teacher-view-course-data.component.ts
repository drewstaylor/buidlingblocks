import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IpfsService } from '../services/ipfs.service';
import { ChildContractService } from '../services/child-contract.service';

declare let window: any;

@Component({
  selector: 'app-teacher-view-course-data',
  templateUrl: './teacher-view-course-data.component.html',
  styleUrls: ['./teacher-view-course-data.component.css']
})
export class TeacherViewCourseDataComponent implements OnInit {

  public readonly ANSWER_TYPE_MULTIPLE_CHOICE: number = 0;
  public readonly ANSWER_TYPE_TRUE_FALSE: number = 1;
  public readonly ANSWER_TYPE_MATH: number = 2;
  public readonly AGE_GROUP_PRESCHOOL: number = 0;
  public readonly AGE_GROUP_ELEMENTARY: number = 1;
  public readonly AGE_GROUP_SECONDARY: number = 2;
  public readonly COURSE_TYPE_MATH: number = 0;
  public readonly COURSE_TYPE_READING: number = 1;
  public readonly COURSE_TYPE_SCIENCE: number = 2;

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
    private ipfsService: IpfsService,
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { 
    this.authService.login(false);
    this.routerContext = this.route.snapshot.url;
    this.courseAddress = this.routerContext[2].path;
  }

  async ngOnInit() {
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
    

    // Load IPFS data
    let fileHash = null;
    console.log([typeof courseData[0], courseData[0]])
    let stream = this.ipfsService.readFileAsStream(courseData[0]);
    stream.on('data', (file) => {
      // Write the file's path and contents to standard out
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

  private getSafeFilename(filename: string) {
    let safeFilename = filename.replace(/[^\w\s]/gi, '');
    return safeFilename;
  }

  private getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
