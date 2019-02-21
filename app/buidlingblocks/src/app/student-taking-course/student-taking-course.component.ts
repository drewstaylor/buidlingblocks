import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
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
    studentAnswers: null
  };

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
      if(file.type !== 'dir') {
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
